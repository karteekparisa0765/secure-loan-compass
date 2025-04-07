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

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BankStaffDashboard = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<any[]>([]);
  const [staffName, setStaffName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("loan_applications")
      .select("*");
    if (error) {
      console.error("Error fetching loan applications:", error);
    } else {
      setLoans(data || []);
    }
    setLoading(false);
  };

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user?.user_metadata) {
      const { first_name, last_name } = data.session.user.user_metadata;
      if (first_name || last_name) {
        setStaffName(`${first_name || ""} ${last_name || ""}`.trim());
      }
    }
  };

  useEffect(() => {
    getSession();
    fetchLoans();
  }, []);

  const updateLoanStatus = async (loanId: string, status: string) => {
    const confirmMsg = `Are you sure you want to ${status} this loan application?`;
    if (!window.confirm(confirmMsg)) return;

    const { error } = await supabase
      .from("loan_applications")
      .update({ status })
      .eq("id", loanId);

    if (error) {
      console.error(`Error updating loan ${loanId}:`, error);
    } else {
      await fetchLoans();
    }
  };

  const pendingLoans = loans.filter((loan) => loan.status === "waiting");
  const approvedLoans = loans.filter((loan) => loan.status === "accepted");
  const rejectedLoans = loans.filter((loan) => loan.status === "rejected");
  const totalLoans = loans.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-bank-navy">
                Welcome, {staffName || "Staff"}
              </h1>
              <p className="text-gray-600">
                Manage and review all loan applications
              </p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Applications
                  </h3>
                  <CreditCard className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  {totalLoans}
                </div>
                <p className="text-sm text-gray-600">
                  All submitted applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Waiting Applications
                  </h3>
                  <FileBarChart className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  {pendingLoans.length}
                </div>
                <p className="text-sm text-gray-600">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Accepted / Rejected
                  </h3>
                  <Calendar className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">
                  {approvedLoans.length} / {rejectedLoans.length}
                </div>
                <p className="text-sm text-gray-600">Processed applications</p>
              </CardContent>
            </Card>
          </div>

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
                      <div
                        key={loan.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-bank-navy">
                              {loan.loan_type}{" "}
                              {loan.status === "waiting" && (
                                <span className="text-sm text-orange-500">
                                  (Waiting)
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Loan ID: {loan.id}
                            </p>
                          </div>
                          <div
                            className={`capitalize font-medium ${
                              loan.status === "accepted"
                                ? "text-green-600"
                                : loan.status === "rejected"
                                ? "text-red-600"
                                : "text-orange-500"
                            }`}
                          >
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
                                ? new Date(
                                    loan.submitted_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`border-green-600 ${
                              loan.status === "accepted"
                                ? "bg-green-100 text-green-600 cursor-not-allowed"
                                : "text-green-600"
                            }`}
                            onClick={() =>
                              updateLoanStatus(loan.id, "accepted")
                            }
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
                            onClick={() =>
                              updateLoanStatus(loan.id, "rejected")
                            }
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

      <Footer />
    </div>
  );
};

export default BankStaffDashboard;
