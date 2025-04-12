-- Add rejection_reason column to loan_applications table
ALTER TABLE loan_applications
ADD COLUMN rejection_reason TEXT;
