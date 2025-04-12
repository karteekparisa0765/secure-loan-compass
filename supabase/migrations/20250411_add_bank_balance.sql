-- Add bank_balance column to profiles table
ALTER TABLE profiles 
ADD COLUMN bank_balance DECIMAL(10,2) DEFAULT 10000.00 NOT NULL;

-- Update existing profiles to have a default balance
UPDATE profiles SET bank_balance = 10000.00 WHERE bank_balance IS NULL;
