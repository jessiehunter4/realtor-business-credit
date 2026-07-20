import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GuidePage from "./pages/GuidePage";

import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import MLSImport from "./pages/MLSImport";
import OneOnOnePage from "./pages/OneOnOnePage";
import IntakeSurveyPage from "./pages/IntakeSurveyPage";
import AdminIntakeList from "./pages/AdminIntakeList";
import AdminIntakeCoachView from "./pages/AdminIntakeCoachView";
import AdminPlanView from "./pages/AdminPlanView";
import PortalPlanView from "./pages/PortalPlanView";
import BookingConfirmedPage from "./pages/BookingConfirmedPage";
import CheckoutPage from "./pages/CheckoutPage";
import SamplePlanPage from "./pages/SamplePlanPage";
import AdminVideoUpload from "./pages/AdminVideoUpload";
import BusinessCreditCardsForRealtorsPage from "./pages/BusinessCreditCardsForRealtorsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import OAuthConsentPage from "./pages/OAuthConsentPage";
import MockLoginPage from "./pages/MockLoginPage";
import MockDashboardPage from "./pages/MockDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ScrollMemory from "./components/ScrollMemory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollMemory />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guide" element={<GuidePage />} />
          
          <Route path="/one-on-one" element={<OneOnOnePage />} />
          <Route path="/intake" element={<IntakeSurveyPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/mls-import" 
            element={
              <ProtectedRoute>
                <MLSImport />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/video-upload"
            element={
              <ProtectedRoute>
                <AdminVideoUpload />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/intake" 
            element={
              <ProtectedRoute>
                <AdminIntakeList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/intake/:id" 
            element={
              <ProtectedRoute>
                <AdminIntakeCoachView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/plan/:id" 
            element={
              <ProtectedRoute>
                <AdminPlanView />
              </ProtectedRoute>
            } 
          />
          <Route path="/portal/plan/:id" element={<PortalPlanView />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
          <Route path="/sample-plan" element={<SamplePlanPage />} />
          <Route
            path="/business-credit-cards-for-realtors"
            element={<BusinessCreditCardsForRealtorsPage />}
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsentPage />} />
          <Route path="/mock-login" element={<MockLoginPage />} />
          <Route path="/mock-dashboard" element={<MockDashboardPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
