-- Create cibil_scores table
CREATE TABLE IF NOT EXISTS cibil_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INT4 NOT NULL CHECK (score >= 300 AND score <= 900),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Set up RLS policies
ALTER TABLE cibil_scores ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own CIBIL score
CREATE POLICY "Users can view their own CIBIL score"
ON cibil_scores FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own CIBIL score
CREATE POLICY "Users can update their own CIBIL score"
ON cibil_scores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CIBIL score via upsert"
ON cibil_scores FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
