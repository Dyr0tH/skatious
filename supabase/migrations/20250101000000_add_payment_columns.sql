-- Add payment-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT; 