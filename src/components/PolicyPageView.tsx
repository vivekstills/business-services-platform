import React from 'react';
import PolicyLayout from './PolicyLayout';
import RichContent from './RichContent';
import {
  mergePolicyPage,
  type PolicyPageEntry,
  type PolicyPageId,
} from '../data/policyPageDefaults';
import { useContent } from '../context/ContentContext';
import SEOHead from './SEOHead';

const POLICY_SEO: Record<PolicyPageId, { desc: string; kw: string }> = {
  'privacy-policy': {
    desc: 'Privacy Policy of Mridhuv Associates. Learn how we collect, use, and protect your personal data when using our business compliance services.',
    kw: 'Mridhuv Associates privacy policy, data protection, personal information',
  },
  'refund-policy': {
    desc: 'Refund Policy of Mridhuv Associates. Understand our refund, cancellation, and money-back terms for business registration and compliance services.',
    kw: 'Mridhuv Associates refund policy, cancellation policy, money back',
  },
  'confidentiality-policy': {
    desc: 'Confidentiality Policy of Mridhuv Associates. How we safeguard your sensitive business documents and information.',
    kw: 'Mridhuv Associates confidentiality, document security, business data protection',
  },
  'disclaimer-policy': {
    desc: 'Disclaimer Policy of Mridhuv Associates. Important legal disclaimers about our business compliance and legal services.',
    kw: 'Mridhuv Associates disclaimer, legal disclaimer, terms of use',
  },
  'terms-conditions': {
    desc: 'Terms & Conditions of Mridhuv Associates. Read the terms governing use of our business registration and compliance services.',
    kw: 'Mridhuv Associates terms and conditions, service agreement, terms of service',
  },
};

export default function PolicyPageView({ policyId }: { policyId: PolicyPageId }) {
  const { content } = useContent();
  const merged = mergePolicyPage(
    policyId,
    content.policyPages as Partial<Record<PolicyPageId, Partial<PolicyPageEntry>>> | undefined
  );
  const seo = POLICY_SEO[policyId];

  return (
    <PolicyLayout title={merged.title}>
      <SEOHead
        title={merged.title}
        description={seo.desc}
        canonical={`/${policyId}`}
        keywords={seo.kw}
      />
      <p className="text-gray-500 text-sm mb-8">Last updated: {merged.lastUpdated}</p>
      <RichContent content={merged.bodyMarkdown} />
    </PolicyLayout>
  );
}
