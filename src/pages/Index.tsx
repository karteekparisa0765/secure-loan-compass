
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import LoanTypes from '@/components/LoanTypes';
import Features from '@/components/Features';
import LoanCalculator from '@/components/LoanCalculator';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <LoanTypes />
      <Features />
      <LoanCalculator />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
