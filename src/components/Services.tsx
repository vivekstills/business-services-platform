import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, Calculator, Shield, Scale, Landmark } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'new-business',
    label: 'Form New Business',
    description: 'Proprietorship, Partnership, LLP, Private/Public Ltd, OPC, Nidhi and more.',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'from-indigo-500/20 to-blue-500/10',
    iconColor: 'text-indigo-400',
    count: 12,
  },
  {
    id: 'registration',
    label: 'Registrations',
    description: 'GST, FSSAI, Trade License, IEC, Digital Signature, Health License and more.',
    icon: <FileText className="w-5 h-5" />,
    color: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
    count: 10,
  },
  {
    id: 'gst-services',
    label: 'GST Services',
    description: 'Registration, return filing, advisory, refunds, LUT, ITC reconciliation.',
    icon: <Calculator className="w-5 h-5" />,
    color: 'from-sky-500/20 to-cyan-500/10',
    iconColor: 'text-sky-400',
    count: 11,
  },
  {
    id: 'trademark-ip',
    label: 'Trademark & IP',
    description: 'Trademark registration, objection, renewal, copyright, patents, design.',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    count: 13,
  },
  {
    id: 'legal-compliance',
    label: 'Compliance',
    description: 'Annual filings, director changes, conversions, capital increase and more.',
    icon: <Scale className="w-5 h-5" />,
    color: 'from-amber-500/20 to-yellow-500/10',
    iconColor: 'text-amber-400',
    count: 22,
  },
  {
    id: 'mandatory-licenses',
    label: 'Licenses & More',
    description: 'Factory, contract labour, PCB, liquor licenses, web design and SEO.',
    icon: <Landmark className="w-5 h-5" />,
    color: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-400',
    count: 18,
  },
];

export default function Services() {
  return (
    <section className="bg-[#060C18] py-24 lg:py-32 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            Everything you need to start & run your business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-[15px] leading-relaxed"
          >
            120+ services across registrations, tax, IP, compliance and more — handled end‑to‑end by experts.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/category/${cat.id}`}
                className="group flex flex-col h-full p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/16 transition-all duration-200"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5 ${cat.iconColor}`}>
                  {cat.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[15px] font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {cat.label}
                    </h3>
                    <span className="text-[11px] text-white/30 font-medium ml-3 flex-shrink-0 mt-0.5">
                      {cat.count} services
                    </span>
                  </div>
                  <p className="text-[13px] text-white/45 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Footer link */}
                <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-white/30 group-hover:text-indigo-400 transition-colors">
                  View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
