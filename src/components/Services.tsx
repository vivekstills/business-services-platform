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
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    border: 'border-indigo-100',
    count: 12,
  },
  {
    id: 'registration',
    label: 'Registrations',
    description: 'GST, FSSAI, Trade License, IEC, Digital Signature, Health License and more.',
    icon: <FileText className="w-5 h-5" />,
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    border: 'border-violet-100',
    count: 10,
  },
  {
    id: 'gst-services',
    label: 'GST Services',
    description: 'Registration, return filing, advisory, refunds, LUT, ITC reconciliation.',
    icon: <Calculator className="w-5 h-5" />,
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    border: 'border-sky-100',
    count: 11,
  },
  {
    id: 'trademark-ip',
    label: 'Trademark & IP',
    description: 'Trademark registration, objection, renewal, copyright, patents, design.',
    icon: <Shield className="w-5 h-5" />,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    count: 13,
  },
  {
    id: 'legal-compliance',
    label: 'Compliance',
    description: 'Annual filings, director changes, conversions, capital increase and more.',
    icon: <Scale className="w-5 h-5" />,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    count: 22,
  },
  {
    id: 'mandatory-licenses',
    label: 'Licenses & More',
    description: 'Factory, contract labour, PCB, liquor licenses, web design and SEO.',
    icon: <Landmark className="w-5 h-5" />,
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    border: 'border-rose-100',
    count: 18,
  },
];

export default function Services() {
  return (
    <section className="bg-gray-50 py-24 lg:py-32 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4"
          >
            Everything you need to start & run your business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-[15px] leading-relaxed"
          >
            120+ services across registrations, tax, IP, compliance and more — handled end‑to‑end by experts.
          </motion.p>
        </div>

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
                className="group flex flex-col h-full p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-100 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center mb-5 ${cat.iconColor}`}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[15px] font-bold text-gray-800 group-hover:text-indigo-700 transition-colors leading-snug">
                      {cat.label}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-medium ml-3 flex-shrink-0 mt-0.5">
                      {cat.count} services
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{cat.description}</p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 group-hover:text-indigo-600 transition-colors">
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
