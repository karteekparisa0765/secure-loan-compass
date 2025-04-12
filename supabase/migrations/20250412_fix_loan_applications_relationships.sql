-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS loan_applications 
DROP CONSTRAINT IF EXISTS loan_applications_user_id_fkey;

-- Add foreign key constraint to loan_applications table
ALTER TABLE loan_applications 
ADD CONSTRAINT loan_applications_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Create index for better join performance
CREATE INDEX IF NOT EXISTS idx_loan_applications_user_id 
ON loan_applications(user_id);

-- Enable RLS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for staff to view all applications
CREATE POLICY "Staff can view all applications"
ON loan_applications FOR SELECT
TO authenticated
USING (true);

-- Create RLS policy for staff to update applications
CREATE POLICY "Staff can update applications"
ON loan_applications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
