
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Pie } from 'recharts';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

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
    const totalInterest = totalPayment - principal;
    
    setMonthlyPayment(parseFloat(monthlyPayment.toFixed(2)));
    setTotalPayment(parseFloat(totalPayment.toFixed(2)));
    setTotalInterest(parseFloat(totalInterest.toFixed(2)));
  }, [loanAmount, interestRate, loanTerm]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Pie chart data
  const pieData = [
    { name: 'Principal', value: loanAmount, fill: '#4299E1' },
    { name: 'Interest', value: totalInterest, fill: '#2C5282' }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="p-2 bg-blue-100 rounded-full">
              <Calculator className="h-8 w-8 text-bank-blue" />
            </span>
          </div>
          <h2 className="text-3xl font-bold text-bank-navy">Loan EMI Calculator</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your loan with our easy-to-use calculator. Adjust parameters to see your monthly payments and total costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-bank-navy mb-6">Adjust Loan Parameters</h3>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                      <span className="text-bank-blue font-semibold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <Slider 
                      value={[loanAmount]} 
                      min={1000} 
                      max={100000} 
                      step={1000} 
                      onValueChange={(values) => setLoanAmount(values[0])} 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$1,000</span>
                      <span>$100,000</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                      <span className="text-bank-blue font-semibold">{interestRate}%</span>
                    </div>
                    <Slider 
                      value={[interestRate]} 
                      min={1} 
                      max={20} 
                      step={0.1} 
                      onValueChange={(values) => setInterestRate(values[0])} 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>20%</span>
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
                      max={120} 
                      step={12} 
                      onValueChange={(values) => setLoanTerm(values[0])} 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>12 months</span>
                      <span>120 months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-bank-navy mb-6">Loan Summary</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="text-2xl font-bold text-bank-navy">{formatCurrency(monthlyPayment)}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Payment</p>
                    <p className="text-2xl font-bold text-bank-navy">{formatCurrency(totalPayment)}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-2xl font-bold text-bank-navy">{formatCurrency(totalInterest)}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Principal Amount</p>
                    <p className="text-2xl font-bold text-bank-navy">{formatCurrency(loanAmount)}</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <div className="w-48 h-48">
                    <div className="text-center">
                      <div className="font-medium text-sm mb-2">Payment Breakdown</div>
                      <div className="flex justify-center items-center gap-6">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-bank-blue mr-2"></div>
                          <span className="text-xs">Principal</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-bank-navy mr-2"></div>
                          <span className="text-xs">Interest</span>
                        </div>
                      </div>
                      <div className="mt-4 text-lg font-bold">
                        {(totalInterest / totalPayment * 100).toFixed(1)}% interest
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            This calculator is for illustrative purposes only. The actual EMI and total payment may vary based on the lender's policies, processing fees, and other factors. Please consult with our loan advisors for exact details.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;
