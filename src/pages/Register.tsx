import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [role, setRole] = useState('customer'); // NEW
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
    }

    if (!validatePassword(password)) {
      return toast({ title: "Weak Password", description: "Password must be at least 8 characters long and contain an uppercase letter and a number.", variant: "destructive" });
    }

    if (password !== confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    }

    if (!agreeTerms) {
      return toast({ title: "Terms Required", description: "You must agree to the terms and conditions.", variant: "destructive" });
    }

    try {
      setLoading(true);

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !user) {
        throw signUpError;
      }

      // Insert into profiles with role
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role, // NEW
      });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Your account has been created.",
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong",
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
            <h2 className="mt-6 text-3xl font-bold text-bank-navy">Create an Account</h2>
            <p className="mt-2 text-gray-600">Join SecureLoan to access our banking services</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label> {/* NEW */}
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-bank-blue focus:border-bank-blue sm:text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="bank_staff">Bank Staff</option>
                  </select>
                </div>

                {/* Password + Confirm + Strength checks here (unchanged)... */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </div>
                  </div>

                  <div className="text-xs mt-1 space-y-1">
                    <p className="flex items-center">
                      {password.length >= 8 ? <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />}
                      <span className={password.length >= 8 ? "text-green-500" : "text-gray-500"}>At least 8 characters</span>
                    </p>
                    <p className="flex items-center">
                      {/[A-Z]/.test(password) ? <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />}
                      <span className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}>At least one uppercase letter</span>
                    </p>
                    <p className="flex items-center">
                      {/\d/.test(password) ? <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />}
                      <span className={/\d/.test(password) ? "text-green-500" : "text-gray-500"}>At least one number</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked === true)} />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-bank-blue hover:text-bank-navy">Terms</Link> and{" "}
                    <Link to="/privacy" className="text-bank-blue hover:text-bank-navy">Privacy Policy</Link>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-bank-blue hover:bg-bank-navy" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-sm text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-bank-blue hover:text-bank-navy font-medium">Sign in</Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex justify-center text-xs text-gray-500 space-x-2">
            <Shield className="h-3 w-3" />
            <span>Your information is protected with bank-grade encryption</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
