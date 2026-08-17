import { Toaster } from "@/components/ui/toaster";
import AccessibilityToggle from "@/components/shared/AccessibilityToggle";
import DevWorkflowTestPage from "./pages/DevWorkflowTestPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingWithAvatarPage from "./pages/LandingWithAvatarPage";
import GuidePage from "./pages/GuidePage";
import CardGuidePage from "./pages/CardGuidePage";
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
import MlsSimulatorPage from "./pages/MlsSimulatorPage";
import AdminVideoUpload from "./pages/AdminVideoUpload";
import BusinessCreditCardsForRealtorsPage from "./pages/BusinessCreditCardsForRealtorsPage";
import PricingPage from "./pages/PricingPage";
import ProgramProductPage from "./pages/ProgramProductPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import SmsOptInProofPage from "./pages/SmsOptInProofPage";
import OAuthConsentPage from "./pages/OAuthConsentPage";
import MockLoginPage from "./pages/MockLoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import OverviewSection from "./pages/dashboard/OverviewSection";
import GoalsSection from "./pages/dashboard/GoalsSection";
import ActionPlanSection from "./pages/dashboard/ActionPlanSection";
import RoadmapSection from "./pages/dashboard/RoadmapSection";
import MilestonesSection from "./pages/dashboard/MilestonesSection";
import FundingSection from "./pages/dashboard/FundingSection";
import ResourcesSection from "./pages/dashboard/ResourcesSection";
import ProgramSection from "./pages/dashboard/ProgramSection";
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
      <AccessibilityToggle />
      <BrowserRouter>
        <ScrollMemory />
        <AuthRoleProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-page/:slug" element={<LandingWithAvatarPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/card-guide" element={<CardGuidePage />} />
          <Route path="/guide/:slug" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/programs/:slug" element={<ProgramProductPage />} />
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
          <Route path="/mls-simulator" element={<MlsSimulatorPage />} />
          <Route
            path="/business-credit-cards-for-realtors"
            element={<BusinessCreditCardsForRealtorsPage />}
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/sms-opt-in" element={<SmsOptInProofPage />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsentPage />} />
          <Route path="/login" element={<MockLoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/mock-login" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<RequireVisitor><DashboardLayout /></RequireVisitor>}>
            <Route index element={<OverviewSection />} />
            <Route path="goals" element={<GoalsSection />} />
            <Route path="90-day" element={<ActionPlanSection />} />
            <Route path="roadmap" element={<RoadmapSection />} />
            <Route path="milestones" element={<MilestonesSection />} />
            <Route path="funding" element={<FundingSection />} />
            <Route path="resources" element={<ResourcesSection />} />
            <Route path="program" element={<ProgramSection />} />
          </Route>
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
          <Route path="/dev/workflow-test" element={<DevWorkflowTestPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthRoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
