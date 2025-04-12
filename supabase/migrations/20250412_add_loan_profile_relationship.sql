-- Add user_id foreign key to loan_applications table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'loan_applications_user_id_fkey'
    ) THEN
        ALTER TABLE loan_applications
        ADD CONSTRAINT loan_applications_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own loan applications"
ON loan_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loan applications"
ON loan_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all loan applications"
ON loan_applications FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'staff'
    )
);

CREATE POLICY "Staff can update loan applications"
ON loan_applications FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'staff'
    )
);
