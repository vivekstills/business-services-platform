import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ServicePage from './pages/ServicePage';
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Routes>
        <Route path="/"                       element={<HomePage />} />
        <Route path="/category/:categoryId"   element={<CategoryPage />} />
        <Route path="/service/:serviceId"     element={<ServicePage />} />
        <Route path="*"                       element={<Navigate to="/" replace />} />
      </Routes>
      <ChatBot />
    </div>
  );
}
