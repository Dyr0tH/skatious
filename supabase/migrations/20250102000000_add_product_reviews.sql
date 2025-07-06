/*
  # Add Product Reviews System

  ## Overview
  This migration creates a comprehensive product review system with:
  1. Product reviews table with proper foreign key constraints
  2. Row Level Security (RLS) policies
  3. Computed fields on products table for quick rating access
  4. Functions and triggers to maintain rating averages

  ## Features
  - One review per user per product
  - Rating validation (1-5 stars)
  - Automatic cascade delete when products are deleted
  - Real-time rating averages
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
ALTER TABLE products ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Enable RLS on product_reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_reviews

-- Anyone can view all reviews
CREATE POLICY "Anyone can view reviews" ON product_reviews
  FOR SELECT USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create own reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON product_reviews
  FOR DELETE USING (auth.uid() = user_id);

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