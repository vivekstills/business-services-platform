import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy">
      <p className="text-gray-500 text-sm mb-8">Last updated: February 2025</p>
      <h2>Overview</h2>
      <p>Mridhuv Associates strives to deliver high-quality business compliance and legal services. This Refund Policy outlines the circumstances under which refunds may be considered.</p>
      <h2>Eligibility for Refund</h2>
      <p>Refunds may be considered in the following situations:</p>
      <ul>
        <li>Service not initiated due to our inability to proceed</li>
        <li>Duplicate payment made in error</li>
        <li>Overpayment beyond the agreed service fee</li>
      </ul>
      <h2>Non-Refundable Amounts</h2>
      <p>Please note that the following are generally non-refundable:</p>
      <ul>
        <li>Government fees, stamp duty, or statutory charges already paid</li>
        <li>Services where work has commenced or documents have been filed</li>
        <li>Consultation or advisory fees once the session has been conducted</li>
      </ul>
      <h2>Refund Process</h2>
      <p>To request a refund, please contact us at <a href="mailto:enquiry@mridhuvassociates.com">enquiry@mridhuvassociates.com</a> with your transaction details. We will review your request and respond within 7–10 business days. Approved refunds will be processed within 15 business days.</p>
      <h2>Contact</h2>
      <p>For refund-related queries: <a href="mailto:enquiry@mridhuvassociates.com">enquiry@mridhuvassociates.com</a> or call <a href="tel:+919876543210">+91 98765 43210</a>.</p>
    </PolicyLayout>
  );
}
