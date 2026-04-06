import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { getPricingTabGroups } from '../utils/pricingTabs';
import type { PricingPlan } from '../types/content';

function desktopGridColsClass(n: number): string {
  if (n <= 1) return 'sm:grid-cols-1';
  if (n === 2) return 'sm:grid-cols-2 md:grid-cols-2';
  return 'sm:grid-cols-2 md:grid-cols-3';
}

function PlanGrid({ plans }: { plans: PricingPlan[] }) {
  return (
    <div className={`flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 snap-x snap-mandatory sm:grid sm:overflow-visible sm:pb-0 sm:items-stretch ${desktopGridColsClass(plans.length)} sm:gap-5`}>
      {plans.map((plan, i) => (
        <motion.div
          key={`${plan.name}-${i}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className={`relative snap-start shrink-0 min-w-[220px] max-w-[240px] sm:min-w-0 sm:max-w-none basis-[78%] [@media(max-width:379px)]:basis-[88%] sm:basis-auto sm:shrink flex min-h-[180px] sm:min-h-0 sm:h-full flex-col rounded-[16px] sm:rounded-2xl border p-4 sm:p-8 overflow-hidden transition-all ${plan.highlight ? 'sm:pt-7' : ''} ${
            plan.highlight
              ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500/50 shadow-lg sm:shadow-2xl sm:shadow-blue-200/40 ring-2 ring-blue-100 lg:scale-[1.03] lg:z-[2]'
              : 'card-hover-warm bg-white border-gray-200/80 hover:shadow-md sm:hover:shadow-xl sm:hover:shadow-gray-200/50'
          }`}
        >
          <div className="mb-3 sm:mb-6">
            <h3 className={`text-[13px] sm:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3 break-words ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className={`text-[20px] sm:text-4xl font-semibold tracking-tight break-words ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                {plan.price}
              </span>
            </div>
            <p className={`text-[13px] sm:text-[calc(13px+3pt)] leading-[1.4] line-clamp-2 break-words max-w-full ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.tagline}</p>
          </div>

          <div className="flex-1 mb-2 sm:mb-5">
            <ul className="hidden sm:block sm:space-y-3">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f} className={`flex items-start gap-2 text-xs sm:text-[calc(13.5px+3pt)] ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                  <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-white/20' : 'bg-emerald-50'}`}>
                    <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-emerald-600'}`} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to={plan.ctaTo || '/contact-us'}
            className={`w-full h-11 sm:h-12 mt-3 sm:mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm sm:text-[calc(13.5px+3pt)] font-semibold transition-all ${
              plan.highlight
                ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default function Pricing() {
  const { content } = useContent();
  const p = content.pricing;
  const tabs = useMemo(() => getPricingTabGroups(p), [p]);
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    setActiveIdx((i) => Math.min(i, Math.max(0, tabs.length - 1)));
  }, [tabs.length]);
  const safeIdx = Math.min(activeIdx, Math.max(0, tabs.length - 1));
  const active = tabs[safeIdx] ?? tabs[0];

  const sectionLabel = p.sectionLabel?.trim() || 'Pricing';
  const sectionTitle = p.sectionTitle?.trim() || 'Transparent pricing, no hidden fees';
  const sectionSubtitle =
    p.sectionSubtitle?.trim() ||
    'Choose the package that fits your business. All plans include government fees where applicable.';

  return (
    <section id="pricing-section" className="relative bg-transparent py-5 sm:py-12 overflow-hidden noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/15 rounded-full blur-[130px] animate-float-glow" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-sky-100/20 to-transparent rounded-full blur-[80px]" />
      </div>
      <div className="relative z-[2] max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-5 sm:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4"
          >
            {sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3 sm:mb-4"
          >
            {sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-xs sm:text-[calc(15px+3pt)]"
          >
            {sectionSubtitle}
          </motion.p>
        </div>

        {tabs.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Pricing plans">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={safeIdx === i}
                onClick={() => setActiveIdx(i)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  safeIdx === i
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200/40'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {active?.description?.trim() && (
          <p className="text-gray-600 text-[calc(14px+3pt)] mb-8 max-w-3xl">{active.description.trim()}</p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id ?? 'tab'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {active?.plans?.length ? (
              <PlanGrid plans={active.plans} />
            ) : (
              <p className="text-gray-400 text-center py-12">No plans in this tab yet.</p>
            )}
          </motion.div>
        </AnimatePresence>

        {active?.footnote?.trim() && (
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            {active.footnote.trim()}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-center text-gray-400 text-sm mt-10"
        >
          {p.footnote}
        </motion.p>
      </div>
    </section>
  );
}
