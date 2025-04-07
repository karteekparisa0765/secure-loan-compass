import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calculator from "./pages/Calculator";
import Dashboard from "./pages/Dashboard";
import BankStaffDashboard from "./pages/BankStaffDashboard"; // New import for staff dashboard
import Login from "./pages/Login";
import StaffReports from "./pages/StaffReports";
import Register from "./pages/Register";
import LoanApplication from "./pages/LoanApplication";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MakePayment from "./pages/MakePayment"; // New import for Make Payment page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Route for bank staff dashboard */}
          <Route path="/dashboard/staff" element={<BankStaffDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/staff/reports" element={<StaffReports />} />
          <Route path="/loans/:type" element={<LoanApplication />} />
          <Route path="/loans/apply" element={<LoanApplication />} />
          <Route path="/make-payment" element={<MakePayment />} /> {/* Added Make Payment route */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
