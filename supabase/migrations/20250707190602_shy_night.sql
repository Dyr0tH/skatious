/*
  # Store complete product details in order items

  1. Schema Changes
    - Add product_description to order_items table
    - Add product_image_url to order_items table for display purposes
    - Remove CASCADE constraint from order_items to products
    - Keep product_id as reference but allow it to be null when product is deleted

  2. Data Preservation
    - Order items will retain all product information even after product deletion
    - Orders will continue to display correctly in both admin and customer views
*/

-- Add new columns to store product details in order items
DO $$
BEGIN
  -- Add product_description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'product_description'
  ) THEN
    ALTER TABLE order_items ADD COLUMN product_description text;
  END IF;

  -- Add product_image_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'product_image_url'
  ) THEN
    ALTER TABLE order_items ADD COLUMN product_image_url text;
  END IF;
END $$;

-- Drop the existing CASCADE constraint and replace with SET NULL
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Add new constraint that sets product_id to NULL when product is deleted
-- This preserves the order item with all its stored product details
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- Update existing order items to include product details where missing
UPDATE order_items 
SET 
  product_description = p.description,
  product_image_url = (
    SELECT pi.image_url 
    FROM product_images pi 
    WHERE pi.product_id = p.id 
    ORDER BY pi.order_index ASC 
    LIMIT 1
  )
FROM products p 
WHERE order_items.product_id = p.id 
  AND (order_items.product_description IS NULL OR order_items.product_image_url IS NULL);