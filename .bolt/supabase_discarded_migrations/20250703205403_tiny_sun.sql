/*
  # Order Management System

  1. New Tables
    - `orders` - Main order table with customer and order details
    - `order_items` - Individual items within each order
    - `order_status_history` - Track status changes over time

  2. Security
    - Enable RLS on all new tables
    - Users can only view their own orders
    - Admins can view and manage all orders

  3. Order Status Flow
    - pending - Order placed, awaiting processing
    - processing - Order being prepared
    - shipped - Order dispatched
    - delivered - Order delivered to customer
    - cancelled - Order cancelled
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  discount_code text,
  discount_percentage integer DEFAULT 0,
  
  -- Customer information
  customer_email text NOT NULL,
  customer_mobile text NOT NULL,
  customer_alternate_mobile text,
  
  -- Shipping address
  shipping_country text NOT NULL,
  shipping_state text NOT NULL,
  shipping_city text NOT NULL,
  shipping_pin_code text NOT NULL,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  product_price numeric(10,2) NOT NULL,
  size text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  item_total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_status_history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

CREATE POLICY "Admins can update all orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create order items for their orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

-- RLS Policies for order_status_history
CREATE POLICY "Users can view their order status history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all order status history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

CREATE POLICY "Admins can create order status history"
  ON order_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
  ));

-- Function to update order updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_updated_at();

-- Function to create status history entry when order status changes
CREATE OR REPLACE FUNCTION create_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create status history
CREATE TRIGGER create_order_status_history
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_status_history();