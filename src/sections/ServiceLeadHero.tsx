import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Service, ServicePackage } from '../data/services';
import { getPricingTabGroups, pricingPlanToServicePackage } from '../utils/pricingTabs';
import { useContent } from '../context/ContentContext';
import ServiceFAQ from '../components/ServiceFAQ';
import PaymentModal from '../components/PaymentModal';
import RichContent from '../components/RichContent';
import PricingFeatureText from '../components/PricingFeatureText';
import { isRichMarkdown } from '../data/serviceAboutContent';
import { BUSINESS_CONV_BATCH3_SERVICE_IDS } from '../data/businessConvBatch3ServiceIds';
import { FEMA_BATCH4_SERVICE_IDS } from '../data/femaBatch4ServiceIds';
import { FSSAI_BATCH5_SERVICE_IDS } from '../data/fssaiBatch5ServiceIds';
import { GOV_REG_BATCH6_SERVICE_IDS } from '../data/govRegBatch6ServiceIds';
import { GST_BATCH7_SERVICE_IDS } from '../data/gstBatch7ServiceIds';
import { EXIM_BATCH8_SERVICE_IDS } from '../data/eximBatch8ServiceIds';
import { INCOME_TAX_BATCH9_SERVICE_IDS } from '../data/incomeTaxBatch9ServiceIds';
import { INTL_INCORPORATION_BATCH10_SERVICE_IDS } from '../data/intlIncorporationBatch10ServiceIds';
import { LICENSES_PERMITS_BATCH11_SERVICE_IDS } from '../data/licensesPermitsBatch11ServiceIds';
import { MCA_COMPLIANCE_BATCH12_SERVICE_IDS } from '../data/mcaComplianceBatch12ServiceIds';
import { parsePriceToAmount } from '../utils/price';
import {
  INDIAN_STATES,
  type IndianState,
  getStateFAQs,
  getStatePackages,
  hasProfessionalTax,
  isNEHillyState,
} from '../data/stateData';
import {
  AlertCircle, CheckCircle2, Mail, Phone, User, ChevronRight, Check, MapPin, Info, CreditCard,
} from 'lucide-react';

type Props = { service: Service };

