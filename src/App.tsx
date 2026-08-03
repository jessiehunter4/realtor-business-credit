import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingWithAvatarPage from "./pages/LandingWithAvatarPage";
import GuidePage from "./pages/GuidePage";
import AboutPage from "./pages/AboutPage";

import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import MLSImport from "./pages/MLSImport";
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
import PricingPage from "./pages/PricingPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import SmsOptInProofPage from "./pages/SmsOptInProofPage";
import OAuthConsentPage from "./pages/OAuthConsentPage";
import MockLoginPage from "./pages/MockLoginPage";
import SignupPage from "./pages/SignupPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import DashboardPage from "./pages/DashboardPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelledPage from "./pages/PaymentCancelledPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { RequireAdmin, RequireAuth, RequireVisitor } from "./components/auth/RoleGuards";
import { AuthRoleProvider } from "./hooks/useAuthRole";
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
        <AuthRoleProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-page/:slug" element={<LandingWithAvatarPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/guide/:slug" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/intake" element={<IntakeSurveyPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin-signup" element={<AdminSignupPage />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/mls-import" element={<MLSImport />} />
            <Route path="/admin/video-upload" element={<AdminVideoUpload />} />
            <Route path="/admin/intake" element={<AdminIntakeList />} />
            <Route path="/admin/intake/:id" element={<AdminIntakeCoachView />} />
            <Route path="/admin/plan/:id" element={<AdminPlanView />} />
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/portal/plan/:id" element={<PortalPlanView />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
          <Route path="/sample-plan" element={<SamplePlanPage />} />
          <Route
            path="/business-credit-cards-for-realtors"
            element={<BusinessCreditCardsForRealtorsPage />}
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/sms-opt-in" element={<SmsOptInProofPage />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsentPage />} />
          <Route path="/mock-login" element={<MockLoginPage />} />
          <Route path="/dashboard" element={<RequireVisitor><DashboardPage /></RequireVisitor>} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthRoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
