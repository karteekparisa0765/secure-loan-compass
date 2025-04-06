
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-bank-blue to-bank-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Loan Application?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl">
              Take the first step towards financial freedom. Our loan experts are ready to guide you through the process and help you find the perfect solution for your needs.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-bank-blue hover:bg-blue-50 font-semibold py-3 px-6 rounded-md">
              <Link to="/register" className="flex items-center">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-md">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
