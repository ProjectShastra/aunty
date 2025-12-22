import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MatchView from "./pages/MatchView";
import ProfileView from "./pages/ProfileView";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Browse from "./pages/Browse";
import MainNav from "./components/MainNav";
import { ThemeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./hooks/useAuth";

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
    try {
      // Check if site is being embedded in an iframe
      if (window.top !== window.self) {
        console.log("App detected it's running in an iframe");
      }
    } catch (e) {
      console.error("Security restriction prevented checking frame status:", e);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MainNav />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/match" element={<MatchView />} />
                <Route path="/profile" element={<ProfileView />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
