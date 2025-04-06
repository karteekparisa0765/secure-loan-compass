
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, FileText, Upload, Lock, FileCheck, ArrowRight } from 'lucide-react';

const LoanApplication = () => {
  const { type } = useParams<{ type: string }>();
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [agreeTnC, setAgreeTnC] = useState(false);
  const { toast } = useToast();
  
  // Form fields for personal information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Form fields for employment information
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [yearsEmployed, setYearsEmployed] = useState('');
  
  // Format loan type name
  const formatLoanType = (type: string | undefined) => {
    if (!type) return 'Loan';
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Loan';
  };
  
  // Get appropriate min/max loan amounts based on loan type
  const getLoanRanges = () => {
    switch (type) {
      case 'personal':
        return { min: 1000, max: 50000, defaultAmount: 15000, rate: 8.99 };
      case 'business':
        return { min: 10000, max: 500000, defaultAmount: 100000, rate: 9.50 };
      case 'home':
        return { min: 50000, max: 1000000, defaultAmount: 250000, rate: 5.25 };
      case 'auto':
        return { min: 5000, max: 100000, defaultAmount: 25000, rate: 6.75 };
      default:
        return { min: 1000, max: 100000, defaultAmount: 25000, rate: 8.00 };
    }
  };
  
  // Initialize loan values based on type
  useEffect(() => {
    const ranges = getLoanRanges();
    setLoanAmount(ranges.defaultAmount);
    setInterestRate(ranges.rate);
  }, [type]);
  
  // Calculate monthly payment whenever relevant values change
  useEffect(() => {
    // Calculate monthly payment using loan amortization formula
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    let monthlyPayment = 0;
    if (interestRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment = 
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    
    const totalPayment = monthlyPayment * numberOfPayments;
    
    setMonthlyPayment(parseFloat(monthlyPayment.toFixed(2)));
    setTotalPayment(parseFloat(totalPayment.toFixed(2)));
  }, [loanAmount, loanTerm, interestRate]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate loan details
      if (loanAmount <= 0 || loanTerm <= 0) {
        toast({
          title: "Error",
          description: "Please enter valid loan amount and term",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      // Validate personal information
      if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
        toast({
          title: "Error",
          description: "Please fill in all required personal information",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 3) {
      // Validate employment information
      if (!employmentStatus || !employerName || !monthlyIncome || !yearsEmployed) {
        toast({
          title: "Error",
          description: "Please fill in all required employment information",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 4) {
      // Validate documents (in a real app, we'd check if documents were uploaded)
      // For now, we'll just proceed
    }
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  // Submit application
  const handleSubmitApplication = () => {
    if (!agreeTnC) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit the application to the server
    toast({
      title: "Success",
      description: `Your ${formatLoanType(type)} application has been submitted successfully!`,
    });
    
    // Redirect to dashboard or confirmation page after submission
    // For now, we'll just show the confirmation step
    setCurrentStep(6);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="bg-bank-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{formatLoanType(type)} Application</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Complete the application form below to apply for your {formatLoanType(type.toLowerCase())}. It takes just a few minutes.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Application Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Application Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.min((currentStep / 5) * 100, 100).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min((currentStep / 5) * 100, 100)} className="h-2" />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mb-8">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-bank-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-bank-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <span className="text-xs mt-1">Loan Details</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-bank-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-bank-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <span className="text-xs mt-1">Personal Info</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-bank-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-bank-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <span className="text-xs mt-1">Employment</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-bank-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-bank-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                4
              </div>
              <span className="text-xs mt-1">Documents</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 5 ? 'text-bank-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 5 ? 'bg-bank-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                5
              </div>
              <span className="text-xs mt-1">Review</span>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {/* Step 1: Loan Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-bank-navy mb-4">Loan Details</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                        <span className="text-bank-blue font-semibold">{formatCurrency(loanAmount)}</span>
                      </div>
                      <Slider 
                        value={[loanAmount]} 
                        min={getLoanRanges().min} 
                        max={getLoanRanges().max} 
                        step={1000} 
                        onValueChange={(values) => setLoanAmount(values[0])} 
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatCurrency(getLoanRanges().min)}</span>
                        <span>{formatCurrency(getLoanRanges().max)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Loan Term (months)</label>
                        <span className="text-bank-blue font-semibold">{loanTerm} months</span>
                      </div>
                      <Slider 
                        value={[loanTerm]} 
                        min={12} 
                        max={type === 'home' ? 360 : 120} 
                        step={12} 
                        onValueChange={(values) => setLoanTerm(values[0])} 
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>12 months</span>
                        <span>{type === 'home' ? '360 months' : '120 months'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Loan Purpose</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {type === 'personal' && (
                            <>
                              <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                              <SelectItem value="home_improvement">Home Improvement</SelectItem>
                              <SelectItem value="major_purchase">Major Purchase</SelectItem>
                              <SelectItem value="medical_expenses">Medical Expenses</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </>
                          )}
                          {type === 'business' && (
                            <>
                              <SelectItem value="expansion">Business Expansion</SelectItem>
                              <SelectItem value="equipment">Equipment Purchase</SelectItem>
                              <SelectItem value="inventory">Inventory Financing</SelectItem>
                              <SelectItem value="working_capital">Working Capital</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </>
                          )}
                          {type === 'home' && (
                            <>
                              <SelectItem value="purchase">Home Purchase</SelectItem>
                              <SelectItem value="refinance">Refinance</SelectItem>
                              <SelectItem value="renovation">Renovation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </>
                          )}
                          {type === 'auto' && (
                            <>
                              <SelectItem value="new_vehicle">New Vehicle Purchase</SelectItem>
                              <SelectItem value="used_vehicle">Used Vehicle Purchase</SelectItem>
                              <SelectItem value="refinance">Refinance Existing Auto Loan</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">Estimated Monthly Payment</h3>
                      <p className="text-2xl font-bold text-bank-blue mb-1">{formatCurrency(monthlyPayment)}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Repayment</p>
                          <p className="text-sm font-semibold">{formatCurrency(totalPayment)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Interest Rate</p>
                          <p className="text-sm font-semibold">{interestRate.toFixed(2)}%</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        *These are estimated figures and may change after final approval based on your credit profile.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-bank-blue hover:bg-bank-navy" onClick={handleNextStep}>
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-bank-navy mb-4">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <Input 
                          id="firstName" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          placeholder="Enter your first name" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <Input 
                          id="lastName" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          placeholder="Enter your last name" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Enter your email address" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder="Enter your phone number" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address <span className="text-red-500">*</span></label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Enter your street address" 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                        <Input 
                          id="city" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          placeholder="Enter your city" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></label>
                        <Input 
                          id="state" 
                          value={state} 
                          onChange={(e) => setState(e.target.value)} 
                          placeholder="Enter your state" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP Code <span className="text-red-500">*</span></label>
                        <Input 
                          id="zipCode" 
                          value={zipCode} 
                          onChange={(e) => setZipCode(e.target.value)} 
                          placeholder="Enter your ZIP code" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 justify-center space-x-2 pt-4">
                    <Lock className="h-3 w-3" />
                    <span>Your personal information is secure and encrypted</span>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button className="bg-bank-blue hover:bg-bank-navy" onClick={handleNextStep}>
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Employment Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-bank-navy mb-4">Employment Information</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Employment Status <span className="text-red-500">*</span></label>
                      <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full-Time Employed</SelectItem>
                          <SelectItem value="part_time">Part-Time Employed</SelectItem>
                          <SelectItem value="self_employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="employerName" className="text-sm font-medium text-gray-700">Employer Name <span className="text-red-500">*</span></label>
                      <Input 
                        id="employerName" 
                        value={employerName} 
                        onChange={(e) => setEmployerName(e.target.value)} 
                        placeholder="Enter your employer's name" 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="monthlyIncome" className="text-sm font-medium text-gray-700">Monthly Income <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <Input 
                            id="monthlyIncome" 
                            value={monthlyIncome} 
                            onChange={(e) => setMonthlyIncome(e.target.value)} 
                            className="pl-8" 
                            placeholder="5,000" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="yearsEmployed" className="text-sm font-medium text-gray-700">Years at Current Employer <span className="text-red-500">*</span></label>
                        <Input 
                          id="yearsEmployed" 
                          value={yearsEmployed} 
                          onChange={(e) => setYearsEmployed(e.target.value)} 
                          placeholder="Enter years at current employer" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button className="bg-bank-blue hover:bg-bank-navy" onClick={handleNextStep}>
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Document Upload */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-bank-navy mb-4">Document Upload</h2>
                  <p className="text-gray-600 mb-6">
                    Please upload the following documents to verify your identity and income. Acceptable formats are PDF, JPG, or PNG.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-bank-blue" />
                      </div>
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">ID Proof</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload a government-issued photo ID (passport, driver's license, or national ID)
                      </p>
                      <Button variant="outline" className="text-bank-blue border-bank-blue">
                        Select File
                      </Button>
                    </div>
                    
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-bank-blue" />
                      </div>
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">Income Proof</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload recent pay stubs, tax returns, or bank statements
                      </p>
                      <Button variant="outline" className="text-bank-blue border-bank-blue">
                        Select File
                      </Button>
                    </div>
                    
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-bank-blue" />
                      </div>
                      <h3 className="text-lg font-semibold text-bank-navy mb-2">Address Proof</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload a utility bill, lease agreement, or property tax statement
                      </p>
                      <Button variant="outline" className="text-bank-blue border-bank-blue">
                        Select File
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 justify-center space-x-2 pt-4">
                    <Lock className="h-3 w-3" />
                    <span>Your documents are secure and encrypted</span>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button className="bg-bank-blue hover:bg-bank-navy" onClick={handleNextStep}>
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 5: Review and Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-bank-navy mb-4">Review Your Application</h2>
                  <p className="text-gray-600 mb-6">
                    Please review your loan application details below before submitting. You can go back to any section to make changes.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-bank-navy mb-3">Loan Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Loan Type</p>
                          <p className="font-medium">{formatLoanType(type)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loan Amount</p>
                          <p className="font-medium">{formatCurrency(loanAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loan Term</p>
                          <p className="font-medium">{loanTerm} months</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="font-medium">{interestRate.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Monthly Payment</p>
                          <p className="font-medium">{formatCurrency(monthlyPayment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Payment</p>
                          <p className="font-medium">{formatCurrency(totalPayment)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-bank-navy mb-3">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{firstName} {lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">{phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{address}, {city}, {state} {zipCode}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-bank-navy mb-3">Employment Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Employment Status</p>
                          <p className="font-medium">
                            {employmentStatus === 'full_time' ? 'Full-Time Employed' : 
                             employmentStatus === 'part_time' ? 'Part-Time Employed' : 
                             employmentStatus === 'self_employed' ? 'Self-Employed' : 
                             employmentStatus === 'unemployed' ? 'Unemployed' : 
                             employmentStatus === 'retired' ? 'Retired' : 
                             employmentStatus === 'student' ? 'Student' : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Employer</p>
                          <p className="font-medium">{employerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Monthly Income</p>
                          <p className="font-medium">${monthlyIncome}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Years at Current Employer</p>
                          <p className="font-medium">{yearsEmployed} years</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-bank-navy mb-3">Documents</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                          <span>ID Proof</span>
                        </div>
                        <div className="flex items-center">
                          <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                          <span>Income Proof</span>
                        </div>
                        <div className="flex items-center">
                          <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                          <span>Address Proof</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreeTnC}
                        onCheckedChange={(checked) => setAgreeTnC(checked === true)}
                      />
                      <div className="text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the {' '}
                          <a href="#" className="text-bank-blue hover:text-bank-navy underline">Terms and Conditions</a>
                          {' '} and {' '}
                          <a href="#" className="text-bank-blue hover:text-bank-navy underline">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button className="bg-bank-blue hover:bg-bank-navy" onClick={handleSubmitApplication}>
                      Submit Application <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-green-100 mb-6">
                    <FileCheck className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-bank-navy mb-4">Application Submitted!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your {formatLoanType(type)} application has been successfully submitted. 
                    We will review your application and get back to you within 1-2 business days.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg inline-block">
                    <p className="font-medium text-bank-navy">Application Reference Number</p>
                    <p className="text-2xl font-bold text-bank-blue mt-1">
                      {`${type?.toUpperCase().substring(0, 2) || 'LN'}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`}
                    </p>
                  </div>
                  <p className="mt-8 text-sm text-gray-600">
                    You will receive a confirmation email shortly at {email}
                  </p>
                  <div className="mt-8">
                    <Button asChild className="bg-bank-blue hover:bg-bank-navy">
                      <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                  </div>
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
