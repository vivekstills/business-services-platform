import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function Pricing() {
  const { content } = useContent();
  const PLANS = content.pricing.plans;
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-white py-24 lg:py-32 overflow-hidden noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/15 rounded-full blur-[130px] animate-float-glow" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-sky-100/20 to-transparent rounded-full blur-[80px]" />
      </div>
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-8">

        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4"
          >
            Transparent pricing, no hidden fees
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-[15px]"
          >
            Choose the package that fits your business. All plans include government fees where applicable.
          </motion.p>
        </div>

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
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500/50 shadow-2xl shadow-blue-200/40 -translate-y-2 ring-2 ring-blue-100'
                  : 'bg-white border-gray-200/80 hover:shadow-xl hover:shadow-gray-200/50 hover:border-blue-100 hover:-translate-y-1'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-6">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-[11px] font-bold shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                </div>
                <p className={`text-[13px] ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.tagline}</p>
              </div>

              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-[13.5px] ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-white/20' : 'bg-emerald-50'}`}>
                        <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-emerald-600'}`} />
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
                    ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-center text-gray-400 text-sm mt-10"
        >
          {content.pricing.footnote}
        </motion.p>
      </div>
    </section>
  );
}
