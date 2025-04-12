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
  const [error, setError] = useState("");
  const [bankBalance, setBankBalance] = useState(10000);

  // Fetch current session, user accepted loans, and bank balance
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
        
        // Fetch user profile and bank balance
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("bank_balance")
          .eq("id", uid)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else if (profileData) {
          setBankBalance(profileData.bank_balance);
        }

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
    console.log("Selected loan:", loan); // Debugging
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

  const calculateCibilScore = async () => {
    if (!userId) return;

    try {
      // Get all loans
      const { data: userLoans, error: loansError } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("user_id", userId);

      if (loansError) {
        console.error("Error fetching loans:", loansError);
        return;
      }

      // Get all transactions
      const { data: userTransactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId);

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
        return;
      }

      if (!userLoans || !userTransactions) {
        console.log("No loan or transaction data found");
        return;
      }

      let score = 700; // Base score

      // 1. Payment History (35% impact)
      const currentDate = new Date();
      const weightedPayments = userTransactions
        .map(t => {
          const paymentDate = new Date(t.created_at);
          const monthsAgo = (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          // Recent payments have higher impact: last 3 months (2x), 3-6 months (1.5x), 6+ months (1x)
          const recencyWeight = monthsAgo <= 3 ? 2 : monthsAgo <= 6 ? 1.5 : 1;
          // On-time payments get full weight, late payments get negative weight
          const punctualityWeight = t.is_late ? -0.5 : 1;
          return recencyWeight * punctualityWeight;
        })
        .reduce((sum, weight) => sum + weight, 0);

      const totalPossibleWeight = userTransactions.length * 2; // Maximum possible weight if all payments were recent and on time
      const paymentScore = totalPossibleWeight > 0 ? (weightedPayments / totalPossibleWeight) * 350 : 0;
      score += paymentScore - 175; // Adjust from base

      // 2. Credit Utilization (30% impact)
      let totalUtilizationScore = 0;
      const activeLoans = userLoans.filter(loan => {
        const paid = Number(loan.paid_amount || 0);
        const total = Number(loan.loan_amount || 0);
        return total > paid;
      });

      if (activeLoans.length > 0) {
        activeLoans.forEach(loan => {
          const total = Number(loan.loan_amount || 0);
          const paid = Number(loan.paid_amount || 0);
          const loanUtilization = paid / total;
          // Higher utilization (more paid off) gets better score
          const loanScore = loanUtilization * 300;
          totalUtilizationScore += loanScore;
        });
        totalUtilizationScore = totalUtilizationScore / activeLoans.length;
      }
      score += totalUtilizationScore - 150;

      // 3. Length of Credit History (15% impact)
      if (userLoans.length > 0) {
        const oldestLoan = new Date(Math.min(...userLoans.map(l => new Date(l.created_at).getTime())));
        const monthsActive = (currentDate.getTime() - oldestLoan.getTime()) / (1000 * 60 * 60 * 24 * 30);
        const paymentsPerMonth = userTransactions.length / Math.max(1, monthsActive);
        const frequencyBonus = Math.min(paymentsPerMonth * 10, 50); // Up to 50 points bonus for frequent payments
        const historyScore = Math.min(monthsActive * 5, 100) + frequencyBonus;
        score += historyScore - 75;
      }

      // 4. Types of Credit (20% impact)
      const uniqueLoanTypes = new Set(userLoans.map(l => l.loan_type)).size;
      const goodStandingLoans = activeLoans.filter(loan => {
        const paid = Number(loan.paid_amount || 0);
        const total = Number(loan.loan_amount || 0);
        const paymentRatio = paid / total;
        // Consider loans with at least 15% paid as good standing
        return paymentRatio >= 0.15;
      }).length;

      // Calculate diversity score (10%) and performance score (10%)
      const diversityScore = Math.min(uniqueLoanTypes * 50, 100); // Up to 100 points for diverse loan types
      const performanceScore = Math.min(goodStandingLoans * 50, 100); // Up to 100 points for good standing loans
      score += ((diversityScore + performanceScore) / 2) - 100; // Average of both scores, adjusted from base

      // Ensure score stays within 300-900 range
      score = Math.max(300, Math.min(900, Math.round(score)));

      console.log("Calculated CIBIL score:", score);

      // Update CIBIL score in database
      const { error: updateError } = await supabase
        .from("cibil_scores")
        .upsert([
          {
            user_id: userId,
            score: score,
            last_updated: new Date().toISOString()
          }
        ]);

      if (updateError) {
        console.error("Error updating CIBIL score:", updateError);
        return;
      }

      console.log("Successfully updated CIBIL score:", score);
    } catch (error) {
      console.error("Error calculating CIBIL score:", error);
    }
  };

  // Function to update CIBIL score after payment
  const updateCibilScore = async () => {
    try {
      // Get current score
      const { data: currentScore } = await supabase
        .from('cibil_scores')
        .select('score')
        .eq('user_id', userId)
        .single();
        
      // Default or current score
      const baseScore = currentScore?.score || 750;
        
      // Small bonus for on-time payment (+5 points)
      const newScore = Math.min(baseScore + 5, 900); // Cap at 900
        
      // Update CIBIL score
      await supabase
        .from('cibil_scores')
        .upsert({
          user_id: userId,
          score: newScore,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      console.log('CIBIL score updated after payment:', newScore);
    } catch (error) {
      console.error('Error updating CIBIL score:', error);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setMessage("");
    setError("");

    try {
      if (!selectedLoan) {
        throw new Error("No loan selected");
      }

      const amount =
        paymentType === "full"
          ? getOutstandingAmount(selectedLoan)
          : Number(paymentAmount);

      // Validate payment amount is greater than 0
      if (amount <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }

      // Validate bank balance
      if (amount > bankBalance) {
        throw new Error("Insufficient bank balance to make this payment");
      }

      const outstanding = getOutstandingAmount(selectedLoan);
      if (amount > outstanding) {
        throw new Error("Payment amount cannot exceed outstanding balance");
      }

      // Update bank balance in the profiles table
      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ bank_balance: bankBalance - amount })
        .eq("id", userId);

      if (balanceError) {
        throw new Error("Error updating balance: " + balanceError.message);
      }

      // Update local bank balance
      setBankBalance(bankBalance - amount);

      // Record the transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          loan_id: parseInt(selectedLoan.id, 10),
          amount: amount,
          payment_type: paymentType,
          is_late: false,
          due_date: selectedLoan.next_payment_date,
          payment_date: new Date().toISOString(),
        });

      if (transactionError) {
        // Rollback bank balance update if there's an error
        await supabase
          .from("profiles")
          .update({ bank_balance: bankBalance })
          .eq("id", userId);
        throw new Error("Error recording transaction: " + transactionError.message);
      }

      // Validate and parse payment amount before calling RPC
      const parsedAmount = parseFloat(amount.toString());
      console.log("Parsed payment amount:", parsedAmount);
      if (isNaN(parsedAmount)) {
        throw new Error("Invalid payment amount: Please enter a valid number.");
      }

      // Update loan payment status using the RPC function.
      // Explicitly convert p_loan_id and p_amount to the desired types.
      const { error: loanUpdateError } = await supabase.rpc("handle_loan_payment", {
        p_loan_id: parseInt(selectedLoan.id, 10),
        p_amount: parsedAmount,
      });

      if (loanUpdateError) {
        // Rollback transaction and bank balance update if necessary.
        await supabase
          .from("profiles")
          .update({ bank_balance: bankBalance })
          .eq("id", userId);
        throw new Error("Error updating loan status: " + loanUpdateError.message);
      }

      // Immediately update loan status to not late
      const { error: loanStatusError } = await supabase
        .from("loan_applications")
        .update({
          is_late: false,
          next_payment_date: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ).toISOString(),
        })
        .eq("id", selectedLoan.id);

      if (loanStatusError) {
        console.error("Error updating loan status:", loanStatusError);
      }

      // Create notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          title: "Payment Successful",
          message: `Payment of ₹${amount.toLocaleString()} processed for Loan ID: ${selectedLoan.id}. ${paymentType === 'full' ? 'Full payment completed.' : `Outstanding balance: ₹${(selectedLoan.loan_amount - (selectedLoan.paid_amount + amount)).toLocaleString()}`}`,
          is_read: false,
          created_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }

      // Run score update
      await updateCibilScore();

      // Refresh loans data
      const { data: updatedLoans, error: loanError } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "accepted");

      if (loanError) {
        console.error("Error refreshing loans:", loanError);
      } else {
        setLoans(updatedLoans || []);
      }

      setMessage("Payment processed successfully!");
      setPaymentAmount("");
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
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
            {/* Display bank balance */}
            <div className="mb-4 border p-4 rounded bg-blue-50">
              <p className="font-medium">
                Available Bank Balance:{" "}
                <span className="text-lg text-bank-blue">
                  ₹{bankBalance.toLocaleString()}
                </span>
              </p>
            </div>

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

            {/* Error display */}
            {error && (
              <div className="mb-4 text-sm text-center text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

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
