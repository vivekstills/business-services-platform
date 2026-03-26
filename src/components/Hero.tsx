import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Users, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';

const STAT_ICONS = [
  <Users className="w-4 h-4" key="users" />,
  <Star className="w-4 h-4" key="star" />,
  <ShieldCheck className="w-4 h-4" key="shield" />,
];

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;
  const contact = content.contact;
  const POPULAR = hero.popular;
  const STATS = hero.stats.map((s, i) => ({ ...s, icon: STAT_ICONS[i] ?? STAT_ICONS[0] }));
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex items-center overflow-hidden pt-16 min-h-screen noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 to-sky-100/30 rounded-full blur-[140px] translate-x-1/4 animate-float-glow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100/40 to-blue-100/30 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 animate-float-glow-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-sky-100/20 via-transparent to-blue-100/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {hero.badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-[calc(58px+2pt)] font-bold text-gray-900 tracking-tight leading-[1.1] mb-6"
            >
              {hero.headline.includes(' with ') ? (
                <>
                  {hero.headline.split(' with ')[0]}{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 bg-clip-text text-transparent">
                    with {hero.headline.split(' with ')[1]}
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 bg-clip-text text-transparent">
                  {hero.headline}
                </span>
              )}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[calc(17px+2pt)] text-gray-500 leading-relaxed max-w-xl mb-10"
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <Link
                to="/category/new-business"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[calc(14px+2pt)] font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 text-[calc(14px+2pt)] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-500" /> Talk to an expert
              </a>
            </motion.div>

            {/* Popular service chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-gray-400 font-medium mr-1">Popular:</span>
              {POPULAR.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="text-xs text-gray-600 hover:text-blue-700 border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 rounded-full px-3.5 py-1.5 transition-all shadow-sm"
                >
                  {p.label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right — Trust card panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-100/30 border border-white/60 ring-1 ring-gray-100/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/assets/logo.png" alt="Mridhuv Associates" className="h-12 sm:h-14 w-auto object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{hero.trustCard.title}</h3>
                <p className="text-gray-500 text-[calc(14px+2pt)] mb-6">{hero.trustCard.subtitle}</p>
                <div className="space-y-3 mb-6">
                  {hero.trustCard.items.map((item, idx) => {
                    const colors = ['bg-green-50 text-green-700 border-green-200', 'bg-blue-50 text-blue-700 border-blue-200', 'bg-sky-50 text-sky-700 border-sky-200'];
                    return (
                    <div key={idx} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[calc(13.5px+2pt)] font-semibold text-gray-700">{item.label}</span>
                      <span className={`text-[calc(11px+2pt)] font-bold px-2.5 py-1 rounded-full border ${colors[idx] ?? colors[0]}`}>{item.time}</span>
                    </div>
                  );
                  })}
                </div>
                {/* Rating */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[calc(13px+2pt)] font-semibold text-gray-700 ml-1">{hero.trustCard.rating}</span>
                  <span className="text-[calc(12px+2pt)] text-gray-400">· {hero.trustCard.reviews}</span>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl px-4 py-2.5 shadow-lg shadow-blue-200">
                <div className="text-[calc(22px+2pt)] font-black leading-none">{hero.trustCard.badgeValue}</div>
                <div className="text-[calc(10px+2pt)] font-semibold opacity-80">{hero.trustCard.badgeLabel}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px border border-gray-200/60 rounded-2xl overflow-hidden max-w-2xl bg-gray-200/50 shadow-sm backdrop-blur-sm"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white px-6 py-5">
              <div className="text-blue-600">{s.icon}</div>
              <div>
                <div className="text-gray-900 font-bold text-lg leading-tight">{s.value}</div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
