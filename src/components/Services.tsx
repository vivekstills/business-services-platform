import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, Calculator, Shield, Scale, Landmark } from 'lucide-react';
import { useContent, getServicesByCategory } from '../context/ContentContext';

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; bg: string; iconColor: string; border: string }> = {
  'new-business': { icon: <Briefcase className="w-5 h-5" />, bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
  'registration': { icon: <FileText className="w-5 h-5" />, bg: 'bg-sky-50', iconColor: 'text-sky-600', border: 'border-sky-100' },
  'return-filing': { icon: <Calculator className="w-5 h-5" />, bg: 'bg-sky-50', iconColor: 'text-sky-600', border: 'border-sky-100' },
  'trademark-ip': { icon: <Shield className="w-5 h-5" />, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
  'legal-compliance': { icon: <Scale className="w-5 h-5" />, bg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
  'mandatory-licenses': { icon: <Landmark className="w-5 h-5" />, bg: 'bg-rose-50', iconColor: 'text-rose-600', border: 'border-rose-100' },
};

export default function Services() {
  const { content } = useContent();
  const ss = content.servicesSection;
  const categories = content.categories
    .map((c) => {
      const cfg = CATEGORY_CONFIG[c.id] ?? CATEGORY_CONFIG['registration'];
      const count = getServicesByCategory(content.services, c.id).length;
      return { ...c, label: c.title, ...cfg, count };
    });

  return (
    <section className="relative bg-transparent py-5 sm:py-12 overflow-hidden noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 to-sky-100/20 rounded-full blur-[120px] animate-float-glow-slow" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-tl from-indigo-100/25 to-transparent rounded-full blur-[100px] animate-float-glow" />
        <div className="absolute inset-0 crosshatch" />
      </div>
      <div className="relative z-[2] max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 max-w-full">

        <div className="max-w-2xl mb-6 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4"
          >
            {ss.label}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3 sm:mb-4"
          >
            {ss.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-xs sm:text-[calc(15px+3pt)] leading-relaxed"
          >
            {ss.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-3 [@media(max-width:379px)]:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-6 items-stretch w-full max-w-full">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="h-full min-w-0"
            >
              <Link
                to={`/category/${cat.id}`}
                className="card-hover-warm group flex h-full w-full min-w-0 max-w-full text-center flex-col justify-between p-2.5 sm:p-6 rounded-[10px] sm:rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center mb-1.5 sm:mb-5 mx-auto ${cat.iconColor}`}>
                      {cat.icon}
                    </div>
                    <div className="mb-1.5 sm:mb-2">
                      <h3 className="text-[12px] sm:text-[calc(15px+3pt)] font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2 break-words">
                        {cat.label}
                      </h3>
                      <span className="hidden sm:inline text-[11px] sm:text-[calc(11px+3pt)] text-gray-400 font-medium ml-2 sm:ml-3 flex-shrink-0 mt-0.5">
                        {cat.count} services
                      </span>
                    </div>
                    <p className="hidden sm:block min-h-[20px] sm:min-h-[60px] text-[12px] sm:text-[calc(13px+3pt)] text-gray-500 leading-[1.3] line-clamp-2 sm:line-clamp-2 break-words">{cat.description}</p>
                  </div>
                  <div className="mt-1 sm:mt-5 flex items-center justify-center gap-1 text-[11px] sm:text-[calc(12px+3pt)] font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                    Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
