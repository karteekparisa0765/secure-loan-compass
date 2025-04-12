import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: "This email address is not registered. Please check the email or register a new account.",
          variant: "destructive",
        });
      } else {
        setSubmitted(true);
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email. Please check your inbox and spam folder.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <h2 className="mt-6 text-3xl font-bold text-bank-navy">Reset Password</h2>
            <p className="mt-2 text-gray-600">
              {!submitted 
                ? "Enter your email to receive password reset instructions"
                : "Check your email for password reset instructions"}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {!submitted ? (
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

                  <Button
                    type="submit"
                    className="w-full bg-bank-blue hover:bg-bank-navy"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    We've sent password reset instructions to your email.
                    Please check your inbox and spam folder, then click the reset link in the email.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                  >
                    Try Different Email
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-bank-blue hover:bg-bank-navy"
                    onClick={() => navigate('/login')}
                  >
                    Return to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Link 
              to="/login"
              className="flex items-center text-sm text-bank-blue hover:text-bank-navy"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;