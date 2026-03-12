import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

export default function TermsConditionsPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <p className="text-gray-500 text-sm mb-8">Last updated: February 2025</p>
      <h2>Acceptance of Terms</h2>
      <p>By accessing or using the Mridhuv Associates website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
      <h2>Services</h2>
      <p>We provide business registration, compliance, tax filing, trademark, and related legal and advisory services. The scope, deliverables, and fees for each service will be communicated separately and may be subject to a separate agreement or quote.</p>
      <h2>User Obligations</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate and complete information when requesting our services</li>
        <li>Cooperate in a timely manner with document submission and approvals</li>
        <li>Not use our services for any unlawful or fraudulent purpose</li>
      </ul>
      <h2>Payment</h2>
      <p>Payment terms will be specified in your service agreement or quote. Government fees and statutory charges are separate and may vary based on your specific case.</p>
      <h2>Intellectual Property</h2>
      <p>All content on this website, including text, logos, and design, is the property of Mridhuv Associates and is protected by applicable intellectual property laws.</p>
      <h2>Governing Law</h2>
      <p>These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>
      <h2>Contact</h2>
      <p>For questions: <a href="mailto:enquiry@mridhuvassociates.com">enquiry@mridhuvassociates.com</a> or <a href="tel:+919876543210">+91 98765 43210</a>.</p>
    </PolicyLayout>
  );
}
