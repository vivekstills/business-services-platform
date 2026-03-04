import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
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
];

export default function Pricing() {
  return (
    <section className="bg-[#07101F] py-24 lg:py-32 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            Transparent pricing, no hidden fees
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-[15px]"
          >
            Choose the package that fits your business. All plans include government fees where applicable.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-b from-indigo-600/15 to-blue-600/5 border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.12)]'
                  : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.05] hover:border-white/14'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[11px] font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                </div>
                <p className="text-[13px] text-white/40">{plan.tagline}</p>
              </div>

              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-white/65">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={plan.ctaTo}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13.5px] font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:-translate-y-px'
                    : 'border border-white/12 text-white/70 hover:bg-white/6 hover:text-white hover:border-white/20'
                }`}
              >
                {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/30 text-sm mt-8"
        >
          Each individual service also has its own tailored packages — browse any service for specific pricing.
        </motion.p>
      </div>
    </section>
  );
}
