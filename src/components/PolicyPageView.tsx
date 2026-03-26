import React from 'react';
import PolicyLayout from './PolicyLayout';
import RichContent from './RichContent';
import {
  mergePolicyPage,
  type PolicyPageEntry,
  type PolicyPageId,
} from '../data/policyPageDefaults';
import { useContent } from '../context/ContentContext';

export default function PolicyPageView({ policyId }: { policyId: PolicyPageId }) {
  const { content } = useContent();
  const merged = mergePolicyPage(
    policyId,
    content.policyPages as Partial<Record<PolicyPageId, Partial<PolicyPageEntry>>> | undefined
  );

  return (
    <PolicyLayout title={merged.title}>
      <p className="text-gray-500 text-sm mb-8">Last updated: {merged.lastUpdated}</p>
      <RichContent content={merged.bodyMarkdown} />
    </PolicyLayout>
  );
}
