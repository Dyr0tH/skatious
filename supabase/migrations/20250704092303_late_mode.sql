/*
  # Add name field to profiles table

  1. Changes
    - Add `full_name` column to profiles table
    - Update existing policies to include the new field
  
  2. Security
    - No changes to RLS policies needed as they already cover all columns
*/

-- Add full_name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;

-- Update the column to be not null with a default for existing records
UPDATE profiles SET full_name = 'User' WHERE full_name IS NULL;
ALTER TABLE profiles ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN full_name SET DEFAULT '';