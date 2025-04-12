-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own notifications
CREATE POLICY "Users can read their own notifications"
    ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to update their own notifications (e.g., mark as read)
CREATE POLICY "Users can update their own notifications"
    ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy to allow the system to insert notifications for any user
CREATE POLICY "System can insert notifications"
    ON notifications
    FOR INSERT
    WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function before update
CREATE TRIGGER update_notification_timestamp
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_timestamp();