function cleanText(value: string): string {
  return value
    .replace(/\*\*/g, '')
    .replace(/[#*_`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getAboutParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((p) => cleanText(p))
    .filter((p) => p.length > 0)
    .slice(0, 3);
}

function isOnRequestPrice(price: string): boolean {
  return /\bon\s*request\b/i.test((price || '').trim());
}

function stepsFor(service: Service): string[] {
  // Admin-configured steps take priority
  if (service.steps && service.steps.length > 0) return service.steps;

  // Hardcoded per-service fallbacks
  const byId: Record<string, string[]> = {
    'gst-registration': [
      'Complete application preparation',
      'Instant TRN (Temporary Reference Number) generation',
      'ARN (Application Reference Number) generation',
      'GST Certificate delivery',
    ],
    'private-limited-company': [
      'Name availability check on MCA',
      'DSC & DIN for all directors',
      'SPICe+ form filing & name approval',
      'Certificate of Incorporation + PAN/TAN',
    ],
    'trademark-registration': [
      'Trademark search & class selection',
      'Application filing with Trade Marks Registry',
      'Objection / opposition response if needed',
      'Registration certificate delivery',
    ],
  };
  if (byId[service.id]) return byId[service.id];

  const byCategory: Record<string, string[]> = {
    'gst-services':   ['Document checklist shared', 'Data validation & preparation', 'Portal filing & submission', 'Acknowledgement & follow-up'],
    'trademark-ip':   ['Search & class selection', 'Application filing', 'Objection handling (if any)', 'Registration tracking'],
    'international-incorporations': ['Structure & jurisdiction advice', 'Name & incorporation filing', 'Bank / EIN / registrations', 'Compliance handover'],
    'hr-compliance':  ['Applicability assessment', 'Registration setup', 'Employee mapping & onboarding', 'Ongoing compliance support'],
    'return-filing':  ['Document & data collection', 'Computation & verification', 'Filing on income tax portal', 'Acknowledgement & ITR-V'],
    'legal-compliance': ['Requirement discussion', 'Document & form preparation', 'Filing with appropriate authority', 'Follow-up until completion'],
  };
  return byCategory[service.categoryId] ?? [
    'Consultation & requirement capture',
    'Document checklist & collection',
    'Application filing with authority',
    'Follow-ups until completion',
  ];
}

// Built-in fallbacks when admin has not set a custom message for this service + state
function stateHintFallback(serviceId: string, state: IndianState | ''): string | null {
  if (!state) return null;
  if (serviceId === 'gst-registration') {
    if (isNEHillyState(state))
      return `${state} is a special category state — mandatory GST threshold is ₹10 Lakhs (not ₹20 Lakhs).`;
  }
  if (serviceId === 'professional-tax-registration') {
    if (!hasProfessionalTax(state))
      return `Professional Tax is NOT applicable in ${state}. No PT registration is required here.`;
    return `${state} levies Professional Tax. Applicable rates and slabs are shown in the FAQ below.`;
  }
  if (serviceId === 'private-limited-company' || serviceId === 'llp') {
    if (state === 'Maharashtra') return 'Maharashtra has higher stamp duty on MOA/AOA. State-specific pricing is reflected below.';
    if (state === 'Delhi (NCT)')  return 'Delhi has low stamp duty and NO Professional Tax — one of the most cost-effective states to incorporate.';
    if (state === 'Karnataka')    return 'Karnataka requires Shops Act + BBMP Trade Licence post-incorporation.';
  }
  return null;
}

function getStateServiceHint(
  serviceId: string,
  state: IndianState | '',
  hints?: Record<string, Record<string, string>>
): string | null {
  if (!state) return null;
  const custom = hints?.[serviceId]?.[state];
  if (custom != null && String(custom).trim()) return String(custom).trim();
  return stateHintFallback(serviceId, state);
}

export default function ServiceLeadHero({ service }: Props) {
  const { content } = useContent();
  const steps   = useMemo(() => stepsFor(service), [service]);
  const category = content.categories.find((c) => c.id === service.categoryId);
  const faqs = content.faqs[service.id] ?? [];

  const [formData, setFormData]         = useState({ name: '', email: '', phone: '', state: '' as IndianState | '' });
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  // Payment modal state
  const [paymentOpen, setPaymentOpen]   = useState(false);
  const [paymentPkg, setPaymentPkg]     = useState<{ name: string; price: string; amount: number } | null>(null);

  // Derive state-specific data reactively
  const selectedState = formData.state;
  const stateFaqConfig = content.stateFaqConfig;
  const contentStatePackages = content.statePackages;
  const stateFAQs     = useMemo(() => getStateFAQs(service.id, selectedState, stateFaqConfig), [service.id, selectedState, stateFaqConfig]);
  const statePackages = useMemo(() => getStatePackages(service.id, selectedState, contentStatePackages), [service.id, selectedState, contentStatePackages]);
  const activePackages = statePackages ?? service.packages;
  /** True when showing state-specific package list (content or built-in state tiers), not default service.packages */
  const usingStatePackages = statePackages != null;

  const servicePricingPage = content.pricing.servicePricingPages?.find((x) => x.serviceId === service.id);
  const customPricingTabs = useMemo(
    () =>
      servicePricingPage?.tabs?.length
        ? getPricingTabGroups({ tabs: servicePricingPage.tabs, plans: [] })
        : [],
    [servicePricingPage?.tabs]
  );
  const hasCustomTabbedPricing =
    !usingStatePackages &&
    customPricingTabs.length > 0 &&
    customPricingTabs.some((t) => (t.plans?.length ?? 0) > 0);

  const [serviceTabIdx, setServiceTabIdx] = useState(0);
  useEffect(() => {
    setServiceTabIdx((i) => Math.min(i, Math.max(0, customPricingTabs.length - 1)));
  }, [customPricingTabs.length]);

  const packagesFromAdminTabs = useMemo(() => {
    if (!hasCustomTabbedPricing) return null;
    const idx = Math.min(serviceTabIdx, Math.max(0, customPricingTabs.length - 1));
    const plans = customPricingTabs[idx]?.plans ?? [];
    return plans.map(pricingPlanToServicePackage);
  }, [hasCustomTabbedPricing, customPricingTabs, serviceTabIdx]);

  const displayPackages: ServicePackage[] = packagesFromAdminTabs ?? activePackages;
  const onRequestPackages = useMemo(
    () => displayPackages.filter((pkg) => isOnRequestPrice(pkg.price)),
    [displayPackages]
  );
  const packagesToRender: ServicePackage[] = onRequestPackages.length > 0 ? [onRequestPackages[0]] : displayPackages;
  const aboutParagraphs = useMemo(() => getAboutParagraphs(service.content), [service.content]);
  const keyPoints = useMemo(() => steps.slice(0, 3), [steps]);

  const packageVisuals = (pkg: ServicePackage) => {
    const isRecommended = usingStatePackages && Boolean(pkg.recommended);
    const isGradient = usingStatePackages
      ? Boolean(pkg.recommended ?? pkg.popular)
      : Boolean(pkg.popular);
    const badgeLabel =
      (pkg.customBadge?.trim() ?? '') ||
      (isGradient ? (isRecommended ? '★ Recommended' : '★ Most Popular') : '');
    const showBadgePill = badgeLabel.length > 0;
    const badgeClass = isRecommended ? 'bg-violet-500 text-white' : 'bg-amber-400 text-amber-900';
    return { isGradient, badgeLabel, showBadgePill, badgeClass };
  };
  const hint = useMemo(
    () => getStateServiceHint(service.id, selectedState, content.stateServiceHints),
    [service.id, selectedState, content.stateServiceHints]
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())  e.name  = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
    if (!formData.state)        e.state = 'Please select your state';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceId: service.id,
          serviceName: service.name,
          state: formData.state,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? 'Submission failed. Please try again.');
      }
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', state: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (key: string) =>
    `w-full h-10 rounded-[10px] bg-white border border-gray-200 px-2.5 pl-9 text-[13px] text-gray-800 placeholder-gray-400/90 focus:outline-none transition-[box-shadow,border-color] ${
      errors[key]
        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    }`;

  const selectCls = (key: string) =>
    `w-full h-10 rounded-[10px] bg-white border border-gray-200 pl-9 pr-3 text-[13px] text-gray-700 focus:outline-none transition-[box-shadow,border-color] appearance-none cursor-pointer ${
      errors[key]
        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    }`;

  const scrollToEnquiry = () =>
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-transparent pt-16 noise-overlay">
      <section className="relative bg-transparent overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-blue-100/30 to-sky-50/20 rounded-full blur-[120px] animate-float-glow" />
          <div className="absolute bottom-0 left-[10%] w-[350px] h-[250px] bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-[90px] animate-float-glow-slow" />
          <div className="absolute inset-0 dot-grid" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:pt-8 lg:pb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            {category && (
              <>
                <Link to={`/category/${category.id}`} className="hover:text-gray-600 transition-colors">
                  {category.title}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-gray-600 font-medium">{service.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_minmax(0,400px)] gap-8 sm:gap-9 lg:gap-10 items-start lg:items-start">
            <div className="lg:max-w-[520px] min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] font-bold text-gray-900 tracking-tight leading-[1.2] mb-2"
              >
                {service.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-gray-600 text-[13px] sm:text-[calc(14px+3pt)] leading-relaxed mb-5 sm:mb-6 max-w-2xl line-clamp-3 sm:line-clamp-none"
              >
                {service.shortDescription || 'Get complete expert support from documentation to filing and follow-ups, all handled by specialists.'}
              </motion.p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 mb-8 sm:mb-10">
                <button
                  type="button"
                  onClick={scrollToEnquiry}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200 min-h-[40px]"
                >
                  Get Started
                </button>
                <a
                  href="tel:+919876543210"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-[13px] font-semibold hover:bg-gray-50 transition-all duration-200 min-h-[40px]"
                >
                  Talk to Expert
                </a>
              </div>

              <div>
                <h2 className="text-[15px] sm:text-[calc(18px+3pt)] font-semibold text-gray-900 mb-3 sm:mb-3.5">How it works</h2>
                <ol className="space-y-2 sm:space-y-2.5">
                  {steps.map((step, idx) => (
                    <li key={`${service.id}-hero-step-${idx}`} className="flex items-stretch gap-2.5">
                      <div className="relative flex w-5 flex-shrink-0 flex-col items-center self-stretch">
                        <span className="relative z-[1] mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold ring-2 ring-white shadow-sm">
                          {idx + 1}
                        </span>
                        {idx < steps.length - 1 && (
                          <div
                            aria-hidden
                            className="absolute left-1/2 top-[22px] -bottom-2.5 w-px -translate-x-1/2 bg-blue-200 sm:bg-blue-200/95"
                          />
                        )}
                      </div>
                      <span className="text-[13px] sm:text-[calc(13px+3pt)] text-gray-700 leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <motion.div
              id="enquiry-form"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="quick-enquiry-form w-full max-w-[min(100%,400px)] mx-auto max-lg:mt-10 lg:mx-0 lg:ml-auto bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 leading-snug tracking-tight">Quick Enquiry</p>
              <form id="service-enquiry-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Name */}
                  <div className="form-group">
                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <User className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] opacity-40 ${errors.name ? 'text-red-400 opacity-100' : 'text-gray-500'}`} />
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputCls('name')}
                        placeholder="Your full name"
                      />
                      {errors.name && <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-400" />}
                    </div>
                    {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] opacity-40 ${errors.email ? 'text-red-400 opacity-100' : 'text-gray-500'}`} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputCls('email')}
                        placeholder="you@company.com"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] opacity-40 ${errors.phone ? 'text-red-400 opacity-100' : 'text-gray-500'}`} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputCls('phone')}
                        placeholder="Your phone number"
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
                  </div>

                  {/* State */}
                  <div className="form-group">
                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                      State / UT
                    </label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] z-10 pointer-events-none opacity-40 ${errors.state ? 'text-red-400 opacity-100' : 'text-gray-500'}`} />
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value as IndianState | '' })}
                        className={selectCls('state')}
                      >
                        <option value="">Select your state / UT…</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-400 pointer-events-none" />}
                    </div>
                    {errors.state && <p className="text-[10px] text-red-500 mt-0.5">{errors.state}</p>}

                    {/* Contextual state hint */}
                    <AnimatePresence>
                      {hint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 flex items-start gap-1.5 bg-blue-50/90 border border-blue-100 rounded-[10px] px-2 py-1.5">
                            <Info className="w-3 h-3 text-blue-500/80 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-[11px] text-blue-800/90 leading-snug">{hint}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-submit-btn w-full h-10 rounded-xl bg-blue-600 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-900/5 hover:bg-blue-500 hover:brightness-[1.03] active:brightness-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100 mt-0.5"
                  >
                    {isSubmitting ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Submitting…</>
                    ) : isSubmitted ? (
                      <><CheckCircle2 className="w-4 h-4" /> Submitted</>
                    ) : 'Continue'}
                  </button>

                  {submitError && (
                    <div className="flex items-start gap-1.5 bg-red-50 border border-red-100 rounded-[10px] px-2 py-1.5">
                      <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[10px] sm:text-[11px] text-red-600/95 leading-snug">{submitError}</span>
                    </div>
                  )}
                  {isSubmitted && (
                    <div className="flex items-start gap-1.5 bg-emerald-50/80 border border-emerald-100 rounded-[10px] px-2 py-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[10px] sm:text-[11px] text-emerald-800/90 leading-snug">
                        We will contact you shortly.
                      </span>
                    </div>
                  )}

                  <p className="text-[9px] sm:text-[10px] text-gray-400/90 leading-snug pt-0.5">
                    By continuing you agree to be contacted about <span className="text-gray-500">{service.name}</span>.
                  </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-12 lg:mt-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">About this page</h2>
        {isRichMarkdown(service.content) ? (
          <div className="bg-white rounded-xl border border-gray-200/80 px-5 sm:px-8 py-6 sm:py-8">
            <RichContent
              content={service.content}
              stripLeadingH1
              variant="service"
              contentPreset={
                BUSINESS_CONV_BATCH3_SERVICE_IDS.has(service.id)
                  ? 'business-conv-batch-3'
                  : FEMA_BATCH4_SERVICE_IDS.has(service.id)
                    ? 'fema-batch-4'
                    : FSSAI_BATCH5_SERVICE_IDS.has(service.id)
                      ? 'fssai-batch-5'
                      : GOV_REG_BATCH6_SERVICE_IDS.has(service.id)
                        ? 'gov-reg-batch-6'
                        : EXIM_BATCH8_SERVICE_IDS.has(service.id)
                          ? 'exim-batch-8'
                          : GST_BATCH7_SERVICE_IDS.has(service.id)
                            ? 'gst-batch-7'
                            : INCOME_TAX_BATCH9_SERVICE_IDS.has(service.id)
                              ? 'income-tax-batch-9'
                              : INTL_INCORPORATION_BATCH10_SERVICE_IDS.has(service.id)
                                ? 'intl-incorporation-batch-10'
                                : LICENSES_PERMITS_BATCH11_SERVICE_IDS.has(service.id)
                                  ? 'licenses-permits-batch-11'
                                  : MCA_COMPLIANCE_BATCH12_SERVICE_IDS.has(service.id)
                                    ? 'mca-compliance-batch-12'
                                    : undefined
              }
            />
          </div>
        ) : (
          <div className="space-y-4 max-w-none">
            {aboutParagraphs.slice(0, 1).map((paragraph, idx) => (
              <p key={idx} className="text-gray-600 text-[13px] sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">{paragraph}</p>
            ))}
            <ul className="space-y-2">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[12px] sm:text-sm text-gray-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {packagesToRender.length > 0 && (
        <section className="relative bg-transparent py-5 sm:py-12 lg:mt-[60px] overflow-hidden noise-overlay">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/15 rounded-full blur-[130px] animate-float-glow" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-sky-100/20 to-transparent rounded-full blur-[80px]" />
          </div>

          <div className="relative z-[2] max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-5 sm:mb-12">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">
                {hasCustomTabbedPricing ? servicePricingPage?.sectionLabel?.trim() || 'Pricing' : 'Pricing'}
              </p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-2 sm:mb-3">
                {hasCustomTabbedPricing ? servicePricingPage?.sectionTitle?.trim() || `Choose the right package` : 'Choose the right package'}
              </h2>
              <p className="text-gray-500 text-xs sm:text-[calc(15px+3pt)]">
                {hasCustomTabbedPricing
                  ? servicePricingPage?.sectionSubtitle?.trim() || 'Standard, Deluxe and Premium plans with transparent pricing.'
                  : 'Standard, Deluxe and Premium plans with transparent pricing.'}
              </p>
            </div>

            {hasCustomTabbedPricing && customPricingTabs.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Service pricing options">
                {customPricingTabs.map((tab, i) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={serviceTabIdx === i}
                    onClick={() => setServiceTabIdx(i)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      serviceTabIdx === i
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200/40'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {hasCustomTabbedPricing && customPricingTabs[Math.min(serviceTabIdx, customPricingTabs.length - 1)]?.description?.trim() && (
              <p className="text-gray-600 text-[calc(14px+3pt)] mb-8 max-w-3xl">
                {customPricingTabs[Math.min(serviceTabIdx, customPricingTabs.length - 1)].description!.trim()}
              </p>
            )}

            {/* State pricing notice */}
            <AnimatePresence>
              {selectedState && statePackages && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-8"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <p className="text-[calc(12.5px+3pt)] text-blue-700 font-medium">
                    Pricing updated for <strong>{selectedState}</strong> — includes state-specific government fees & compliance.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary cards — first 3, homepage style */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedState || 'default'}-${hasCustomTabbedPricing ? serviceTabIdx : 0}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x snap-mandatory sm:grid sm:overflow-visible sm:pb-0 sm:grid-cols-2 xl:grid-cols-3 sm:items-stretch sm:gap-5 lg:gap-6">
                  {packagesToRender.slice(0, 3).map((pkg, i) => {
                    const { isGradient, badgeLabel, showBadgePill, badgeClass } = packageVisuals(pkg);
                    const amountPaise = parsePriceToAmount(pkg.price);
                    return (
                      <motion.div
                        key={`${pkg.name}-${i}`}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        className={`relative snap-start shrink-0 min-w-[220px] max-w-[240px] sm:min-w-0 sm:max-w-none basis-[75%] [@media(max-width:379px)]:basis-[88%] sm:basis-auto sm:shrink flex sm:h-full flex-col rounded-[16px] border p-4 sm:p-8 overflow-hidden transition-all ${isGradient ? 'sm:pt-7' : ''} ${i === 1 ? 'lg:scale-[1.03] lg:z-[2]' : ''} ${
                          isGradient
                            ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500/50 shadow-2xl shadow-blue-200/40 ring-2 ring-blue-100'
                            : 'card-hover-warm bg-white border-gray-200/80 hover:shadow-xl hover:shadow-gray-200/50'
                        }`}
                      >
                        {showBadgePill && (
                          <div className="absolute top-2 left-2 sm:top-3.5 sm:left-1/2 sm:-translate-x-1/2 z-10 max-w-[80%] sm:max-w-none">
                            <span className={`px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[12px] font-bold shadow whitespace-nowrap overflow-hidden text-ellipsis ${badgeClass}`}>
                              {badgeLabel}
                            </span>
                          </div>
                        )}

                          <div className={`mb-3 sm:mb-6 ${isGradient ? 'sm:pt-7 sm:mt-1' : ''}`}>
                          <h3 className={`text-[14px] sm:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3 break-words ${isGradient ? 'text-blue-200' : 'text-gray-400'}`}>
                            {pkg.name}
                          </h3>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className={`text-[20px] sm:text-4xl font-semibold tracking-tight break-words ${isGradient ? 'text-white' : 'text-gray-900'}`}>
                              {pkg.price}
                            </span>
                          </div>
                          <p className={`text-[13px] sm:text-[calc(13px+3pt)] leading-[1.4] line-clamp-3 break-words max-w-full ${isGradient ? 'text-blue-200' : 'text-gray-400'}`}>
                            {pkg.description}
                          </p>
                        </div>

                        {pkg.features && pkg.features.length > 0 && (
                          <div className="flex-1 mb-5">
                            <p className={`text-[calc(10.5px+3pt)] font-bold uppercase tracking-[0.15em] mb-2 sm:mb-3 ${isGradient ? 'text-blue-300' : 'text-gray-400'}`}>
                              What's included:
                            </p>
                            <ul className="space-y-2 sm:space-y-2.5">
                              {pkg.features.map((f, fi) => (
                                <li key={fi} className={`flex items-start gap-2 text-[12px] sm:text-[calc(13.5px+3pt)] ${isGradient ? 'text-blue-100' : 'text-gray-600'}`}>
                                  <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isGradient ? 'bg-white/20' : 'bg-emerald-50'}`}>
                                    <Check className={`w-2.5 h-2.5 ${isGradient ? 'text-white' : 'text-emerald-600'}`} />
                                  </div>
                                  <PricingFeatureText text={f} className="min-w-0" />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-auto space-y-2.5">
                          {amountPaise !== null && (
                            <button
                              onClick={() => {
                                setPaymentPkg({ name: pkg.name, price: pkg.price, amount: amountPaise });
                                setPaymentOpen(true);
                              }}
                              className={`w-full h-11 sm:h-12 mt-3 sm:mt-auto flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-[calc(13.5px+3pt)] font-semibold transition-all ${
                                isGradient
                                  ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
                              }`}
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Pay {pkg.price}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={scrollToEnquiry}
                            className={`w-full h-11 sm:h-12 mt-3 flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-[calc(13.5px+3pt)] font-semibold transition-all ${
                              isGradient
                                ? 'border border-white/30 text-white/80 hover:bg-white/10'
                                : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                          >
                            Get started <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {packagesToRender.length > 3 && (
                  <div className="mt-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em] mb-4">More options</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {packagesToRender.slice(3).map((pkg, i) => {
                        const { isGradient, badgeLabel, showBadgePill, badgeClass } = packageVisuals(pkg);
                        const amountPaise = parsePriceToAmount(pkg.price);
                        return (
                          <motion.div
                            key={`${pkg.name}-more-${i}`}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                              isGradient
                                ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500/50 shadow-xl shadow-blue-200/30 ring-2 ring-blue-100'
                                : 'card-hover-warm bg-white border-gray-200/80 hover:shadow-lg'
                            }`}
                          >
                            {showBadgePill && (
                              <div className="absolute -top-3 left-5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[calc(10px+3pt)] font-bold shadow ${badgeClass}`}>
                                  {badgeLabel}
                                </span>
                              </div>
                            )}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div>
                                <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isGradient ? 'text-blue-200' : 'text-gray-400'}`}>
                                  {pkg.name}
                                </h3>
                                <div className={`text-2xl font-bold tracking-tight ${isGradient ? 'text-white' : 'text-gray-900'}`}>
                                  {pkg.price}
                                </div>
                                {pkg.description && (
                                  <p className={`text-[calc(12px+3pt)] mt-1 ${isGradient ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {pkg.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {pkg.features && pkg.features.length > 0 && (
                              <ul className="space-y-2 mb-4 flex-1">
                                {pkg.features.map((f, fi) => (
                                  <li key={fi} className={`flex items-start gap-2 text-[calc(12.5px+3pt)] ${isGradient ? 'text-blue-100' : 'text-gray-600'}`}>
                                    <div className={`mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${isGradient ? 'bg-white/20' : 'bg-emerald-50'}`}>
                                      <Check className={`w-2 h-2 ${isGradient ? 'text-white' : 'text-emerald-600'}`} />
                                    </div>
                                    <PricingFeatureText text={f} className="min-w-0" />
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="space-y-2 mt-auto">
                              {amountPaise !== null && (
                                <button
                                  onClick={() => {
                                    setPaymentPkg({ name: pkg.name, price: pkg.price, amount: amountPaise });
                                    setPaymentOpen(true);
                                  }}
                                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[calc(13px+3pt)] font-semibold transition-all ${
                                    isGradient
                                      ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-md'
                                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
                                  }`}
                                >
                                  <CreditCard className="w-3.5 h-3.5" /> Pay {pkg.price}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={scrollToEnquiry}
                                className={`w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[calc(13px+3pt)] font-semibold transition-all ${
                                  isGradient
                                    ? 'border border-white/30 text-white/80 hover:bg-white/10'
                                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                              >
                                Get started <Check className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {hasCustomTabbedPricing &&
              customPricingTabs[Math.min(serviceTabIdx, customPricingTabs.length - 1)]?.footnote?.trim() && (
                <p className="text-center text-gray-500 text-sm mt-8">
                  {customPricingTabs[Math.min(serviceTabIdx, customPricingTabs.length - 1)].footnote!.trim()}
                </p>
              )}

            <p className="text-center text-gray-400 text-sm mt-10">
              {hasCustomTabbedPricing && servicePricingPage?.footnote?.trim()
                ? servicePricingPage.footnote.trim()
                : 'All prices are exclusive of GST. Government fees charged at actuals.'}
            </p>
          </div>
        </section>
      )}

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:mt-[60px]">
        <ServiceFAQ
          faqs={faqs}
          stateFAQs={stateFAQs}
          serviceName={service.name}
          selectedState={selectedState}
        />
      </section>

      {paymentPkg && (
        <PaymentModal
          open={paymentOpen}
          onClose={() => { setPaymentOpen(false); setPaymentPkg(null); }}
          serviceName={service.name}
          serviceId={service.id}
          packageName={paymentPkg.name}
          amount={paymentPkg.amount}
          displayPrice={paymentPkg.price}
        />
      )}
    </div>
  );
}
