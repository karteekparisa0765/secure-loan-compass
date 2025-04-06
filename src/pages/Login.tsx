
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, User, AlertCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Simulating login processing
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      // In a real app, redirect to dashboard after login
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
            <h2 className="mt-6 text-3xl font-bold text-bank-navy">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to access your loan account
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-bank-blue hover:text-bank-navy">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="pl-10"
                      placeholder="Enter your password"
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-bank-blue hover:bg-bank-navy"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                
                <div className="flex items-center justify-center">
                  <span className="text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-bank-blue hover:text-bank-navy font-medium">
                      Register now
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="flex items-center text-xs text-gray-500 justify-center space-x-2">
            <Lock className="h-3 w-3" />
            <span>Secured with bank-level encryption</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
