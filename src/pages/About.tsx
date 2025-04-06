
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, CheckCircle, Users, Building, Award, Briefcase, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Jane Smith",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/women/27.jpg",
      bio: "With over 20 years in banking and fintech, Jane founded SecureLoan to revolutionize loan management."
    },
    {
      name: "Michael Johnson",
      role: "Chief Technology Officer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Michael leads our technology team with expertise in secure financial systems and digital banking."
    },
    {
      name: "Sarah Williams",
      role: "Chief Operations Officer",
      image: "https://randomuser.me/api/portraits/women/48.jpg",
      bio: "Sarah brings extensive experience in streamlining loan operations and optimizing customer experiences."
    }
  ];
  
  // Core values data
  const coreValues = [
    {
      title: "Customer-Centric",
      description: "We put our customers at the center of everything we do, providing personalized solutions that address their unique needs.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Integrity",
      description: "We uphold the highest ethical standards, ensuring transparency and honesty in all our operations and communications.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Innovation",
      description: "We continuously innovate to improve our services, incorporating cutting-edge technologies to enhance the banking experience.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: "Excellence",
      description: "We are committed to excellence in every aspect of our business, striving to exceed customer expectations.",
      icon: <Award className="h-6 w-6" />
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-bank-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">About SecureLoan</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              We're on a mission to transform the loan management experience with secure, 
              transparent, and customer-focused banking solutions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-bank-navy mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2015, SecureLoan began with a simple vision: to create a banking experience that truly puts customers first. 
                We recognized that traditional loan management systems were often complex, inefficient, and lacked transparency.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of banking and technology experts came together to build a platform that combines the security and stability 
                of traditional banking with the innovation and convenience of modern technology.
              </p>
              <p className="text-gray-600 mb-6">
                Today, SecureLoan serves thousands of customers nationwide, providing them with streamlined loan solutions that 
                empower them to achieve their financial goals. We continue to grow and evolve, always guided by our commitment to 
                customer satisfaction and financial innovation.
              </p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-3xl font-bold text-bank-blue">10,000+</p>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-bank-blue">$500M+</p>
                  <p className="text-gray-600">Loans Processed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-bank-blue">98%</p>
                  <p className="text-gray-600">Customer Satisfaction</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative h-80 lg:h-96 overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-bank-blue to-bank-navy opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div>
                    <Shield className="h-16 w-16 text-white mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                    <p className="text-blue-100">
                      To empower individuals and businesses with accessible, transparent, and efficient loan solutions that help them achieve financial success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bank-navy mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at SecureLoan, from product development to customer service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-bank-blue mb-4 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-bank-navy mb-3 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bank-navy mb-4">Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the experts behind SecureLoan who are dedicated to transforming banking experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-bank-navy">{member.name}</h3>
                  <p className="text-bank-blue mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-bank-navy mb-6">Why Choose SecureLoan?</h2>
              <p className="text-gray-600 mb-6">
                We're committed to providing you with the best loan management experience possible, 
                combining security, convenience, and personalized service.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-bank-success" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-bank-navy">Advanced Security</h3>
                    <p className="text-gray-600">Bank-grade security systems protect your data and transactions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-bank-success" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-bank-navy">Streamlined Process</h3>
                    <p className="text-gray-600">Our digital platform simplifies the entire loan journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-bank-success" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-bank-navy">Competitive Rates</h3>
                    <p className="text-gray-600">We offer some of the most competitive interest rates in the market.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-bank-success" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-bank-navy">Dedicated Support</h3>
                    <p className="text-gray-600">Our customer support team is available to assist you every step of the way.</p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8 bg-bank-blue hover:bg-bank-navy text-white">
                <Link to="/contact">Contact Our Team</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-bank-blue mb-4">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-bank-navy mb-2">Founded</h3>
                <p className="text-3xl font-bold text-bank-blue">2015</p>
                <p className="text-gray-600 mt-2">7+ years of excellence</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-bank-blue mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-bank-navy mb-2">Team</h3>
                <p className="text-3xl font-bold text-bank-blue">100+</p>
                <p className="text-gray-600 mt-2">Banking professionals</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-bank-blue mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-bank-navy mb-2">Loan Types</h3>
                <p className="text-3xl font-bold text-bank-blue">8+</p>
                <p className="text-gray-600 mt-2">For every need</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-bank-blue mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-bank-navy mb-2">Recognition</h3>
                <p className="text-3xl font-bold text-bank-blue">15+</p>
                <p className="text-gray-600 mt-2">Industry awards</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-bank-blue to-bank-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Better Banking?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have transformed their loan management experience with SecureLoan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-bank-blue hover:bg-blue-50">
              <Link to="/register">Create Account</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
