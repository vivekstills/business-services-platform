import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import ContactSection from '../components/ContactSection';
export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Hero />
      <Services />
      <Pricing />
      <ContactSection />
    </div>
  );
}
