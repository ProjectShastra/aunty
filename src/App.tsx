
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

/**
 * © Copyright 2025 - All Rights Reserved
 * Proprietary and confidential.
 * Unauthorized copying or distribution of this code is strictly prohibited.
 */

// Create query client for API management
const queryClient = new QueryClient();

const App = () => {
  // Prevent your app from being displayed in frames (basic anti-iframe protection)
  useEffect(() => {
    if (window.top !== window.self) {
      // If site is being embedded in an iframe
      window.top.location.href = window.location.href;
    }
    
    // Add simple copy protection
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      return false;
    });
    
    document.addEventListener("keydown", (e) => {
      // Prevent common copy shortcuts
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === "s" || e.key === "S" || 
           e.key === "c" || e.key === "C" ||
           e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return false;
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
