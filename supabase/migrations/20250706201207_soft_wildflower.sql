/*
  # Fix Review Visibility Policies

  1. Security Changes
    - Update RLS policies to allow public viewing of reviews
    - Maintain security for create/update/delete operations
    - Ensure all users can see reviews regardless of authentication status

  2. Changes Made
    - Modified "Anyone can view reviews" policy to use 'anon' and 'authenticated' roles
    - Updated other policies to use proper role specifications
    - Added explicit role grants for public access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON product_reviews;

-- Create new policies with proper role specifications

-- Anyone (including anonymous users) can view all reviews
CREATE POLICY "Anyone can view reviews" ON product_reviews
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Only authenticated users can create reviews (and only their own)
CREATE POLICY "Users can create own reviews" ON product_reviews
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own reviews
CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Only authenticated users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON product_reviews
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure the anon role has SELECT permissions on the table
GRANT SELECT ON product_reviews TO anon;
GRANT SELECT ON products TO anon;
GRANT SELECT ON profiles TO anon;

-- Ensure authenticated users have full CRUD permissions on their own reviews
GRANT SELECT, INSERT, UPDATE, DELETE ON product_reviews TO authenticated;