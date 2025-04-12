-- Function to handle loan payments and update loan status
CREATE OR REPLACE FUNCTION public.handle_loan_payment(
    p_loan_id BIGINT,
    p_amount DECIMAL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_loan RECORD;
    v_total_paid DECIMAL;
    v_outstanding DECIMAL;
BEGIN
    -- Get loan details
    SELECT * INTO v_loan
    FROM loan_applications
    WHERE id = p_loan_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Loan not found';
    END IF;

    -- Calculate total paid including this payment
    SELECT COALESCE(SUM(amount), 0) + p_amount INTO v_total_paid
    FROM transactions
    WHERE loan_id = p_loan_id;

    -- Calculate outstanding amount
    v_outstanding := v_loan.loan_amount - v_total_paid;

    -- Update loan status based on payment
    UPDATE loan_applications
    SET 
        total_amount_paid = v_total_paid,
        outstanding_amount = v_outstanding,
        is_late = FALSE,
        next_payment_date = 
            CASE 
                WHEN v_outstanding <= 0 THEN NULL  -- Loan fully paid
                ELSE CURRENT_DATE + INTERVAL '1 month'  -- Next month's payment
            END,
        status = 
            CASE 
                WHEN v_outstanding <= 0 THEN 'completed'
                ELSE 'accepted'
            END
    WHERE id = p_loan_id;

END;
$$;
