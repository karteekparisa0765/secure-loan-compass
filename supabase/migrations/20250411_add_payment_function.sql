-- Function to handle loan payment transaction
CREATE OR REPLACE FUNCTION make_loan_payment(
  p_user_id UUID,
  p_loan_id BIGINT,
  p_amount DECIMAL
) RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance DECIMAL;
  v_current_paid DECIMAL;
BEGIN
  -- Start transaction
  BEGIN
    -- Update user's bank balance
    UPDATE profiles 
    SET bank_balance = bank_balance - p_amount 
    WHERE id = p_user_id 
    RETURNING bank_balance INTO v_new_balance;

    -- Get current paid amount
    SELECT COALESCE(paid_amount, 0) INTO v_current_paid 
    FROM loan_applications 
    WHERE id = p_loan_id;

    -- Update loan's paid amount
    UPDATE loan_applications 
    SET paid_amount = v_current_paid + p_amount 
    WHERE id = p_loan_id;

    -- Return new balance
    RETURN v_new_balance;
  END;
END;
$$;
