
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Car, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const loanTypes = [
  {
    id: 1,
    title: "Personal Loans",
    description: "Access funds for personal expenses, debt consolidation, or unexpected costs with competitive rates.",
    icon: <User className="h-10 w-10 text-bank-blue" />,
    rate: "8.99%",
    duration: "1-5 years",
    link: "/loans/personal"
  },
  {
    id: 2,
    title: "Business Loans",
    description: "Grow your business, manage cash flow, or invest in new equipment with our flexible business financing.",
    icon: <Briefcase className="h-10 w-10 text-bank-blue" />,
    rate: "9.50%",
    duration: "1-10 years",
    link: "/loans/business"
  },
  {
    id: 3,
    title: "Home Loans",
    description: "Achieve your dream of homeownership with competitive mortgage rates and flexible repayment options.",
    icon: <Home className="h-10 w-10 text-bank-blue" />,
    rate: "5.25%",
    duration: "15-30 years",
    link: "/loans/home"
  },
  {
    id: 4,
    title: "Auto Loans",
    description: "Finance your new or used vehicle purchase with low-interest rates and convenient repayment plans.",
    icon: <Car className="h-10 w-10 text-bank-blue" />,
    rate: "6.75%",
    duration: "1-7 years",
    link: "/loans/auto"
  }
];

const LoanTypes = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-bank-navy">Explore Our Loan Options</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Find the perfect financing solution tailored to your needs with our diverse range of loan products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loanTypes.map((loan) => (
            <Card key={loan.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    {loan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-bank-navy mb-2">{loan.title}</h3>
                  <p className="text-gray-600 mb-4">{loan.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 border-t border-b border-gray-200 py-2">
                    <div className="text-center flex-1 border-r border-gray-200">
                      <p className="text-sm text-gray-500">Starting Rate</p>
                      <p className="font-semibold text-lg text-bank-navy">{loan.rate}</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-lg text-bank-navy">{loan.duration}</p>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white">
                    <Link to={loan.link} className="inline-flex items-center justify-center">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoanTypes;
