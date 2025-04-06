
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  ArrowRight, 
  FileText, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  Bell,
  User,
  FileBarChart,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Dashboard = () => {
  // Mock data for active loans
  const activeLoans = [
    {
      id: 'PL-2023-001',
      type: 'Personal Loan',
      amount: 15000,
      remainingAmount: 10500,
      nextPayment: '2023-05-15',
      nextPaymentAmount: 576.12,
      status: 'active',
    },
    {
      id: 'HL-2022-054',
      type: 'Home Loan',
      amount: 250000,
      remainingAmount: 225000,
      nextPayment: '2023-05-01',
      nextPaymentAmount: 1245.33,
      status: 'active',
    }
  ];
  
  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 'TR-9876',
      date: '2023-04-25',
      description: 'Loan EMI Payment',
      amount: -1245.33,
      status: 'completed',
    },
    {
      id: 'TR-9875',
      date: '2023-04-15',
      description: 'Late Fee',
      amount: -25.00,
      status: 'completed',
    },
    {
      id: 'TR-9874',
      date: '2023-04-12',
      description: 'Loan Disbursement',
      amount: 15000.00,
      status: 'completed',
    }
  ];
  
  // Mock data for announcements/notifications
  const notifications = [
    {
      id: 1,
      title: 'Rate change notification',
      message: 'Interest rates for personal loans have been updated.',
      date: '2023-04-26',
      isRead: false,
    },
    {
      id: 2,
      title: 'Your application is approved',
      message: 'Your personal loan application has been approved.',
      date: '2023-04-20',
      isRead: true,
    },
    {
      id: 3,
      title: 'Documents verification complete',
      message: 'Your submitted documents have been verified successfully.',
      date: '2023-04-18',
      isRead: true,
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-bank-navy">Welcome, John Doe</h1>
              <p className="text-gray-600">Here's an overview of your loan accounts</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white">
                <FileText className="mr-2 h-4 w-4" /> Apply for Loan
              </Button>
              <Button className="bg-bank-blue hover:bg-bank-navy text-white">
                <DollarSign className="mr-2 h-4 w-4" /> Make a Payment
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Total Outstanding</h3>
                  <CreditCard className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">$235,500.00</div>
                <p className="text-sm text-gray-600">Across 2 active loans</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Next Payment Due</h3>
                  <Calendar className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">$1,245.33</div>
                <p className="text-sm text-gray-600">Due on May 1, 2023</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Loan Applications</h3>
                  <FileBarChart className="h-5 w-5 text-bank-blue" />
                </div>
                <div className="text-2xl font-bold text-bank-navy mb-1">1 Pending</div>
                <p className="text-sm text-gray-600">Auto Loan - Under Review</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Active Loans</CardTitle>
                    <Button variant="ghost" size="sm" className="text-bank-blue">
                      <Link to="/loans" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activeLoans.map((loan) => (
                      <div key={loan.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-bank-navy">{loan.type}</h4>
                            <p className="text-sm text-gray-500">Loan ID: {loan.id}</p>
                          </div>
                          <div className="loan-status-badge loan-status-active">Active</div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Repayment Progress</span>
                            <span>{Math.round((1 - loan.remainingAmount / loan.amount) * 100)}%</span>
                          </div>
                          <Progress value={Math.round((1 - loan.remainingAmount / loan.amount) * 100)} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-sm font-semibold">${loan.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Remaining Balance</p>
                            <p className="text-sm font-semibold">${loan.remainingAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Next Payment Date</p>
                            <p className="text-sm font-semibold">{new Date(loan.nextPayment).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Next Payment Amount</p>
                            <p className="text-sm font-semibold">${loan.nextPaymentAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button size="sm" variant="outline" className="text-bank-blue border-bank-blue">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-bank-blue hover:bg-bank-navy">
                            Make Payment
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Transactions</CardTitle>
                    <Button variant="ghost" size="sm" className="text-bank-blue">
                      <Link to="/transactions" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'} mr-4`}>
                            {transaction.amount < 0 ? (
                              <ArrowRight className={`h-4 w-4 ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`} />
                            ) : (
                              <ArrowRight className={`h-4 w-4 rotate-180 ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-bank-navy">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`text-sm font-semibold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {transaction.amount < 0 ? '-' : '+'} ${Math.abs(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" /> Download Statement
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileBarChart className="mr-2 h-4 w-4" /> View Loan Schedule
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" /> Update Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" /> Apply for New Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Notifications</CardTitle>
                    <Button variant="ghost" size="sm" className="text-bank-blue">
                      Mark All Read
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg ${notification.isRead ? 'bg-white' : 'bg-blue-50'} border border-gray-200`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium text-bank-navy">{notification.title}</h4>
                          {!notification.isRead && (
                            <span className="inline-block w-2 h-2 bg-bank-blue rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
