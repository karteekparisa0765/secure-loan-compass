import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  FileText,
  Calendar,
  FileBarChart,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

// -------------------------------------------------------------------------
// 1) Supabase Client Setup with Persisted Sessions
// -------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// -------------------------------------------------------------------------
// 2) Interfaces & Helper Functions
// -------------------------------------------------------------------------
interface Profile {
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  bank_balance?: number;
}

interface Loan {
  id: string;
  user_id: string;
  loan_amount: number;
  loan_term: number;
  loan_purpose: string;
  monthly_income: number;
  employment_status: string;
  status: string;
  submitted_at: string;
  rejection_reason?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  employer_name: string;
  years_employed: number;
  loan_type: string;
  paid_amount: number;
  next_payment_due: string;
  is_late: boolean;
  profiles?: Profile;
}

const getCibilScoreSuggestion = (score: number) => {
  if (score >= 750) {
    return {
      message: "Excellent credit score. Loan approval highly recommended.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  } else if (score >= 700) {
    return {
      message: "Good credit score. Loan can be considered with standard terms.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    };
  } else if (score >= 650) {
    return {
      message:
        "Fair credit score. Consider loan with additional verification and possibly higher interest rate.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  } else {
    return {
      message:
        "Poor credit score. High risk application. Loan approval not recommended.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  }
};

// -------------------------------------------------------------------------
// 3) BankStaffDashboard Component
// -------------------------------------------------------------------------
const BankStaffDashboard = () => {
  // State variables
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [cibilScore, setCibilScore] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionDialog, setShowRejectionDialog] = useState<boolean>(false);
  const [loanToReject, setLoanToReject] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [staffName, setStaffName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // -----------------------------------------------------------------------
  // 3.1) Update Loan Status (Approve/Reject)
  // -----------------------------------------------------------------------
  const updateLoanStatus = async (loanId: string, status: string, reason: string | null) => {
    try {
      setIsProcessing(true);
      setActionError(null);

      // Retrieve loan details to include in notification
      const { data: loanData, error: loanError } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("id", loanId)
        .single();

      if (loanError) {
        throw new Error(`Error fetching loan ${loanId}: ${loanError.message}`);
      }

      // Update loan status (and add rejection reason if applicable)
      const { error: updateError } = await supabase
        .from("loan_applications")
        .update({
          status,
          rejection_reason: status === "rejected" ? reason : null,
        })
        .eq("id", loanId);

      if (updateError) {
        throw new Error(`Error updating loan status: ${updateError.message}`);
      }

      // Create a notification if the loan is rejected
      if (status === "rejected") {
        const { error: notifError } = await supabase
          .from("notifications")
          .insert([
            {
              user_id: loanData.user_id,
              title: "Loan Application Update",
              message: `Your loan application for ₹${Number(
                loanData.loan_amount
              ).toLocaleString()} has been rejected. Reason: ${reason}`,
              type: "loan_rejection",
              loan_id: loanId,
              read: false,
            },
          ]);

        if (notifError) {
          console.error("Error creating notification:", notifError);
        }
      }

      // Refresh the list of loans
      await fetchLoans();
      alert(`Loan ${status === "accepted" ? "approved" : "rejected"} successfully`);

      // Reset rejection dialog state if applicable
      if (status === "rejected") {
        setRejectionReason("");
        setShowRejectionDialog(false);
        setLoanToReject(null);
      }
    } catch (error: any) {
      console.error("Error updating loan status:", error);
      setActionError(error.message);
      alert("Failed to update loan status: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -----------------------------------------------------------------------
  // 3.2) Fetch Loans With Joined Profiles
  // -----------------------------------------------------------------------
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        navigate("/login");
        return;
      }

      // Get loan applications with their built-in profile fields
      const { data, error } = await supabase
        .from("loan_applications")
        .select(`
          id,
          user_id,
          loan_amount,
          loan_term,
          loan_purpose,
          first_name,
          last_name,
          email,
          phone,
          address,
          employment_status,
          employer_name,
          monthly_income,
          years_employed,
          loan_type,
          submitted_at,
          status,
          paid_amount,
          next_payment_due,
          is_late,
          rejection_reason
        `)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error fetching loan applications:", error);
        return;
      }

      if (!data) {
        console.log("No loan applications found");
        setLoans([]);
        return;
      }

      // Transform the data to match the expected structure
      const transformedLoans = data.map((loan: any) => ({
        ...loan,
        profiles: {
          first_name: loan.first_name || "Unknown",
          last_name: loan.last_name || "User",
          email: loan.email || "",
          phone: loan.phone || "",
          address: loan.address || "",
          bank_balance: 0, // This field might need to be fetched separately if needed
        },
      }));

      console.log("Fetched loans:", transformedLoans);
      setLoans(transformedLoans);
    } catch (err) {
      console.error("Error in fetchLoans:", err);
      setActionError("Failed to load loan applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // 3.3) Verify Session and Bank Staff Role
  // -----------------------------------------------------------------------
  const getSessionAndProfile = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("No session or error:", sessionError);
        navigate("/login");
        return;
      }

      // Fetch the user’s profile to confirm role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, role")
        .eq("id", session.user.id)
        .single();

      if (profileError || !profile) {
        console.error("Profile error or not found:", profileError);
        navigate("/login");
        return;
      }

      if (profile.role !== "bank_staff") {
        console.error("User is not bank_staff, redirecting...");
        navigate("/login");
        return;
      }

      setStaffName(`${profile.first_name || ""} ${profile.last_name || ""}`.trim());
    } catch (error) {
      console.error("Error in getSessionAndProfile:", error);
      navigate("/login");
    }
  };

  // -----------------------------------------------------------------------
  // 3.4) Fetch CIBIL Score for a Selected Loan
  // -----------------------------------------------------------------------
  const fetchCibilScore = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("cibil_scores")
        .select("score")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching CIBIL score:", error);
        return;
      }
      setCibilScore(data?.score || null);
    } catch (error) {
      console.error("Error in fetchCibilScore:", error);
    }
  };

  // -----------------------------------------------------------------------
  // 3.5) useEffect Hooks: Initialization and Selected Loan Effect
  // -----------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      await getSessionAndProfile();
      await fetchLoans();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (selectedLoan) {
      fetchCibilScore(selectedLoan.user_id);
    } else {
      setCibilScore(null);
    }
  }, [selectedLoan]);

  // Derived values for dashboard display
  const pendingLoans = loans.filter((loan) => loan.status === "waiting");
  const approvedLoans = loans.filter((loan) => loan.status === "accepted");
  const rejectedLoans = loans.filter((loan) => loan.status === "rejected");
  const totalLoans = loans.length;

  // -----------------------------------------------------------------------
  // 3.6) Render Dashboard
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Main Content */}
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header and Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-bank-navy">
                Welcome, {staffName || "Staff"}
              </h1>
              <p className="text-gray-600">Manage and review all loan applications</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to="/dashboard/staff/reports">
                <Button
                  variant="outline"
                  className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" /> View Reports
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white"
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error) console.error("Logout error:", error);
                  else navigate("/");
                }}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
                  <CreditCard className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">{totalLoans}</div>
                <p className="text-sm text-gray-600">All submitted applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Waiting Applications</h3>
                  <FileBarChart className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">{pendingLoans.length}</div>
                <p className="text-sm text-gray-600">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Accepted / Rejected</h3>
                  <Calendar className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  {approvedLoans.length} / {rejectedLoans.length}
                </div>
                <p className="text-sm text-gray-600">Processed applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Loan Applications List */}
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Loan Applications</CardTitle>
                  <Button variant="ghost" size="sm" className="text-bank-blue">
                    <Link to="/staff/loans" className="flex items-center">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading loan applications...</p>
                ) : loans.length ? (
                  <div className="space-y-6">
                    {loans.map((loan) => (
                      <div key={loan.id} className="bg-white p-4 rounded-lg shadow space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {loan.profiles?.first_name} {loan.profiles?.last_name}
                            </p>
                            <p className="text-sm text-gray-500">Application ID: {loan.id}</p>
                          </div>
                          <div className={`capitalize font-medium ${
                            loan.status === "accepted"
                              ? "text-green-600"
                              : loan.status === "rejected"
                              ? "text-red-600"
                              : "text-orange-500"
                          }`}>
                            {loan.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Loan Amount</p>
                            <p className="text-sm font-semibold">
                              ₹{Number(loan.loan_amount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Loan Term</p>
                            <p className="text-sm font-semibold">{loan.loan_term} months</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Loan Purpose</p>
                            <p className="text-sm font-semibold">{loan.loan_purpose}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Submitted At</p>
                            <p className="text-sm font-semibold">
                              {loan.submitted_at ? new Date(loan.submitted_at).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-bank-blue text-bank-blue"
                            onClick={() => setSelectedLoan(loan)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`border-green-600 ${
                              loan.status === "accepted"
                                ? "bg-green-100 text-green-600 cursor-not-allowed"
                                : "text-green-600"
                            }`}
                            onClick={() => {
                              if (loan.status === "waiting") updateLoanStatus(loan.id, "accepted", null);
                            }}
                            disabled={loan.status !== "waiting"}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`border-red-600 ${
                              loan.status === "rejected"
                                ? "bg-red-100 text-red-600 cursor-not-allowed"
                                : "text-red-600"
                            }`}
                            onClick={() => {
                              if (loan.status === "waiting") {
                                setLoanToReject(loan);
                                setShowRejectionDialog(true);
                              }
                            }}
                            disabled={loan.status !== "waiting"}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No loan applications found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Loan Details Dialog */}
      <Dialog
        open={!!selectedLoan}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLoan(null);
            setCibilScore(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-3xl mx-auto">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium">{selectedLoan.profiles?.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium">{selectedLoan.profiles?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedLoan.profiles?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{selectedLoan.profiles?.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CIBIL Score</p>
                      <p className={`font-medium text-lg ${
                        cibilScore && cibilScore >= 750
                          ? "text-green-600"
                          : cibilScore && cibilScore >= 700
                          ? "text-blue-600"
                          : cibilScore && cibilScore >= 650
                          ? "text-yellow-600"
                          : cibilScore
                          ? "text-red-600"
                          : ""
                      }`}>
                        {cibilScore !== null ? cibilScore : "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Loan Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Loan Amount</p>
                      <p className="font-medium">
                        ₹{Number(selectedLoan.loan_amount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Term</p>
                      <p className="font-medium">{selectedLoan.loan_term} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Purpose</p>
                      <p className="font-medium">{selectedLoan.loan_purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Income</p>
                      <p className="font-medium">
                        ₹{Number(selectedLoan.monthly_income).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Status</p>
                      <p className="font-medium">{selectedLoan.employment_status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted At</p>
                      <p className="font-medium">
                        {selectedLoan.submitted_at
                          ? new Date(selectedLoan.submitted_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Credit Assessment Alert */}
              {cibilScore && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Credit Assessment</h3>
                  <Alert
                    className={`${getCibilScoreSuggestion(cibilScore).bgColor} ${getCibilScoreSuggestion(cibilScore).borderColor} border`}
                  >
                    <AlertDescription className={`${getCibilScoreSuggestion(cibilScore).color} font-medium`}>
                      {getCibilScoreSuggestion(cibilScore).message}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog
        open={showRejectionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowRejectionDialog(false);
            setRejectionReason("");
            setLoanToReject(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Provide Rejection Reason</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="rejectionReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Please provide a reason for rejecting this loan application:
            </label>
            <textarea
              id="rejectionReason"
              className="w-full p-2 border rounded-md"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
            ></textarea>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionDialog(false);
                setRejectionReason("");
                setLoanToReject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (rejectionReason.trim() && loanToReject) {
                  updateLoanStatus(loanToReject.id, "rejected", rejectionReason.trim());
                } else {
                  alert("Please provide a reason for rejection");
                }
              }}
              disabled={!rejectionReason.trim() || isProcessing}
            >
              {isProcessing ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BankStaffDashboard;