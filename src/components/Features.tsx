
import React from 'react';
import { Shield, Clock, Check, FileText, Upload, CreditCard, Sliders, Download, Smartphone } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: <Clock className="h-6 w-6" />,
    title: "Quick Application",
    description: "Complete your loan application in minutes with our streamlined online process."
  },
  {
    id: 2,
    icon: <Check className="h-6 w-6" />,
    title: "Fast Approvals",
    description: "Get quick decisions on your loan applications with our efficient approval system."
  },
  {
    id: 3,
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Process",
    description: "Your data is protected with bank-grade security and encryption protocols."
  },
  {
    id: 4,
    icon: <FileText className="h-6 w-6" />,
    title: "Digital Documentation",
    description: "Upload and manage all your loan documents digitally, eliminating paperwork."
  },
  {
    id: 5,
    icon: <Upload className="h-6 w-6" />,
    title: "Easy Document Upload",
    description: "Simply scan and upload your KYC documents for verification."
  },
  {
    id: 6,
    icon: <CreditCard className="h-6 w-6" />,
    title: "Multiple Payment Options",
    description: "Choose from various payment methods for your loan repayments."
  },
  {
    id: 7,
    icon: <Sliders className="h-6 w-6" />,
    title: "EMI Flexibility",
    description: "Customize your EMI with flexible tenure and repayment options."
  },
  {
    id: 8,
    icon: <Download className="h-6 w-6" />,
    title: "Download Statements",
    description: "Access and download your loan statements anytime from your dashboard."
  },
  {
    id: 9,
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile-Friendly",
    description: "Manage your loans on the go with our responsive mobile interface."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-bank-navy">Features Designed For Convenience</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our loan management system offers powerful features that make the borrowing process simple, secure, and efficient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-bank-blue mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-bank-navy mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
