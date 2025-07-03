/*
  # Sample Data for SKATIOUS E-commerce

  ## Overview
  This migration populates the database with sample data for development and demonstration purposes.

  ## Data Included
  1. Categories - Different skateboard types
  2. Products - Sample skateboard products
  3. Product Images - Sample images for products
  4. Discount Codes - Sample promotional codes
  5. Admin User - Sample admin account
  6. Special Discount Settings - Initial settings
*/

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Street Skateboards', 'Perfect for street skating and tricks'),
  ('Cruiser Boards', 'Smooth rides for cruising around town'),
  ('Longboards', 'Ideal for long-distance riding and carving'),
  ('Complete Sets', 'Ready-to-ride complete skateboard setups'),
  ('Pro Models', 'Professional skater signature boards')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
WITH category_ids AS (
  SELECT id, name FROM categories
)
INSERT INTO products (name, description, price, category_id, sizes)
SELECT 
  product_data.name,
  product_data.description,
  product_data.price,
  category_ids.id,
  product_data.sizes
FROM (
  VALUES 
    ('Pro Street Cruiser', 'Premium maple construction with perfect pop and durability. Ideal for street skating and technical tricks.', 129.99, 'Street Skateboards', ARRAY['7.5"', '8"', '8.25"', '8.5"']),
    ('Urban Wave Board', 'Sleek design meets performance for urban adventures. Features high-quality bearings and smooth wheels.', 149.99, 'Street Skateboards', ARRAY['7.75"', '8"', '8.25"']),
    ('Classic Maple Deck', 'Traditional skateboard with modern technology. Perfect for beginners and pros alike.', 99.99, 'Street Skateboards', ARRAY['7.5"', '8"', '8.25"', '8.5"']),
    ('Sunset Cruiser', 'Perfect for leisurely rides with soft wheels and responsive trucks. Great for commuting.', 119.99, 'Cruiser Boards', ARRAY['27"', '29"', '32"']),
    ('Beach Rider Pro', 'Designed for smooth coastal rides with premium components and stunning graphics.', 139.99, 'Cruiser Boards', ARRAY['28"', '30"', '32"']),
    ('City Glider', 'Compact cruiser perfect for navigating city streets and campus rides.', 89.99, 'Cruiser Boards', ARRAY['22"', '24"', '27"']),
    ('Mountain Carver', 'Long-distance longboard perfect for carving and downhill riding with precision trucks.', 199.99, 'Longboards', ARRAY['38"', '40"', '42"']),
    ('Speed Demon', 'Built for speed with aerodynamic design and high-performance wheels for racing.', 249.99, 'Longboards', ARRAY['36"', '38"', '40"']),
    ('Flex Rider', 'Flexible bamboo construction provides smooth rides and excellent shock absorption.', 179.99, 'Longboards', ARRAY['38"', '40"', '42"', '44"']),
    ('Beginner Complete', 'Everything you need to start skating. High-quality components at an affordable price.', 79.99, 'Complete Sets', ARRAY['7.5"', '8"', '8.25"']),
    ('Pro Complete Setup', 'Professional-grade complete setup with premium trucks, wheels, and bearings.', 159.99, 'Complete Sets', ARRAY['8"', '8.25"', '8.5"']),
    ('Tony Hawk Signature', 'Official Tony Hawk signature model with his personal graphics and specifications.', 189.99, 'Pro Models', ARRAY['8"', '8.25"']),
    ('Street Legend Pro', 'Signature board from street skating legend with unique artwork and premium construction.', 169.99, 'Pro Models', ARRAY['7.75"', '8"', '8.25"'])
) AS product_data(name, description, price, category_name, sizes)
JOIN category_ids ON category_ids.name = product_data.category_name;

-- Insert sample product images
WITH product_ids AS (
  SELECT id, name FROM products
)
INSERT INTO product_images (product_id, image_url, alt_text, order_index)
SELECT 
  product_ids.id,
  image_data.image_url,
  image_data.alt_text,
  image_data.order_index
FROM (
  VALUES 
    ('Pro Street Cruiser', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'Pro Street Cruiser skateboard', 0),
    ('Pro Street Cruiser', 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg', 'Pro Street Cruiser detail view', 1),
    ('Urban Wave Board', 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg', 'Urban Wave Board skateboard', 0),
    ('Urban Wave Board', 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg', 'Urban Wave Board wheels detail', 1),
    ('Classic Maple Deck', 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg', 'Classic Maple Deck skateboard', 0),
    ('Classic Maple Deck', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'Classic Maple Deck grip tape', 1),
    ('Sunset Cruiser', 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg', 'Sunset Cruiser board', 0),
    ('Sunset Cruiser', 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg', 'Sunset Cruiser side view', 1),
    ('Beach Rider Pro', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'Beach Rider Pro cruiser', 0),
    ('City Glider', 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg', 'City Glider compact cruiser', 0),
    ('Mountain Carver', 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg', 'Mountain Carver longboard', 0),
    ('Mountain Carver', 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg', 'Mountain Carver trucks detail', 1),
    ('Speed Demon', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'Speed Demon racing longboard', 0),
    ('Flex Rider', 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg', 'Flex Rider bamboo longboard', 0),
    ('Beginner Complete', 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg', 'Beginner Complete setup', 0),
    ('Pro Complete Setup', 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg', 'Pro Complete Setup', 0),
    ('Tony Hawk Signature', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'Tony Hawk Signature board', 0),
    ('Street Legend Pro', 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg', 'Street Legend Pro model', 0)
) AS image_data(product_name, image_url, alt_text, order_index)
JOIN product_ids ON product_ids.name = image_data.product_name;

-- Insert sample discount codes
INSERT INTO discount_codes (code, discount_percentage, active) VALUES
  ('WELCOME10', 10, true),
  ('SUMMER20', 20, true),
  ('STUDENT15', 15, true),
  ('FIRSTRIDE25', 25, true),
  ('SKATIOUS30', 30, false)
ON CONFLICT (code) DO NOTHING;

-- Initialize special discount settings (disabled by default)
INSERT INTO special_discount_settings (id, active) VALUES
  ('00000000-0000-0000-0000-000000000001', false)
ON CONFLICT (id) DO NOTHING;

-- Note: Admin users will need to be added manually through the application
-- as they require actual user IDs from the auth.users table