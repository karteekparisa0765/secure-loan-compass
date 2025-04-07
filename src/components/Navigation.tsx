import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, ChevronDown, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-bank-blue" />
              <span className="ml-2 text-xl font-bold text-bank-navy">
                SecureLoan
              </span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center px-1 pt-1 text-sm font-medium text-bank-navy">
                  Loans <ChevronDown size={16} className="ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link to="/loans/personal" className="w-full">
                      Personal Loans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/loans/business" className="w-full">
                      Business Loans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/loans/home" className="w-full">
                      Home Loans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/loans/auto" className="w-full">
                      Auto Loans
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                to="/calculator"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-bank-navy"
              >
                Loan Calculator
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-bank-navy"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-bank-navy"
              >
                Send Message
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell size={20} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-bank-blue flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-bank-navy">
                        John Doe
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/settings" className="w-full">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  className="text-bank-navy border-bank-navy hover:bg-bank-lightgray"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-bank-navy"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
            >
              Home
            </Link>
            <button className="flex w-full justify-between items-center pl-3 pr-4 py-2 text-base font-medium text-bank-navy">
              Loans <ChevronDown size={16} />
            </button>
            <Link
              to="/calculator"
              className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
            >
              Loan Calculator
            </Link>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
            >
              Send Message
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
                >
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-bank-navy"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-3">
                <Button
                  variant="outline"
                  className="w-full text-bank-navy border-bank-navy hover:bg-bank-lightgray"
                >
                  <Link to="/register" className="w-full">
                    Register
                  </Link>
                </Button>
                <Button
                  className="w-full bg-bank-blue hover:bg-bank-navy text-white"
                  onClick={handleLogin}
                >
                  <Link to="/login" className="w-full">
                    Login
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
