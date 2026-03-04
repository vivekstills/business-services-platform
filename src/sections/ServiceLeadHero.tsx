import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import type { Service } from '../data/services';
import { SERVICE_CATEGORIES } from '../data/services';
import {
  AlertCircle, CheckCircle2, Mail, Phone, User, ChevronRight, Check
} from 'lucide-react';

type Props = { service: Service };

function stepsFor(service: Service): string[] {
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

export default function ServiceLeadHero({ service }: Props) {
  const steps = useMemo(() => stepsFor(service), [service]);
  const navigate = useNavigate();

  const category = SERVICE_CATEGORIES.find((c) => c.id === service.categoryId);

  const [formData, setFormData]     = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())  e.name  = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
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
        body: JSON.stringify({ ...formData, serviceId: service.id, serviceName: service.name }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? 'Submission failed. Please try again.');
      }
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (key: string) =>
    `w-full h-[44px] rounded-xl bg-[#040810] border px-3 pl-9 text-[13.5px] text-white placeholder-white/25 focus:outline-none transition-all ${
      errors[key]
        ? 'border-red-500/50 focus:border-red-500'
        : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
    }`;

  return (
    <div className="min-h-screen bg-[#060C18] pt-16">

      {/* Hero section */}
      <div className="relative bg-[#07101F] border-b border-white/6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-5%] w-[600px] h-[500px] bg-indigo-700/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-violet-700/8 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-8 flex-wrap">
            <Link to="/" className="hover:text-white/55 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            {category && (
              <>
                <Link to={`/category/${category.id}`} className="hover:text-white/55 transition-colors">
                  {category.title}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-white/55">{service.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — info */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
              >
                {service.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-white/55 text-[15px] leading-relaxed mb-8"
              >
                {service.shortDescription || 'Get complete expert support. We handle documentation, filing and follow-ups — so you can focus on your business.'}
              </motion.p>

              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <p className="text-[12px] font-bold uppercase tracking-widest text-white/30 mb-4">How it works</p>
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[11px] font-bold text-indigo-400 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-[13.5px] text-white/65 leading-snug">{step}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <div className="bg-white/[0.04] border border-white/12 rounded-2xl p-7 backdrop-blur-sm">
                <p className="text-[12px] font-bold uppercase tracking-widest text-white/35 mb-1">Apply for</p>
                <h2 className="text-xl font-bold text-white mb-6">{service.name}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Name</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${errors.name ? 'text-red-400' : 'text-white/25'}`} />
                      <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls('name')} placeholder="Your full name" />
                      {errors.name && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400" />}
                    </div>
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${errors.email ? 'text-red-400' : 'text-white/25'}`} />
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls('email')} placeholder="you@company.com" />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${errors.phone ? 'text-red-400' : 'text-white/25'}`} />
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputCls('phone')} placeholder="Your phone number" />
                    </div>
                    {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[46px] rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_28px_rgba(99,102,241,0.4)] hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Submitting…</>
                    ) : isSubmitted ? (
                      <><CheckCircle2 className="w-4 h-4" /> Submitted — we'll be in touch!</>
                    ) : 'Continue'}
                  </button>

                  {submitError && (
                    <div className="flex items-start gap-2 bg-red-950/40 border border-red-700/30 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] text-red-300">{submitError}</span>
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-700/30 rounded-xl p-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] text-emerald-300">
                        Confirmation sent to your email & phone. Our team will contact you shortly.
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-white/25 leading-relaxed">
                    By continuing you agree to be contacted by our team regarding{' '}
                    <span className="text-white/45">{service.name}</span>.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">About {service.name}</h2>
            <div className="text-[14.5px] text-white/55 leading-relaxed whitespace-pre-line">
              {service.content}
            </div>
          </div>

          {/* Packages sidebar */}
          {service.packages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Packages</h2>
              {service.packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="bg-white/[0.03] border border-white/8 rounded-xl p-5"
                >
                  <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{pkg.name}</div>
                  <div className="text-2xl font-bold text-white mb-2">{pkg.price}</div>
                  <p className="text-[13px] text-white/45 leading-relaxed">{pkg.description}</p>
                  <button
                    onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="mt-4 w-full h-9 rounded-lg border border-white/10 text-white/60 text-[12px] font-semibold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-1"
                  >
                    Get started <Check className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
