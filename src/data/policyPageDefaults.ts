/** Route id → matches /{id} path */
export type PolicyPageId =
  | 'privacy-policy'
  | 'refund-policy'
  | 'confidentiality-policy'
  | 'disclaimer-policy'
  | 'terms-conditions';

export type PolicyPageEntry = {
  title: string;
  lastUpdated: string;
  bodyMarkdown: string;
};

export const POLICY_PAGE_LIST: { id: PolicyPageId; adminLabel: string }[] = [
  { id: 'privacy-policy', adminLabel: 'Privacy Policy' },
  { id: 'refund-policy', adminLabel: 'Refund Policy' },
  { id: 'confidentiality-policy', adminLabel: 'Confidentiality Policy' },
  { id: 'disclaimer-policy', adminLabel: 'Disclaimer Policy' },
  { id: 'terms-conditions', adminLabel: 'Terms & Conditions' },
];

export const defaultPolicyPages: Record<PolicyPageId, PolicyPageEntry> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'February 2025',
    bodyMarkdown: `## Introduction

Mridhuv Associates ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.

## Information We Collect

We may collect personal information that you voluntarily provide when you:

- Fill out enquiry or contact forms
- Subscribe to our newsletter or updates
- Request a service or quote
- Communicate with us via email or phone

This may include your name, email address, phone number, state, and any other details you choose to provide.

## How We Use Your Information

We use the information we collect to:

- Process your enquiries and service requests
- Provide customer support and follow-up
- Send relevant updates about our services
- Improve our website and user experience
- Comply with legal and regulatory requirements

## Data Security

We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.

## Contact Us

For any privacy-related queries, contact us at [enquiry@mridhuvassociates.com](mailto:enquiry@mridhuvassociates.com).`,
  },
  'refund-policy': {
    title: 'Refund Policy',
    lastUpdated: 'February 2025',
    bodyMarkdown: `## Overview

Mridhuv Associates strives to deliver high-quality business compliance and legal services. This Refund Policy outlines the circumstances under which refunds may be considered.

## Eligibility for Refund

Refunds may be considered in the following situations:

- Service not initiated due to our inability to proceed
- Duplicate payment made in error
- Overpayment beyond the agreed service fee

## Non-Refundable Amounts

Please note that the following are generally non-refundable:

- Government fees, stamp duty, or statutory charges already paid
- Services where work has commenced or documents have been filed
- Consultation or advisory fees once the session has been conducted

## Refund Process

To request a refund, please contact us at [enquiry@mridhuvassociates.com](mailto:enquiry@mridhuvassociates.com) with your transaction details. We will review your request and respond within 7–10 business days. Approved refunds will be processed within 15 business days.

## Contact

For refund-related queries: [enquiry@mridhuvassociates.com](mailto:enquiry@mridhuvassociates.com) or call [+91 98765 43210](tel:+919876543210).`,
  },
  'confidentiality-policy': {
    title: 'Confidentiality Policy',
    lastUpdated: 'February 2025',
    bodyMarkdown: `## Our Commitment

Mridhuv Associates maintains strict confidentiality of all client information. We understand that the documents and data you share with us are sensitive and we treat them with the highest level of care.

## What We Protect

We protect all information shared with us, including but not limited to:

- Personal identification documents (PAN, Aadhaar, passport)
- Business and financial information
- Legal documents and agreements
- Communications and correspondence

## How We Protect Your Data

We use secure systems and processes to store and transmit your information. Access to client data is restricted to authorised personnel only, and we do not share your information with third parties except as required for service delivery or by law.

## Disclosure

We may disclose information only when required by law, court order, or government authority, or when necessary to fulfil our contractual obligations to you (e.g., filing with MCA, GST portal, or other regulatory bodies).

## Contact

For confidentiality-related concerns: [enquiry@mridhuvassociates.com](mailto:enquiry@mridhuvassociates.com).`,
  },
  'disclaimer-policy': {
    title: 'Disclaimer Policy',
    lastUpdated: 'February 2025',
    bodyMarkdown: `## General Disclaimer

The information provided on the Mridhuv Associates website is for general informational purposes only. It does not constitute legal, tax, or professional advice. While we strive to keep the information accurate and up to date, we make no representations or warranties of any kind regarding its completeness, accuracy, or suitability for any particular purpose.

## No Professional Advice

Content on this website, including FAQs, service descriptions, and pricing, is intended to provide a general overview. Your specific situation may require tailored advice. We recommend consulting with our team or a qualified professional before making decisions based on information found on this site.

## Third-Party Links

Our website may contain links to third-party websites (e.g., MCA, GST portal, IP India). We are not responsible for the content, accuracy, or practices of these external sites.

## Liability

Mridhuv Associates shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or reliance on information provided on this website.

## Contact

For clarifications: [enquiry@mridhuvassociates.com](mailto:enquiry@mridhuvassociates.com).`,
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    lastUpdated: 'February 2025',
    bodyMarkdown: `## Acceptance of Terms

By accessing or using the Mridhuv Associates website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.

## Services

We provide business registration, compliance, tax filing, trademark, and related legal and advisory services. The scope, deliverables, and fees for each service will be communicated separately and may be subject to a separate agreement or quote.

## User Obligations

You agree to:

- Provide accurate and complete information when requesting our services
- Cooperate in a timely manner with document submission and approvals
- Not use our services for any unlawful or fraudulent purpose

## Payment

Payment terms will be specified in your service agreement or quote. Government fees and statutory charges are separate and may vary based on your specific case.

## Intellectual Property

All content on this website, including text, logos, and design, is the property of Mridhuv Associates and is protected by applicable intellectual property laws.

## Governing Law

These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.

## Contact

For questions: [enquiry@mridhuvassociates.com](mailto:enquiry@mridhuvassociates.com) or [+91 98765 43210](tel:+919876543210).`,
  },
};

export function mergePolicyPage(
  id: PolicyPageId,
  fromContent: Partial<Record<PolicyPageId, Partial<PolicyPageEntry>>> | undefined
): PolicyPageEntry {
  const base = defaultPolicyPages[id];
  const ov = fromContent?.[id];
  return {
    title: (ov?.title?.trim() || base.title) as string,
    lastUpdated: (ov?.lastUpdated?.trim() || base.lastUpdated) as string,
    bodyMarkdown: (ov?.bodyMarkdown != null && String(ov.bodyMarkdown).trim() !== ''
      ? String(ov.bodyMarkdown)
      : base.bodyMarkdown) as string,
  };
}
