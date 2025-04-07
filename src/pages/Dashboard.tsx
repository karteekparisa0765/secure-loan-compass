import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ArrowRight,
  FileText,
  Calendar,
  DollarSign,
  FileBarChart,
  Clock,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [payments, setPayments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Get current session and set user info
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (data.session) {
        setUserId(data.session.user.id);
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

  // Fetch transactions for current user
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setTransactions(data || []);
      }
    };
    if (userId) fetchTransactions();
  }, [userId]);

  // Fetch notifications for current user
  useEffect(() => {
    const fetchNotifications = async () => {
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
    };
    if (userId) fetchNotifications();
  }, [userId]);

  // Fetch loan applications for current user
  useEffect(() => {
    const fetchLoans = async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("Error fetching loan applications:", error);
      } else {
        setLoans(data || []);
      }
    };
    if (userId) fetchLoans();
  }, [userId]);

  // Filter accepted loans
  const activeLoans = loans.filter((loan) => loan.status === "accepted");

  // Calculate total accepted loan amount
  const totalLoanAmount = activeLoans.reduce(
    (acc, loan) => acc + Number(loan.loan_amount),
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
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("Loan & Payment Statement", 14, 20);

    // Calculate total payments and balance
    const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const balance = totalLoanAmount - totalPayments;

    // Summary Section
    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 14, 30);
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
      `Total Payments: ₹${totalPayments.toLocaleString(undefined, {
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
        new Date(p.created_at).toLocaleString(),
        `₹${Number(p.amount).toLocaleString()}`,
        p.description || "N/A",
      ]);

      doc.autoTable({
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

      doc.autoTable({
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
        new Date(t.created_at).toLocaleString(),
        t.description || "N/A",
        t.amount < 0
          ? `-₹${Math.abs(t.amount).toLocaleString()}`
          : `+₹${Math.abs(t.amount).toLocaleString()}`,
      ]);

      doc.autoTable({
        head: [["Date", "Description", "Amount"]],
        body: transactionRows,
        startY: nextY,
      });
    }

    doc.save("statement.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-bank-navy">
                Welcome, {userName || "User"}
              </h1>
              <p className="text-gray-600">
                Here's an overview of your loan accounts
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                variant="outline"
                className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white"
                onClick={() => navigate("/loans/apply")}
              >
                <FileText className="mr-2 h-4 w-4" /> Apply for Loan
              </Button>
              <Button
                className="bg-bank-blue hover:bg-bank-navy text-white"
                onClick={() => navigate("/make-payment")}
              >
                <DollarSign className="mr-2 h-4 w-4" /> Make a Payment
              </Button>
              <Button
                variant="outline"
                className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white"
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

          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Loan Amount
                  </h3>
                  <CreditCard className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  ₹
                  {totalLoanAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-sm text-gray-600">
                  Across {activeLoans.length} accepted loans
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Latest Submission
                  </h3>
                  <Calendar className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  {latestSubmission}
                </div>
                <p className="text-sm text-gray-600">
                  Most recent accepted loan application
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Loan Applications
                  </h3>
                  <FileBarChart className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  {pendingCount} Pending
                </div>
                <p className="text-sm text-gray-600">
                  Applications under review
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Accepted Loans List */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Active Loans</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-bank-blue"
                    >
                      <Link to="/loans" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activeLoans.length ? (
                      activeLoans.map((loan) => (
                        <div
                          key={loan.id}
                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-bank-navy">
                                {loan.loan_type}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Loan ID: {loan.id}
                              </p>
                            </div>
                            <div className="loan-status-badge loan-status-accepted capitalize">
                              {loan.status}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Loan Amount
                              </p>
                              <p className="text-sm font-semibold">
                                ₹{Number(loan.loan_amount).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Loan Term</p>
                              <p className="text-sm font-semibold">
                                {loan.loan_term} months
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Loan Purpose
                              </p>
                              <p className="text-sm font-semibold">
                                {loan.loan_purpose}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Submitted At
                              </p>
                              <p className="text-sm font-semibold">
                                {loan.submitted_at
                                  ? new Date(loan.submitted_at).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-bank-blue border-bank-blue"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-bank-blue hover:bg-bank-navy text-white"
                              onClick={() =>
                                navigate(`/make-payment?loanId=${loan.id}`)
                              }
                            >
                              Make Payment
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No accepted loans found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Transactions</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-bank-blue"
                    >
                      <Link to="/transactions" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.amount < 0
                                ? "bg-red-100"
                                : "bg-green-100"
                            } mr-4`}
                          >
                            <ArrowRight
                              className={`h-4 w-4 ${
                                transaction.amount < 0
                                  ? "text-red-500"
                                  : "text-green-500 rotate-180"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-bank-navy">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            transaction.amount < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {transaction.amount < 0 ? "-" : "+"} ₹
                          {Math.abs(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications & Quick Actions */}
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={downloadPDF}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Download Statement
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileBarChart className="mr-2 h-4 w-4" /> View Loan Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Notifications</CardTitle>
                    <Button variant="ghost" size="sm" className="text-bank-blue">
                      Mark All Read
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            notification.is_read ? "bg-white" : "bg-blue-50"
                          } border border-gray-200`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium text-bank-navy">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <span className="inline-block w-2 h-2 bg-bank-blue rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(notification.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No notifications found.
                      </p>
                    )}
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
