import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Users, Phone } from 'lucide-react';
import { CONTACT_PHONE } from '../data/constants';
import { Link } from 'react-router-dom';

const POPULAR = [
  { label: 'GST Registration',    to: '/service/gst-registration' },
  { label: 'Private Limited Co.', to: '/service/private-limited-company' },
  { label: 'Trademark',           to: '/service/trademark-registration' },
  { label: 'ITR Filing',          to: '/service/itr-1-filing' },
  { label: 'Import Export Code',  to: '/service/import-export-code' },
];

const STATS = [
  { icon: <Users className="w-4 h-4" />,      value: '50,000+',  label: 'Businesses served' },
  { icon: <Star className="w-4 h-4" />,        value: '4.9 / 5',  label: 'Average rating' },
  { icon: <ShieldCheck className="w-4 h-4" />, value: '100%',     label: 'Govt. approved process' },
];

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30 flex items-center overflow-hidden pt-16 min-h-screen">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-100/50 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
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
              India's trusted business compliance platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-gray-900 tracking-tight leading-[1.1] mb-6"
            >
              Launch & grow your business{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 bg-clip-text text-transparent">
                with complete legal compliance
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[17px] text-gray-500 leading-relaxed max-w-xl mb-10"
            >
              GST Registration, Company Formation, Trademark, Tax Filing and 120+ more services — handled end‑to‑end by our expert team.
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
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[14px] font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 text-[14px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
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
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/assets/logo.png" alt="Mridhuv Associates" className="h-10 w-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Expert Advisory</h3>
                <p className="text-gray-500 text-[14px] mb-6">Your business, our expertise — from registration to compliance.</p>
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'GST Registration', time: '3–5 days', color: 'bg-green-50 text-green-700 border-green-200' },
                    { label: 'Company Incorporation', time: '7–10 days', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { label: 'Trademark Registration', time: '2–3 weeks', color: 'bg-sky-50 text-sky-700 border-sky-200' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[13.5px] font-semibold text-gray-700">{item.label}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.color}`}>{item.time}</span>
                    </div>
                  ))}
                </div>
                {/* Rating */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[13px] font-semibold text-gray-700 ml-1">4.9</span>
                  <span className="text-[12px] text-gray-400">· 12,000+ reviews</span>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl px-4 py-2.5 shadow-lg shadow-blue-200">
                <div className="text-[22px] font-black leading-none">50K+</div>
                <div className="text-[10px] font-semibold opacity-80">Businesses</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px border border-gray-200 rounded-2xl overflow-hidden max-w-2xl bg-gray-200 shadow-sm"
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
