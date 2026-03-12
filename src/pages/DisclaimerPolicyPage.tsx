import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

export default function DisclaimerPolicyPage() {
  return (
    <PolicyLayout title="Disclaimer Policy">
      <p className="text-gray-500 text-sm mb-8">Last updated: February 2025</p>
      <h2>General Disclaimer</h2>
      <p>The information provided on the Mridhuv Associates website is for general informational purposes only. It does not constitute legal, tax, or professional advice. While we strive to keep the information accurate and up to date, we make no representations or warranties of any kind regarding its completeness, accuracy, or suitability for any particular purpose.</p>
      <h2>No Professional Advice</h2>
      <p>Content on this website, including FAQs, service descriptions, and pricing, is intended to provide a general overview. Your specific situation may require tailored advice. We recommend consulting with our team or a qualified professional before making decisions based on information found on this site.</p>
      <h2>Third-Party Links</h2>
      <p>Our website may contain links to third-party websites (e.g., MCA, GST portal, IP India). We are not responsible for the content, accuracy, or practices of these external sites.</p>
      <h2>Liability</h2>
      <p>Mridhuv Associates shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or reliance on information provided on this website.</p>
      <h2>Contact</h2>
      <p>For clarifications: <a href="mailto:enquiry@mridhuvassociates.com">enquiry@mridhuvassociates.com</a>.</p>
    </PolicyLayout>
  );
}
