/*
  # Update product deletion to cascade properly

  1. Changes
    - Remove the RESTRICT constraint on order_items.product_id
    - Add CASCADE constraint so order_items are deleted when product is deleted
    - This allows products to be deleted even if they have associated orders
    
  2. Security
    - This change allows admins to delete products and their associated order items
    - Order records themselves remain intact, only the product reference is removed
*/

-- First, drop the existing foreign key constraint
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Add the new foreign key constraint with CASCADE
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;