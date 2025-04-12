import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ArrowRight,
  Calendar,
  DollarSign,
  FileBarChart,
  Clock,
  ChevronRight,
  Download,
  Bell,
  User,
  FileText,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [payments, setPayments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cibilScore, setCibilScore] = useState<number | null>(null);
  const [bankBalance, setBankBalance] = useState<number>(0);
  const [showUpdateBalance, setShowUpdateBalance] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [updateError, setUpdateError] = useState("");

  // Function to fetch all notifications
  const fetchNotifications = async () => {
    try {
      // Fetch notifications from notifications table
      const { data: notifs, error: notifsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (notifsError) {
        console.error('Error fetching notifications:', notifsError);
        return;
      }

      // Map notifications to consistent format
      const formattedNotifs = (notifs || []).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        created_at: n.created_at,
        is_read: n.is_read,
        type: 'notification'
      }));

      setNotifications(formattedNotifs);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    }
  };

  // Subscribe to notification changes
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification change received:', payload);
          fetchNotifications(); // Refresh notifications
        }
      )
      .subscribe();

    // Initial fetch
    fetchNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Get current session and set user info
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (data.session) {
        const uid = data.session.user.id;
        setUserId(uid);

        // Fetch bank balance and profile information
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("bank_balance, first_name, last_name")
          .eq("id", uid)
          .single();

        if (profileError) {
          console.error("Error fetching profile data:", profileError);
        } else if (profileData) {
          setBankBalance(profileData.bank_balance);
          setFirstName(profileData.first_name || "");
          setLastName(profileData.last_name || "");
        }
        const { first_name, last_name } = data.session.user.user_metadata;
        const name =
          first_name || last_name
            ? `${first_name || ""} ${last_name || ""}`.trim()
            : data.session.user.email;
        setUserName(name);
      } else {
        console.warn("No session found");
      }
    };

    getSession();
  }, []);

  // Fetch loans when userId changes
  useEffect(() => {
    const fetchLoans = async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("id, loan_type, loan_amount, status, submitted_at, paid_amount, rejection_reason, loan_term, loan_purpose")
        .eq("user_id", userId);
      if (error) {
        console.error("Error fetching loan applications:", error);
      } else {
        setLoans(data || []);
      }
    };

    if (userId) fetchLoans();
  }, [userId]);

  // Fetch transactions for current user with real-time updates
  useEffect(() => {
    if (!userId) return;

    let subscription: any = null;

    // Fetch initial transactions
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order('payment_date', { ascending: false }); // Sort by newest first

        if (error) {
          console.error("Error fetching transactions:", error);
        } else {
          console.log("Initial transactions loaded:", data?.length || 0);
          setTransactions(data || []);
        }

        // Set up subscription for real-time transaction updates
        subscription = supabase
          .channel('transaction-updates')
          .on(
            'postgres_changes',
            {
              event: '*',  // Listen for inserts, updates, and deletes
              schema: 'public',
              table: 'transactions',
              filter: `user_id=eq.${userId}`
            },
            async (payload) => {
              console.log('Transaction update received:', payload);
              
              // Refetch all transactions to ensure proper sorting
              const { data: refreshedData } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", userId)
                .order('payment_date', { ascending: false });
                
              setTransactions(refreshedData || []);
            }
          )
          .subscribe((status) => {
            console.log('Transaction subscription status:', status);
          });
      } catch (err) {
        console.error('Error in transaction setup:', err);
      }
    };

    fetchTransactions();

    // Cleanup subscription
    return () => {
      if (subscription) {
        console.log('Cleaning up transaction subscription');
        subscription.unsubscribe();
      }
    };
  }, [userId]);

  // Fetch payments for current user
  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data || []);
      }
    };
    if (userId) fetchPayments();
  }, [userId]);

  // Fetch notifications for current user
  useEffect(() => {
    if (!userId) return;

    let subscription: any = null;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data || []);
        }

        // Set up subscription for real-time notification updates
        subscription = supabase
          .channel('notification-updates')
          .on(
            'postgres_changes',
            {
              event: '*',  // Listen for inserts, updates, and deletes
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`
            },
            async (payload) => {
              console.log('Notification update received:', payload);
              
              // Refetch all notifications to ensure proper sorting
              const { data: refreshedData } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", userId)
                .order('created_at', { ascending: false });
                
              setNotifications(refreshedData || []);
            }
          )
          .subscribe((status) => {
            console.log('Notification subscription status:', status);
          });
      } catch (err) {
        console.error('Error in notification setup:', err);
      }
    };

    fetchNotifications();

    // Cleanup subscription
    return () => {
      if (subscription) {
        console.log('Cleaning up notification subscription');
        subscription.unsubscribe();
      }
    };
  }, [userId]);

  // Fetch CIBIL score once on component mount and set up subscription
  useEffect(() => {
    if (!userId) return;

    let subscription: any = null;

    // Fetch initial CIBIL score
    const fetchCibilScore = async () => {
      try {
        const { data, error } = await supabase
          .from('cibil_scores')
          .select('score')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching CIBIL score:', error);
        } else if (data?.score) {
          console.log('Initial CIBIL score:', data.score);
          setCibilScore(data.score);
        }

        // Set up subscription AFTER initial fetch
        subscription = supabase
          .channel('cibil-score-updates')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'cibil_scores',
              filter: `user_id=eq.${userId}`
            },
            (payload: { new: { score?: number } }) => {
              console.log('CIBIL score updated via subscription:', payload.new?.score);
              if (payload.new?.score !== undefined) {
                setCibilScore(payload.new.score);
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });
      } catch (err) {
        console.error('Error in CIBIL setup:', err);
      }
    };

    fetchCibilScore();

    // Clean up subscription
    return () => {
      if (subscription) {
        console.log('Cleaning up subscription');
        subscription.unsubscribe();
      }
    };
  }, [userId]);

  // Set up interval to check CIBIL score every minute
  useEffect(() => {
    if (!userId) return;

    // Check immediately on component mount
    const checkAndUpdateCibilScore = async () => {
      if (!userId) return;

      try {
        // Check loans for late status
        const { data: lateLoans, error: loansError } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'accepted')
          .eq('is_late', true);

        if (loansError) {
          console.error('Error checking loans:', loansError);
          return;
        }

        // If no late loans, nothing to do
        if (!lateLoans || lateLoans.length === 0) {
          return;
        }

        // Get current CIBIL score
        const { data: currentScore, error: scoreError } = await supabase
          .from('cibil_scores')
          .select('score, last_updated')
          .eq('user_id', userId)
          .single();

        if (scoreError && scoreError.code !== 'PGRST116') {
          console.error('Error getting current score:', scoreError);
          return;
        }

        // Default score if none exists
        let currentScoreValue = currentScore?.score || 750;
        
        // Decrease score by 20 points each minute
        // After 1 min: 750 -> 730
        // After 2 min: 730 -> 710
        // After 3 min: 710 -> 690, etc.
        const newScore = Math.max(300, currentScoreValue - 20);
        
        console.log(`Decreasing CIBIL score from ${currentScoreValue} to ${newScore} due to late payment`);

        // Update CIBIL score
        const { error: updateError } = await supabase
          .from('cibil_scores')
          .upsert({
            user_id: userId,
            score: newScore,
            last_updated: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (updateError) {
          console.error('Error updating CIBIL score:', updateError);
        } else {
          console.log('CIBIL score updated:', newScore);
          setCibilScore(newScore);
        }
      } catch (error) {
        console.error('Error in checkAndUpdateCibilScore:', error);
      }
    };

    checkAndUpdateCibilScore();

    // Then check every minute
    const interval = setInterval(checkAndUpdateCibilScore, 60000); // Exactly 1 minute

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [userId]);

  // Filter accepted loans
  const activeLoans = loans.filter((loan) => loan.status === "accepted");

  // Calculate total accepted loan amount and total paid amount
  const totalLoanAmount = activeLoans.reduce(
    (acc, loan) => acc + Number(loan.loan_amount),
    0
  );

  // Calculate total outstanding balance using paid_amount from each loan
  const outstandingBalance = activeLoans.reduce(
    (acc, loan) => acc + (Number(loan.loan_amount) - (Number(loan.paid_amount) || 0)),
    0
  );

  // Latest submission date among accepted loans
  const latestSubmission =
    activeLoans.length > 0
      ? new Date(
          activeLoans.reduce((latest, loan) =>
            new Date(loan.submitted_at) > new Date(latest.submitted_at)
              ? loan
              : latest
          ).submitted_at
        ).toLocaleDateString()
      : "N/A";

  // Count pending loan applications (those with status "waiting")
  const pendingCount = loans.filter((loan) => loan.status === "waiting").length;

  // Use the fetched transactions; optionally show only the most recent three
  const recentTransactions = transactions.slice(0, 3);

  // Download PDF statement with loan, payment, transaction data, and balance info
  const downloadPDF = () => {
    try {
      console.log('Generating PDF statement...');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("Loan & Payment Statement", 14, 20);

    // Calculate total paid amount and use the same balance calculation as the dashboard
    const totalPaid = activeLoans.reduce(
      (acc, loan) => acc + (Number(loan.paid_amount) || 0),
      0
    );
    const balance = outstandingBalance;

    // Summary Section
    doc.setFontSize(12);
    doc.text(`Name: ${firstName && lastName ? `${firstName} ${lastName}` : (userName || "User")}`, 14, 30);
    doc.text(`Total Loan Applications: ${loans.length}`, 14, 38);
    doc.text(
      `Accepted Loan Amount: ₹${totalLoanAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      14,
      46
    );
    doc.text(
      `Total Payments: ₹${totalPaid.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      14,
      54
    );
    doc.text(
      `Outstanding Balance: ₹${balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      14,
      62
    );

    let nextY = 70;

    // Payments Table
    if (payments.length > 0) {
      const paymentRows = payments.map((p) => [
        p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A',
        `₹${Number(p.amount).toLocaleString()}`,
        p.description || "N/A",
      ]);

      autoTable(doc, {
        head: [["Date", "Amount", "Description"]],
        body: paymentRows,
        startY: nextY,
      });

      nextY =
        doc.lastAutoTable && doc.lastAutoTable.finalY
          ? doc.lastAutoTable.finalY + 10
          : nextY + 10;
    }

    // Loans Table
    if (loans.length > 0) {
      const loanRows = loans.map((loan) => [
        loan.id,
        loan.loan_type,
        `₹${Number(loan.loan_amount).toLocaleString()}`,
        loan.status,
        loan.submitted_at ? new Date(loan.submitted_at).toLocaleString() : "N/A",
      ]);

      autoTable(doc, {
        head: [["Loan ID", "Type", "Amount", "Status", "Submitted At"]],
        body: loanRows,
        startY: nextY,
      });

      nextY =
        doc.lastAutoTable && doc.lastAutoTable.finalY
          ? doc.lastAutoTable.finalY + 10
          : nextY + 10;
    }

    // Transactions Table
    if (transactions.length > 0) {
      const transactionRows = transactions.map((t) => [
        t.payment_date ? new Date(t.payment_date).toLocaleString() : 'N/A',
        t.description || "N/A",
        t.amount < 0
          ? `-₹${Math.abs(t.amount).toLocaleString()}`
          : `+₹${Math.abs(t.amount).toLocaleString()}`,
      ]);

      autoTable(doc, {
        head: [["Date", "Description", "Amount"]],
        body: transactionRows,
        startY: nextY,
      });
    }

    doc.save("statement.pdf");
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section with Gradient */}
          <div className="relative mb-8 bg-gradient-to-r from-bank-blue to-bank-navy rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {firstName && lastName ? (
                    <span className="text-blue-200">{firstName} {lastName}</span>
                  ) : (
                    userName || "User"
                  )}
                </h1>
                <p className="text-blue-100 text-lg">
                  Manage your loans and track your applications
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={() => navigate("/loans/apply")}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Apply for Loan
                </Button>
                <Button
                  className="bg-white text-bank-navy hover:bg-blue-50"
                  onClick={() => navigate("/make-payment")}
                >
                  <DollarSign className="mr-2 h-4 w-4" /> Make a Payment
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (error) {
                      console.error("Logout error:", error);
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-100">Bank Balance</h3>
                  <DollarSign className="h-5 w-5 text-blue-200" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  ₹{bankBalance.toLocaleString()}
                </div>
                <p className="text-sm text-blue-200">Available Funds</p>
                {showUpdateBalance && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      placeholder="Enter new balance"
                      className="w-full p-2 border rounded bg-white/90 text-bank-navy focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    {updateError && (
                      <p className="text-red-200 text-sm">{updateError}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        onClick={async () => {
                          try {
                            const amount = parseFloat(newBalance);
                            if (isNaN(amount) || amount < 0) {
                              setUpdateError("Please enter a valid amount");
                              return;
                            }
                            
                            const { error: updateError } = await supabase
                              .from('profiles')
                              .update({ bank_balance: amount })
                              .eq('id', userId);

                            if (updateError) throw updateError;

                            setBankBalance(amount);
                            setShowUpdateBalance(false);
                            setNewBalance("");
                            setUpdateError("");
                          } catch (error) {
                            console.error('Error updating balance:', error);
                            setUpdateError("Failed to update balance");
                          }
                        }}
                        className="bg-white text-bank-navy hover:bg-blue-50 w-full"
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShowUpdateBalance(false);
                          setNewBalance("");
                          setUpdateError("");
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-100">Applications</h3>
                  <FileText className="h-5 w-5 text-blue-200" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {loans.length}
                </div>
                <div className="text-sm text-blue-200 flex items-center gap-2">
                  <span className="bg-green-400/20 text-green-200 px-2 py-0.5 rounded">
                    {loans.filter(loan => loan.status === "accepted").length} Accepted
                  </span>
                  <span className="bg-yellow-400/20 text-yellow-200 px-2 py-0.5 rounded">
                    {loans.filter(loan => loan.status === "waiting").length} Pending
                  </span>
                  <span className="bg-red-400/20 text-red-200 px-2 py-0.5 rounded">
                    {loans.filter(loan => loan.status === "rejected").length} Rejected
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-100">Loan Summary</h3>
                  <CreditCard className="h-5 w-5 text-blue-200" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  ₹{totalLoanAmount.toLocaleString()}
                </div>
                <div className="text-sm text-blue-200 flex flex-col">
                  <span>Total Loan Amount</span>
                  <span className="mt-1 text-red-200">
                    ₹{outstandingBalance.toLocaleString()} Outstanding
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-100">CIBIL Score</h3>
                  <FileBarChart className="h-5 w-5 text-blue-200" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {cibilScore || '---'}
                </div>
                <div className="text-sm text-blue-200">
                  {cibilScore ? (
                    <span className={
                      cibilScore >= 750 ? 'text-green-200' :
                      cibilScore >= 650 ? 'text-yellow-200' :
                      'text-red-200'
                    }>
                      {cibilScore >= 750 ? 'Excellent' :
                       cibilScore >= 650 ? 'Good' :
                       'Needs Improvement'}
                    </span>
                  ) : (
                    userId ? 'Calculating...' : 'Please log in'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Loan Applications */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-bank-navy">Your Loan Applications</CardTitle>
                      <CardDescription>Track all your loan applications</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-bank-blue">
                      <Link to="/loans" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loans.length ? (
                      loans.map((loan) => (
                        <div
                          key={loan.id}
                          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-bank-navy">
                                {loan.loan_type}
                              </h4>
                              <p className="text-sm text-gray-500">
                                ID: {loan.id}
                              </p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                              loan.status === "accepted" ? "bg-green-100 text-green-700" :
                              loan.status === "rejected" ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {loan.status}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Amount</p>
                              <p className="text-sm font-semibold text-bank-navy">
                                ₹{Number(loan.loan_amount).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Term</p>
                              <p className="text-sm font-semibold text-bank-navy">
                                {loan.loan_term} months
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Purpose</p>
                              <p className="text-sm font-semibold text-bank-navy">
                                {loan.loan_purpose}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Submitted</p>
                              <p className="text-sm font-semibold text-bank-navy">
                                {new Date(loan.submitted_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {loan.status === "rejected" && loan.rejection_reason && (
                            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                              <p className="text-xs font-medium text-red-600 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-red-700">{loan.rejection_reason}</p>
                            </div>
                          )}

                          {loan.status === "accepted" && (
                            <div className="mt-4 flex gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-bank-blue border-bank-blue hover:bg-bank-blue hover:text-white"
                                onClick={() => navigate(`/make-payment?loanId=${loan.id}`)}
                              >
                                Make Payment
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-600 hover:text-bank-blue"
                              >
                                View Details
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileBarChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">No loan applications yet</p>
                        <Button
                          variant="outline"
                          className="text-bank-blue border-bank-blue hover:bg-bank-blue hover:text-white"
                          onClick={() => navigate("/loans/apply")}
                        >
                          Apply for Your First Loan
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-0 shadow-lg mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-bank-navy">Notifications</CardTitle>
                    <CardDescription>Latest updates and alerts</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                    <Bell className="h-5 w-5 text-bank-blue" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border ${notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-100'}`}
                          onClick={async () => {
                            if (!notification.is_read) {
                              await supabase
                                .from('notifications')
                                .update({ is_read: true })
                                .eq('id', notification.id);
                              fetchNotifications(); // Refresh after marking as read
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-bank-navy">{notification.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Latest Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-bank-navy">Latest Activity</CardTitle>
                  <CardDescription>Recent transactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loans
                      .filter(loan => loan.status === "accepted")
                      .map(loan => (
                        <div key={loan.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-50 rounded-full">
                              <CreditCard className="h-5 w-5 text-bank-blue" />
                            </div>
                            <div>
                              <h4 className="font-medium text-bank-navy">
                                {loan.loan_type} Loan Payment
                              </h4>
                              <p className="text-sm text-gray-500">
                                Last payment: {new Date(loan.last_payment_date || loan.submitted_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-bank-navy">
                              ₹{Number(loan.paid_amount || 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Paid amount
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-bank-navy">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-bank-blue hover:border-bank-blue"
                      onClick={downloadPDF}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Statement
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-bank-blue hover:border-bank-blue"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" /> View Profile
                    </Button>                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-bank-blue hover:border-bank-blue"
                      onClick={() => setShowUpdateBalance(true)}
                    >
                      <DollarSign className="mr-2 h-4 w-4" /> Update Balance
                    </Button>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
