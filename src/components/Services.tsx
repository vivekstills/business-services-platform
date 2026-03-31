import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, FileText, Calculator, Shield, Scale, Landmark } from 'lucide-react';
import { useContent, getServicesByCategory } from '../context/ContentContext';

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; bg: string; iconColor: string; border: string }> = {
  'new-business': { icon: <Briefcase className="w-5 h-5" />, bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
  'registration': { icon: <FileText className="w-5 h-5" />, bg: 'bg-sky-50', iconColor: 'text-sky-600', border: 'border-sky-100' },
  'gst-services': { icon: <Calculator className="w-5 h-5" />, bg: 'bg-sky-50', iconColor: 'text-sky-600', border: 'border-sky-100' },
  'trademark-ip': { icon: <Shield className="w-5 h-5" />, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
  'legal-compliance': { icon: <Scale className="w-5 h-5" />, bg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
  'mandatory-licenses': { icon: <Landmark className="w-5 h-5" />, bg: 'bg-rose-50', iconColor: 'text-rose-600', border: 'border-rose-100' },
};

export default function Services() {
  const { content } = useContent();
  const ss = content.servicesSection;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categories = content.categories
    .filter((c) => ['new-business', 'registration', 'gst-services', 'trademark-ip', 'legal-compliance', 'mandatory-licenses'].includes(c.id))
    .map((c) => {
      const cfg = CATEGORY_CONFIG[c.id] ?? CATEGORY_CONFIG['registration'];
      const count = getServicesByCategory(content.services, c.id).length;
      return { ...c, label: c.title, ...cfg, count };
    });
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );
  const selectedServices = selectedCategoryId
    ? getServicesByCategory(content.services, selectedCategoryId)
    : [];

  return (
    <section className="relative bg-transparent py-10 sm:py-12 overflow-hidden noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 to-sky-100/20 rounded-full blur-[120px] animate-float-glow-slow" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-tl from-indigo-100/25 to-transparent rounded-full blur-[100px] animate-float-glow" />
        <div className="absolute inset-0 crosshatch" />
      </div>
      <div className="relative z-[2] max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4"
          >
            {ss.label}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4"
          >
            {ss.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-[calc(15px+3pt)] leading-relaxed"
          >
            {ss.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="h-full"
            >
              <Link
                to={`/category/${cat.id}`}
                className="card-hover-warm group flex h-full w-full text-left flex-col justify-between p-6 rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-11 h-11 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center mb-5 ${cat.iconColor}`}>
                      {cat.icon}
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[calc(15px+3pt)] font-bold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug">
                        {cat.label}
                      </h3>
                      <span className="text-[calc(11px+3pt)] text-gray-400 font-medium ml-3 flex-shrink-0 mt-0.5">
                        {cat.count} services
                      </span>
                    </div>
                    <p className="min-h-[60px] text-[calc(13px+3pt)] text-gray-500 leading-relaxed">{cat.description}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-[calc(12px+3pt)] font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                    Explore services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="mt-10 rounded-2xl border border-gray-200/70 bg-white/90 p-5 sm:p-7 shadow-lg shadow-gray-200/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.18em] mb-2">Sub-services</p>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to categories
                </button>
              </div>

              {selectedServices.length === 0 ? (
                <p className="text-gray-500 text-sm">No services available in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                  {selectedServices.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        to={`/service/${service.id}`}
                        className="card-hover-warm group flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div>
                          <p className="text-[calc(11px+3pt)] text-gray-400 uppercase tracking-wide font-semibold mb-1">{service.mainHead}</p>
                          <h4 className="text-[calc(13.5px+3pt)] font-semibold text-gray-800 group-hover:text-blue-700 leading-snug">
                            {service.name}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
