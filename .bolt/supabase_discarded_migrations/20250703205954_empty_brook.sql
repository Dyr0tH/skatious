/*
  # Create orders and order_items tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `order_number` (text, unique)
      - `status` (text, default 'pending')
      - `total_amount` (numeric)
      - `discount_amount` (numeric, default 0)
      - `discount_code` (text, nullable)
      - `customer_email` (text)
      - `customer_mobile` (text)
      - `customer_alternate_mobile` (text, nullable)
      - `shipping_country` (text)
      - `shipping_state` (text)
      - `shipping_city` (text)
      - `shipping_pin_code` (text)
      - `created_at` (timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (uuid, foreign key to products)
      - `product_name` (text)
      - `size` (text)
      - `quantity` (integer)
      - `item_total` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to view their own orders
    - Add policies for admins to manage all orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  total_amount numeric(10,2) DEFAULT 0 NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0 NOT NULL,
  discount_code text,
  customer_email text NOT NULL,
  customer_mobile text NOT NULL,
  customer_alternate_mobile text,
  shipping_country text NOT NULL,
  shipping_state text NOT NULL,
  shipping_city text NOT NULL,
  shipping_pin_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  size text DEFAULT '' NOT NULL,
  quantity integer DEFAULT 1 NOT NULL,
  item_total numeric(10,2) DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Orders are editable by admins"
  ON orders
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Order items are editable by admins"
  ON order_items
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert order items for their own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));