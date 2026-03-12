import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="text-gray-500 text-sm mb-8">Last updated: February 2025</p>
      <h2>Introduction</h2>
      <p>Mridhuv Associates ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
      <h2>Information We Collect</h2>
      <p>We may collect personal information that you voluntarily provide when you:</p>
      <ul>
        <li>Fill out enquiry or contact forms</li>
        <li>Subscribe to our newsletter or updates</li>
        <li>Request a service or quote</li>
        <li>Communicate with us via email or phone</li>
      </ul>
      <p>This may include your name, email address, phone number, state, and any other details you choose to provide.</p>
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process your enquiries and service requests</li>
        <li>Provide customer support and follow-up</li>
        <li>Send relevant updates about our services</li>
        <li>Improve our website and user experience</li>
        <li>Comply with legal and regulatory requirements</li>
      </ul>
      <h2>Data Security</h2>
      <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.</p>
      <h2>Contact Us</h2>
      <p>For any privacy-related queries, contact us at <a href="mailto:enquiry@mridhuvassociates.com">enquiry@mridhuvassociates.com</a>.</p>
    </PolicyLayout>
  );
}
