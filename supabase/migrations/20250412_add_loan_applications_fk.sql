-- Add foreign key constraint to loan_applications table
ALTER TABLE loan_applications 
ADD CONSTRAINT fk_loan_applications_user 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id);

-- Create RLS policy to allow joining with profiles
CREATE POLICY "Enable read access for authenticated users"
ON public.loan_applications
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
