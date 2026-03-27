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
    <div className="min-h-screen bg-white font-sans antialiased">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
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
        <Route path="/articles"               element={<ArticlesPage />} />
        <Route path="/articles/:slug"         element={<ArticlePage />} />
        <Route path="/admin"                  element={<AdminPage />} />
        <Route path="/admin/login"            element={<AdminLoginPage />} />
        <Route path="*"                       element={<Navigate to="/" replace />} />
      </Routes>
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
