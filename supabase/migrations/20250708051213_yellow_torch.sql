/*
  # Add product stock management

  1. New Fields
    - `in_stock` (boolean, default true) - Track product availability

  2. Changes
    - Add in_stock column to products table with default value true
    - Update existing products to be in stock by default
*/

-- Add in_stock column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'in_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN in_stock boolean DEFAULT true NOT NULL;
  END IF;
END $$;

-- Update existing products to be in stock
UPDATE products SET in_stock = true WHERE in_stock IS NULL;