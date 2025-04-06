
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate form submission
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your message has been sent. We'll get back to you soon!",
      });
      
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      
      // Reset submitted state after some time
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-bank-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help you with all your loan-related inquiries.
          </p>
        </div>
      </section>
      
      {/* Contact Information and Form */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-bank-navy mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                We value your feedback and inquiries. Please fill out the form, and one of our representatives will get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <Phone className="h-6 w-6 text-bank-blue" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-bank-navy">Phone</h3>
                    <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                    <p className="mt-1 text-gray-600">+1 (555) 765-4321</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <Mail className="h-6 w-6 text-bank-blue" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-bank-navy">Email</h3>
                    <p className="mt-1 text-gray-600">support@secureloan.com</p>
                    <p className="mt-1 text-gray-600">info@secureloan.com</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <MapPin className="h-6 w-6 text-bank-blue" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-bank-navy">Office Address</h3>
                    <p className="mt-1 text-gray-600">
                      123 Financial District, Suite 100<br />
                      New York, NY 10004<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <Clock className="h-6 w-6 text-bank-blue" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-bank-navy">Business Hours</h3>
                    <p className="mt-1 text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-bank-navy mb-6">Send Us a Message</h2>
                  
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-medium text-bank-navy mb-2">Message Sent!</h3>
                      <p className="text-gray-600">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          id="subject" 
                          value={subject} 
                          onChange={(e) => setSubject(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea 
                          id="message" 
                          rows={4} 
                          value={message} 
                          onChange={(e) => setMessage(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-bank-blue hover:bg-bank-navy"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bank-navy mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find quick answers to some of our most commonly asked questions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-bank-navy mb-2">What types of loans do you offer?</h3>
              <p className="text-gray-600">
                We offer various loan types including personal loans, home loans, auto loans, and business loans. Each has different terms and conditions tailored to meet specific needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-bank-navy mb-2">How can I check my loan application status?</h3>
              <p className="text-gray-600">
                You can check your loan application status by logging into your account on our website or mobile app, or by contacting our customer support team.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-bank-navy mb-2">What documents are required for loan application?</h3>
              <p className="text-gray-600">
                Typically, you'll need proof of identity, address proof, income verification, and employment details. Specific requirements may vary depending on the loan type.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-bank-navy mb-2">How long does the loan approval process take?</h3>
              <p className="text-gray-600">
                The approval process typically takes 1-3 business days for personal loans, and slightly longer for home or business loans, depending on documentation verification.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
