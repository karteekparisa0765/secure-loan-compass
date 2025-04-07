// pages/LoanApplication.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, FileCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LoanApplication = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>(); // optional: for dynamic loan type
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Loan Details
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [loanTerm, setLoanTerm] = useState<number>(36);
  const [loanPurpose, setLoanPurpose] = useState<string>("");

  // Step 2: Personal Information
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // Step 3: Employment Information
  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [employerName, setEmployerName] = useState<string>("");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [yearsEmployed, setYearsEmployed] = useState<string>("");

  // Step 4: Review & Submit
  // Step 5: Submission confirmation flag
  const [submitted, setSubmitted] = useState<boolean>(false);

  // With 4 steps (excluding confirmation), progress increases by 25% per step
  const progressValue = currentStep <= 4 ? currentStep * 25 : 100;

  // Helper to move to next step
  const handleNextStep = () => {
    // Basic validation for each step
    if (currentStep === 1) {
      if (!loanAmount || !loanTerm || !loanPurpose) {
        alert("Please fill in all loan details.");
        return;
      }
    } else if (currentStep === 2) {
      if (!firstName || !lastName || !email || !phone || !address) {
        alert("Please fill in all personal information.");
        return;
      }
    } else if (currentStep === 3) {
      if (
        !employmentStatus ||
        !employerName ||
        !monthlyIncome ||
        !yearsEmployed
      ) {
        alert("Please fill in all employment information.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  // Helper to move back a step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Final submission handler with Supabase insertion and redirection
  const handleSubmitApplication = async () => {
    // ✅ Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in to submit an application.");
      return;
    }

    const applicationData = {
      user_id: user.id,
      loan_amount: loanAmount,
      loan_term: loanTerm,
      loan_purpose: loanPurpose,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      employment_status: employmentStatus,
      employer_name: employerName,
      monthly_income: monthlyIncome,
      years_employed: yearsEmployed,
      loan_type: type || "default",
      submitted_at: new Date().toISOString(),
      status: "waiting", // ✅ Add this line
    };

    const { error } = await supabase
      .from("loan_applications")
      .insert([applicationData]);

    if (error) {
      alert("Error submitting application: " + error.message);
    } else {
      setSubmitted(true);
      setCurrentStep(5);
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Application Progress
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progressValue}%
              </span>
            </div>
            <Progress value={progressValue} />
          </div>

          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-bank-navy">
                      Loan Details
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loan Amount (₹)
                      </label>
                      <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        placeholder="Enter loan amount"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loan Term (months)
                      </label>
                      <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        placeholder="Enter loan term"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loan Purpose
                      </label>
                      <Select
                        value={loanPurpose}
                        onValueChange={(value) => setLoanPurpose(value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debt_consolidation">
                            Debt Consolidation
                          </SelectItem>
                          <SelectItem value="home_improvement">
                            Home Improvement
                          </SelectItem>
                          <SelectItem value="major_purchase">
                            Major Purchase
                          </SelectItem>
                          <SelectItem value="medical_expenses">
                            Medical Expenses
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep} disabled>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      className="bg-bank-blue hover:bg-bank-navy text-white"
                      onClick={handleNextStep}
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-bank-navy">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      className="bg-bank-blue hover:bg-bank-navy text-white"
                      onClick={handleNextStep}
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-bank-navy">
                      Employment Information
                    </CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Employment Status
                      </label>
                      <Select
                        value={employmentStatus}
                        onValueChange={(value) => setEmploymentStatus(value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full-Time</SelectItem>
                          <SelectItem value="part_time">Part-Time</SelectItem>
                          <SelectItem value="self_employed">
                            Self-Employed
                          </SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Employer Name
                      </label>
                      <Input
                        type="text"
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        placeholder="Enter employer name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Monthly Income (₹)
                      </label>
                      <Input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        placeholder="Enter monthly income"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Years Employed
                      </label>
                      <Input
                        type="number"
                        value={yearsEmployed}
                        onChange={(e) => setYearsEmployed(e.target.value)}
                        placeholder="Enter years employed"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      className="bg-bank-blue hover:bg-bank-navy text-white"
                      onClick={handleNextStep}
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-bank-navy">
                      Review & Submit
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">
                        Loan Details
                      </h3>
                      <p>
                        <strong>Amount:</strong> ₹{loanAmount.toLocaleString()}{" "}
                        <br />
                        <strong>Term:</strong> {loanTerm} months <br />
                        <strong>Purpose:</strong> {loanPurpose}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">
                        Personal Information
                      </h3>
                      <p>
                        <strong>Name:</strong> {firstName} {lastName} <br />
                        <strong>Email:</strong> {email} <br />
                        <strong>Phone:</strong> {phone} <br />
                        <strong>Address:</strong> {address}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">
                        Employment Information
                      </h3>
                      <p>
                        <strong>Status:</strong> {employmentStatus} <br />
                        <strong>Employer:</strong> {employerName} <br />
                        <strong>Monthly Income:</strong> ₹{monthlyIncome} <br />
                        <strong>Years Employed:</strong> {yearsEmployed}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      className="bg-bank-blue hover:bg-bank-navy text-white"
                      onClick={handleSubmitApplication}
                    >
                      Submit Application{" "}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 5 && submitted && (
                <div className="text-center py-8">
                  <FileCheck className="mx-auto h-12 w-12 text-green-500" />
                  <h2 className="text-3xl font-bold text-bank-navy mt-4">
                    Application Submitted!
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Your loan application has been submitted. We will review
                    your details and contact you soon.
                  </p>
                  <Button
                    className="mt-6 bg-bank-blue hover:bg-bank-navy text-white"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoanApplication;
