import React from 'react';
import Hero from '../components/Hero';
import PopularTagsSection from '../components/PopularTagsSection';
import QuickToolsSection from '../components/QuickToolsSection';
import Services from '../components/Services';
import ContactSection from '../components/ContactSection';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  return (
    <div className="home-seamless bg-transparent text-gray-900">
      <SEOHead
        canonical="/"
        keywords="Mridhuv Associates, Mridu Associates, GST registration, company registration India, private limited company, LLP registration, trademark registration, income tax filing, FSSAI registration, business compliance Bangalore, CA services, tax filing India"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Mridhuv Associates',
          description: "India's trusted platform for business registrations, tax compliance, trademark, and legal services.",
          url: 'https://mridhuvassociates.com',
          telephone: '+91-98765-43210',
          email: 'enquiry@mridhuvassociates.com',
          areaServed: { '@type': 'Country', name: 'India' },
          serviceType: [
            'GST Registration', 'Company Registration', 'Trademark Registration',
            'Income Tax Filing', 'LLP Registration', 'FSSAI Registration',
            'Import Export Code', 'Digital Signature Certificate',
          ],
        }}
      />
      <Hero />
      <PopularTagsSection />
      <QuickToolsSection />
      <Services />
      <ContactSection />
    </div>
  );
}
