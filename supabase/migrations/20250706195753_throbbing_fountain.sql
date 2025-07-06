/*
  # Add Product Reviews System

  1. New Tables
    - `product_reviews`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer, 1-5)
      - `review_text` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Unique constraint on (product_id, user_id)

  2. Product Table Updates
    - Add `average_rating` column
    - Add `total_reviews` column

  3. Security
    - Enable RLS on `product_reviews` table
    - Add policies for CRUD operations
    - Add triggers to automatically update product ratings
*/

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one review per user per product
  UNIQUE(product_id, user_id)
);

-- Add computed fields to products table for quick access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'total_reviews'
  ) THEN
    ALTER TABLE products ADD COLUMN total_reviews INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on product_reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON product_reviews;

-- RLS Policies for product_reviews

-- Anyone can view all reviews
CREATE POLICY "Anyone can view reviews" ON product_reviews
  FOR SELECT TO public USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create own reviews" ON product_reviews
  FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE TO public USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON product_reviews
  FOR DELETE TO public USING (auth.uid() = user_id);

-- Function to update product rating averages
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the product's average rating and total reviews
  UPDATE products 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM product_reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM product_reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update product ratings
DROP TRIGGER IF EXISTS update_product_rating_on_insert ON product_reviews;
DROP TRIGGER IF EXISTS update_product_rating_on_update ON product_reviews;
DROP TRIGGER IF EXISTS update_product_rating_on_delete ON product_reviews;

CREATE TRIGGER update_product_rating_on_insert
  AFTER INSERT ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_update
  AFTER UPDATE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_delete
  AFTER DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Initialize existing products with default values
UPDATE products 
SET average_rating = 0, total_reviews = 0 
WHERE average_rating IS NULL OR total_reviews IS NULL;