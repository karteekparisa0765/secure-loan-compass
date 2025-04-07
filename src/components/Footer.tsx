
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bank-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">SecureLoan</span>
            </div>
            <p className="text-gray-300 mb-4">
              Secure and reliable loan management solutions for individuals and businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/calculator" className="text-gray-300 hover:text-white">Loan Calculator</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/loans/personal" className="text-gray-300 hover:text-white">Personal Loans</Link>
              </li>
              <li>
                <Link to="/loans/business" className="text-gray-300 hover:text-white">Business Loans</Link>
              </li>
              <li>
                <Link to="/loans/auto" className="text-gray-300 hover:text-white">Auto Loans</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span className="text-gray-300">contact@secureloan.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span className="text-gray-300">123 Financial District, Suite 100, New York, NY 10004</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} SecureLoan. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link>
              <Link to="/security" className="text-gray-300 hover:text-white">Security Information</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
