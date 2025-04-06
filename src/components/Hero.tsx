
import React from 'react';
import { ArrowRight, Shield, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-bank-navy to-bank-blue">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Smart Banking Solutions for Your Financial Journey
            </h1>
            <p className="mt-6 text-lg md:text-xl text-blue-100">
              Our secure and user-friendly loan management system helps you apply, 
              track, and manage loans with ease and confidence.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="bg-white text-bank-blue hover:bg-blue-50 font-semibold py-3 px-6 rounded-md text-lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-md text-lg">
                <Link to="/calculator" className="flex items-center">
                  Calculate EMI <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span>Fast Application Process</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span>Quick Approvals</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span>Competitive Rates</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="absolute -top-3 -right-3 bg-bank-success text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Secure Transaction
              </div>
              <h3 className="text-xl font-semibold text-bank-navy mb-4">Quick Loan Eligibility</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Loan Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bank-blue">
                    <option>Personal Loan</option>
                    <option>Business Loan</option>
                    <option>Home Loan</option>
                    <option>Auto Loan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bank-blue" 
                      placeholder="25,000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bank-blue" 
                      placeholder="5,000"
                    />
                  </div>
                </div>
                <Button className="w-full bg-bank-blue hover:bg-bank-navy text-white font-semibold py-3 px-6 rounded-md">
                  Check Eligibility
                </Button>
                <div className="text-center text-xs text-gray-500 flex items-center justify-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Your information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
