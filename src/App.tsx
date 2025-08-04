import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import Cars from "@/pages/Cars";
import CarDetails from "@/pages/CarDetails";
import Merchandise from "@/pages/Merchandise";
import Services from "@/pages/Services";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";
import ShowroomProfile from "@/pages/ShowroomProfile";
import Showrooms from "@/pages/Showrooms";
import Learn from "@/pages/Learn";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <CartProvider>
            <Router>
              <TooltipProvider>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/cars/:id" element={<CarDetails />} />
                    <Route path="/merchandise" element={<Merchandise />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/cart" element={<Cart />} />
                     <Route path="/checkout" element={<Checkout />} />
                     <Route path="/profile" element={<Profile />} />
            <Route path="/showroom/:id" element={<ShowroomProfile />} />
            <Route path="/showrooms" element={<Showrooms />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                  <Sonner />
                </div>
              </TooltipProvider>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
