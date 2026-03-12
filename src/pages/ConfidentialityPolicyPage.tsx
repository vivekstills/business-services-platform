import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

export default function ConfidentialityPolicyPage() {
  return (
    <PolicyLayout title="Confidentiality Policy">
      <p className="text-gray-500 text-sm mb-8">Last updated: February 2025</p>
      <h2>Our Commitment</h2>
      <p>Mridhuv Associates maintains strict confidentiality of all client information. We understand that the documents and data you share with us are sensitive and we treat them with the highest level of care.</p>
      <h2>What We Protect</h2>
      <p>We protect all information shared with us, including but not limited to:</p>
      <ul>
        <li>Personal identification documents (PAN, Aadhaar, passport)</li>
        <li>Business and financial information</li>
        <li>Legal documents and agreements</li>
        <li>Communications and correspondence</li>
      </ul>
      <h2>How We Protect Your Data</h2>
      <p>We use secure systems and processes to store and transmit your information. Access to client data is restricted to authorised personnel only, and we do not share your information with third parties except as required for service delivery or by law.</p>
      <h2>Disclosure</h2>
      <p>We may disclose information only when required by law, court order, or government authority, or when necessary to fulfil our contractual obligations to you (e.g., filing with MCA, GST portal, or other regulatory bodies).</p>
      <h2>Contact</h2>
      <p>For confidentiality-related concerns: <a href="mailto:enquiry@mridhuvassociates.com">enquiry@mridhuvassociates.com</a>.</p>
    </PolicyLayout>
  );
}
