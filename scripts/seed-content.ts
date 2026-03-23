/**
 * Seeds data/content.json from existing services.ts, faqs.ts, constants.
 * Run: npx tsx scripts/seed-content.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { SERVICES, SERVICE_CATEGORIES } from '../src/data/services';
import FAQS from '../src/data/faqs';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../src/data/constants';
import type { Content } from '../src/types/content';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'data', 'content.json');

const content: Content = {
  hero: {
    badge: "India's trusted business compliance platform",
    headline: "Launch & grow your business with complete legal compliance",
    subheadline:
      "GST Registration, Company Formation, Trademark, Tax Filing and 120+ more services — handled end‑to‑end by our expert team.",
    popular: [
      { label: 'GST Registration', to: '/service/gst-registration' },
      { label: 'Private Limited Co.', to: '/service/private-limited-company' },
      { label: 'Trademark', to: '/service/trademark-registration' },
      { label: 'ITR Filing', to: '/service/itr-1-filing' },
      { label: 'Import Export Code', to: '/service/import-export-code' },
    ],
    stats: [
      { value: '50,000+', label: 'Businesses served' },
      { value: '4.9 / 5', label: 'Average rating' },
      { value: '100%', label: 'Govt. approved process' },
    ],
    trustCard: {
      title: 'Expert Advisory',
      subtitle: 'Your business, our expertise — from registration to compliance.',
      items: [
        { label: 'GST Registration', time: '3–5 days' },
        { label: 'Company Incorporation', time: '7–10 days' },
        { label: 'Trademark Registration', time: '2–3 weeks' },
      ],
      rating: '4.9',
      reviews: '12,000+ reviews',
      badgeValue: '50K+',
      badgeLabel: 'Businesses',
    },
  },
  contact: {
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    address: 'Om Chambers, 468/A, 4th Floor, Binnamangala, 1st Stage, Indiranagar, Bangalore North, Karnataka – 560038.',
  },
  footer: {
    tagline: "India's trusted platform for business registrations, tax compliance and legal services.",
    serviceLinks: [
      {
        heading: 'Form New Business',
        items: [
          { label: 'Private Limited Company', to: '/service/private-limited-company' },
          { label: 'LLP', to: '/service/llp' },
          { label: 'One Person Company', to: '/service/one-person-company' },
          { label: 'Partnership', to: '/service/partnership' },
          { label: 'Nidhi Company', to: '/service/nidhi-company' },
        ],
      },
      {
        heading: 'Registrations',
        items: [
          { label: 'GST Registration', to: '/service/gst-registration' },
          { label: 'FSSAI Registration', to: '/service/fssai-registration' },
          { label: 'Trade License', to: '/service/trade-license' },
          { label: 'Import Export Code', to: '/service/import-export-code' },
          { label: 'Digital Signature', to: '/service/digital-signature' },
        ],
      },
      {
        heading: 'GST & Tax',
        items: [
          { label: 'GST Return Filing', to: '/service/gst-return-filing' },
          { label: 'GST Refund', to: '/service/gst-refund' },
          { label: 'ITR-1 Filing', to: '/service/itr-1-filing' },
          { label: 'ITR-3 Filing', to: '/service/itr-3-filing' },
          { label: 'TDS Return Filing', to: '/service/tds-return-filing' },
        ],
      },
      {
        heading: 'Trademark & IP',
        items: [
          { label: 'Trademark Registration', to: '/service/trademark-registration' },
          { label: 'Trademark Renewal', to: '/service/trademark-renewal' },
          { label: 'Copyright Registration', to: '/service/copyright-registration' },
          { label: 'Patent Registration', to: '/service/patent-registration' },
        ],
      },
    ],
    policyLinks: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Confidentiality Policy', to: '/confidentiality-policy' },
      { label: 'Disclaimer Policy', to: '/disclaimer-policy' },
      { label: 'Terms & Conditions', to: '/terms-conditions' },
      { label: 'Review Page', to: '/reviews' },
      { label: 'About Us', to: '/about-us' },
      { label: 'Contact Us', to: '/contact-us' },
    ],
    logoAlt: 'Mridhuv Associates',
    quickToolsHeading: 'Quick Tools',
    quickTools: [
      { label: 'Business Search', to: '/business-search' },
      { label: 'Trademark Search', to: '/trademark-search' },
    ],
    paymentTitle: 'Make a Payment',
    paymentFootnote: 'Secured by Razorpay · 256-bit SSL encryption',
    paymentPayButtonLabel: 'Pay Now',
    paymentSuccessTitle: 'Payment successful!',
    paymentSuccessSub: "You'll receive a confirmation shortly.",
    copyrightLine: '© {{year}} Mridhuv Associates. All rights reserved.',
  },
  categories: SERVICE_CATEGORIES,
  services: SERVICES,
  faqs: FAQS,
  pricing: {
    plans: [
      {
        name: 'Standard',
        badge: null,
        price: '₹4,500',
        tagline: 'Essential setup for new ventures',
        features: [
          'Company / entity registration',
          'PAN & TAN application',
          'Digital Signature (DSC)',
          'Director Identification Number (DIN)',
          'Basic compliance guidance',
        ],
        cta: 'Get Standard',
        ctaTo: '/category/new-business',
        highlight: false,
      },
      {
        name: 'Deluxe',
        badge: 'Most popular',
        price: '₹8,999',
        tagline: 'Complete compliance for growing companies',
        features: [
          'Everything in Standard',
          'GST Registration & 3-month filing',
          'MSME Registration',
          'Bank account opening support',
          '1 year annual compliance filing',
          'Dedicated account manager',
        ],
        cta: 'Get Deluxe',
        ctaTo: '/category/new-business',
        highlight: true,
      },
      {
        name: 'Premium',
        badge: null,
        price: '₹15,499',
        tagline: 'Full-service with trademark & legal support',
        features: [
          'Everything in Deluxe',
          'Trademark Registration',
          'Shareholders Agreement',
          'Employment contracts template',
          'Priority support (24 × 7)',
          'Legal consultation (2 hours)',
        ],
        cta: 'Get Premium',
        ctaTo: '/category/new-business',
        highlight: false,
      },
    ],
    footnote:
      'Each individual service also has its own tailored packages — browse any service for specific pricing.',
  },
  contactSection: {
    label: 'Get in Touch',
    heading: "Let's get your business started",
    subheading:
      'Fill out the form and our team will reach out within 24 business hours with a personalised plan for your requirements.',
    servicesList: [
      'GST Registration',
      'Private Limited Company',
      'LLP Formation',
      'Trademark Registration',
      'FSSAI Registration',
      'Import Export Code',
      'ITR Filing',
      'TDS Return',
      'Other',
    ],
    features: [
      { label: 'Expert consultation', desc: 'Talk to a specialist who understands your industry.' },
      { label: 'Fast turnaround', desc: 'Most services completed within 7–10 working days.' },
      { label: 'Fixed pricing', desc: 'No hidden fees — you know the cost upfront.' },
    ],
  },
  servicesSection: {
    label: 'Our Services',
    heading: 'Everything you need to start & run your business',
    description:
      '120+ services across registrations, tax, IP, compliance and more — handled end‑to‑end by experts.',
  },
};

const dir = dirname(outPath);
try {
  mkdirSync(dir, { recursive: true });
} catch {
  // dir may exist
}
writeFileSync(outPath, JSON.stringify(content, null, 2), 'utf-8');
console.log('Wrote data/content.json');
