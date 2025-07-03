/*
  # Fix infinite recursion in admin table policies

  1. Problem
    - Current admin policies check admin status by querying the admins table
    - This creates infinite recursion when the policy tries to evaluate itself
    
  2. Solution
    - Replace recursive policies with simpler, non-recursive ones
    - Use direct user ID checks instead of subqueries to admins table
    - Allow users to read their own admin record
    - Only allow existing admins to modify admin records (but check this differently)

  3. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies
    - Ensure proper access control without recursion
*/

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admins table is editable by admins" ON admins;
DROP POLICY IF EXISTS "Admins table is viewable by admins" ON admins;

-- Create new non-recursive policies
-- Allow users to view their own admin record (if it exists)
CREATE POLICY "Users can view own admin record"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow service role to manage admin records (for initial setup)
CREATE POLICY "Service role can manage admins"
  ON admins
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For now, disable INSERT/UPDATE/DELETE for regular users
-- This prevents the recursion issue while maintaining security
-- Admin management should be done through service role or direct database access
CREATE POLICY "Prevent user modifications to admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Prevent user updates to admins"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Prevent user deletions from admins"
  ON admins
  FOR DELETE
  TO authenticated
  USING (false);