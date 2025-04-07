import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MakePayment = () => {
  const navigate = useNavigate();

  // State for accepted loans and current user session
  const [loans, setLoans] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentType, setPaymentType] = useState("partial"); // "partial" or "full"
  const [paymentAmount, setPaymentAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current session and user accepted loans
  useEffect(() => {
    const getSessionAndLoans = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }
      if (data.session) {
        const uid = data.session.user.id;
        setUserId(uid);
        // Fetch accepted loans for this user
        const { data: loanData, error: loanError } = await supabase
          .from("loan_applications")
          .select("*")
          .eq("user_id", uid)
          .eq("status", "accepted");
        if (loanError) {
          console.error("Error fetching accepted loans:", loanError);
        } else {
          setLoans(loanData || []);
          // Auto-select the first loan if available
          if (loanData && loanData.length > 0) {
            setSelectedLoanId(loanData[0].id);
            setSelectedLoan(loanData[0]);
          }
        }
      }
    };

    getSessionAndLoans();
  }, []);

  // When selectedLoanId changes, update the selectedLoan object and reset payment values
  useEffect(() => {
    const loan = loans.find((l) => String(l.id) === String(selectedLoanId));
    console.log("Selected loan:", loan); // ✅ Debugging
    setSelectedLoan(loan);
    setPaymentType("partial");
    setPaymentAmount("");
    setMessage("");
  }, [selectedLoanId, loans]);
  
  // Calculate outstanding amount from a loan record
const getOutstandingAmount = (loan) => {
  if (!loan) return 0;
  const loanAmount = loan.loan_amount ? Number(loan.loan_amount) : 0;
  const paid = loan.paid_amount ? Number(loan.paid_amount) : 0;
  return loanAmount - paid;
};


  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    if (type === "full" && selectedLoan) {
      // Automatically set to outstanding amount
      setPaymentAmount(getOutstandingAmount(selectedLoan).toString());
    } else {
      setPaymentAmount("");
    }
  };

const handlePayment = async () => {
  if (!selectedLoan) return;

  const outstanding = getOutstandingAmount(selectedLoan);
  const amount = Number(paymentAmount);

  if (isNaN(amount) || amount <= 0) {
    setMessage("Please enter a valid payment amount.");
    return;
  }

  if (amount > outstanding) {
    setMessage("Payment amount cannot exceed the outstanding balance.");
    return;
  }

  setProcessing(true);
  setMessage("");

  const newPaidAmount =
    (selectedLoan.paid_amount ? Number(selectedLoan.paid_amount) : 0) + amount;

  let newStatus = selectedLoan.status;
  if (newPaidAmount >= Number(selectedLoan.loan_amount)) {
    newStatus = "paid";
  }

  const { error: updateError } = await supabase
    .from("loan_applications")
    .update({ paid_amount: newPaidAmount, status: newStatus })
    .eq("id", selectedLoan.id);

  if (updateError) {
    console.error("Payment error:", updateError);
    setMessage("Payment failed. Please try again.");
    setProcessing(false);
    return;
  }

  const { error: insertError } = await supabase.from("transactions").insert([
    {
      user_id: userId,
      loan_id: selectedLoan.id,
      amount: amount,
      payment_type: paymentType,
    },
  ]);

  if (insertError) {
    console.error("Transaction insert error:", insertError);
    setMessage("Payment processed, but transaction recording failed.");
  } else {
    setMessage("Payment successful!");
  }

  setTimeout(() => navigate("/"), 2000);
  setProcessing(false);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Make a Payment</h1>
        {/* If no accepted loans are found */}
        {loans.length === 0 ? (
          <p className="text-center">
            You do not have any accepted loans to make a payment.
          </p>
        ) : (
          <>
            {/* Loan selection */}
            <div className="mb-4">
              <label className="block mb-2 font-medium" htmlFor="loan-select">
                Select Loan
              </label>
              <select
                id="loan-select"
                value={selectedLoanId}
                onChange={(e) => setSelectedLoanId(e.target.value)}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loan_type} – Loan ID: {loan.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Display loan details */}
            {selectedLoan && (
              <div className="mb-4 border p-4 rounded bg-gray-50">
                <p>
                  <strong>Total Loan Amount:</strong> ₹
                  {Number(selectedLoan.loan_amount).toLocaleString()}
                </p>
                <p>
                  <strong>Paid Amount:</strong> ₹
                  {selectedLoan.paid_amount
                    ? Number(selectedLoan.paid_amount).toLocaleString()
                    : "0.00"}
                </p>
                <p>
                  <strong>Outstanding Balance:</strong> ₹
                  {getOutstandingAmount(selectedLoan).toLocaleString()}
                </p>
              </div>
            )}

            {/* Payment type selection */}
            <div className="mb-4">
              <p className="font-medium mb-2">Payment Type</p>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="partial"
                    checked={paymentType === "partial"}
                    onChange={() => handlePaymentTypeChange("partial")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Partial Payment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="full"
                    checked={paymentType === "full"}
                    onChange={() => handlePaymentTypeChange("full")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Full Payment</span>
                </label>
              </div>
            </div>

            {/* Payment amount input */}
            <div className="mb-4">
              <label className="block mb-2 font-medium" htmlFor="amount">
                Payment Amount (₹)
              </label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={paymentType === "full"}
                className="w-full"
              />
            </div>

            {/* Message display */}
            {message && (
              <div className="mb-4 text-sm text-center text-green-600">
                {message}
              </div>
            )}

            {/* Submit button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-3"
            >
              {processing ? "Processing Payment..." : "Submit Payment"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MakePayment;
