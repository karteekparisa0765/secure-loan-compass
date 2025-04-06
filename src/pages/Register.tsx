
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const validatePassword = (password: string) => {
    // Password should be at least 8 characters and contain at least one number and one uppercase letter
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePassword(password)) {
      toast({
        title: "Weak Password",
        description: "Password should be at least 8 characters and contain at least one number and one uppercase letter",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    // Simulating registration processing
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
      // In a real app, redirect after registration
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-bank-blue" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-bank-navy">Create an Account</h2>
            <p className="mt-2 text-gray-600">
              Join SecureLoan to access our banking services
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-10"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs mt-1">
                    <p className="flex items-center">
                      {password.length >= 8 ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                      )}
                      <span className={password.length >= 8 ? "text-green-500" : "text-gray-500"}>
                        At least 8 characters
                      </span>
                    </p>
                    <p className="flex items-center">
                      {/[A-Z]/.test(password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                      )}
                      <span className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}>
                        At least one uppercase letter
                      </span>
                    </p>
                    <p className="flex items-center">
                      {/\d/.test(password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                      )}
                      <span className={/\d/.test(password) ? "text-green-500" : "text-gray-500"}>
                        At least one number
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-10"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Checkbox 
                      id="terms" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      I agree to the{" "}
                      <Link to="/terms" className="text-bank-blue hover:text-bank-navy">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-bank-blue hover:text-bank-navy">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-bank-blue hover:bg-bank-navy"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="flex items-center justify-center">
                  <span className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-bank-blue hover:text-bank-navy font-medium">
                      Sign in
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="flex items-center text-xs text-gray-500 justify-center space-x-2">
            <Shield className="h-3 w-3" />
            <span>Your personal information is protected with bank-grade security</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
