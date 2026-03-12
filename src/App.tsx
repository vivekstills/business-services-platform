import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ServicePage from './pages/ServicePage';
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
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
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
        <Route path="*"                       element={<Navigate to="/" replace />} />
      </Routes>
      <ChatBot />
    </div>
  );
}
