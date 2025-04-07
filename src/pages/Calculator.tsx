import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoanCalculator from '@/components/LoanCalculator';
import { ArrowRight, Calculator as CalcIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Calculator = () => {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="bg-bank-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-4">
            <CalcIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Loan EMI Calculator</h1>
          <p className="text-blue-100 max-w-3xl mx-auto text-lg">
            Plan your finances better with our accurate and easy-to-use loan EMI calculator. Adjust parameters to find the perfect loan for your needs.
          </p>
        </div>
      </div>

      <div className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoanCalculator />

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-bank-navy mb-6 text-center">Understanding Your EMI Calculation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-bank-navy mb-4">How EMI is Calculated</h3>
                <p className="text-gray-600 mb-4">
                  EMI (Equated Monthly Installment) is the fixed amount you pay to the bank each month until your loan is fully paid off. The EMI consists of both principal and interest components.
                </p>
                <p className="text-gray-600 mb-4">
                  The formula used to calculate EMI is:
                </p>
                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <p className="font-mono">EMI = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1]</p>
                </div>
                <p className="text-gray-600">
                  Where:<br />
                  P = Principal loan amount<br />
                  r = Monthly interest rate (Annual rate ÷ 12 ÷ 100)<br />
                  n = Loan tenure in months
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-bank-navy mb-4">Tips for Loan Planning</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bank-blue text-white text-xs mr-2 mt-0.5">1</span>
                    <span>Consider a higher down payment to reduce your principal loan amount and EMI.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bank-blue text-white text-xs mr-2 mt-0.5">2</span>
                    <span>Choose a longer tenure to reduce your EMI, but be aware that total interest paid will increase.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bank-blue text-white text-xs mr-2 mt-0.5">3</span>
                    <span>Aim to keep your EMI under 40-50% of your monthly income for financial stability.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bank-blue text-white text-xs mr-2 mt-0.5">4</span>
                    <span>Make prepayments when possible to reduce your outstanding principal and interest.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bank-blue text-white text-xs mr-2 mt-0.5">5</span>
                    <span>Compare different loan offers to find the best interest rate and terms.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-bank-navy mb-6 text-center">Ready to Apply?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Personal Loan', desc: 'Quick funds for your personal needs with minimal documentation.', path: '/loans/personal' },
                { title: 'Home Loan', desc: 'Affordable financing solutions for your dream home.', path: '/loans/home' },
                { title: 'Business Loan', desc: 'Grow your business with our flexible financing options.', path: '/loans/business' },
              ].map((loan, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-bank-blue" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-bank-navy mb-2 text-center">{loan.title}</h3>
                    <p className="text-gray-600 text-center mb-4">{loan.desc}</p>
                    <Button asChild className="w-full bg-bank-blue hover:bg-bank-navy">
                      <Link to={loan.path} className="flex items-center justify-center">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Calculator;
