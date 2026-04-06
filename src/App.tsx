import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ServicePage from './pages/ServicePage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ConfidentialityPolicyPage from './pages/ConfidentialityPolicyPage';
import DisclaimerPolicyPage from './pages/DisclaimerPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import ReviewsPage from './pages/ReviewsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import BusinessSearchPage from './pages/BusinessSearchPage';
import TrademarkSearchPage from './pages/TrademarkSearchPage';
import PaymentPage from './pages/PaymentPage';
import ServicesLandingPage from './pages/ServicesLandingPage';
import ServicesCategoryPage from './pages/ServicesCategoryPage';
import ServicesDetailPage from './pages/ServicesDetailPage';
import ServiceFormPage from './pages/ServiceFormPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import LeadCapturePopup from './components/LeadCapturePopup';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen app-soft-bg font-sans antialiased">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="pb-[70px] md:pb-0">
        <Routes>
          <Route path="/"                       element={<HomePage />} />
          <Route path="/category/:categoryId"   element={<CategoryPage />} />
          <Route path="/service/:serviceId"     element={<ServicePage />} />
          <Route path="/privacy-policy"         element={<PrivacyPolicyPage />} />
          <Route path="/refund-policy"          element={<RefundPolicyPage />} />
          <Route path="/confidentiality-policy" element={<ConfidentialityPolicyPage />} />
          <Route path="/disclaimer-policy"      element={<DisclaimerPolicyPage />} />
          <Route path="/terms-conditions"       element={<TermsConditionsPage />} />
          <Route path="/reviews"                element={<ReviewsPage />} />
          <Route path="/about-us"               element={<AboutUsPage />} />
          <Route path="/contact-us"             element={<ContactUsPage />} />
          <Route path="/business-search"        element={<BusinessSearchPage />} />
          <Route path="/trademark-search"       element={<TrademarkSearchPage />} />
          <Route path="/payment"                element={<PaymentPage />} />
          <Route path="/services"               element={<ServicesLandingPage />} />
          <Route path="/services/:category"     element={<ServicesCategoryPage />} />
          <Route path="/services/:category/:service" element={<ServicesDetailPage />} />
          <Route path="/services/:category/:service/form" element={<ServiceFormPage />} />
          <Route path="/articles"               element={<ArticlesPage />} />
          <Route path="/articles/:slug"         element={<ArticlePage />} />
          <Route path="/admin"                  element={<AdminPage />} />
          <Route path="/admin/login"            element={<AdminLoginPage />} />
          <Route path="*"                       element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ChatBot />}
      {!isAdmin && <LeadCapturePopup />}
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}
