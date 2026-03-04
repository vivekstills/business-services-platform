import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="bg-[#060C18] text-white">
      <Hero />
      <Services />
      <Pricing />
      <ContactSection />
      <Footer />
    </div>
  );
}
