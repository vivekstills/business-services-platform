import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Users } from 'lucide-react';
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
    <section className="relative min-h-screen bg-[#060C18] flex items-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%]  w-[500px] h-[500px] bg-violet-700/10  rounded-full blur-[100px]" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="max-w-4xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            India's trusted business compliance platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.08] mb-6"
          >
            Launch & grow your business{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              with complete legal compliance
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/55 leading-relaxed max-w-2xl mb-10"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[14px] font-semibold hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] hover:-translate-y-px transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/category/registration"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/80 text-[14px] font-semibold hover:bg-white/6 hover:border-white/25 transition-all"
            >
              View all services
            </Link>
          </motion.div>

          {/* Popular services chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-white/35 font-medium mr-1">Popular:</span>
            {POPULAR.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="text-xs text-white/55 hover:text-white border border-white/10 hover:border-white/25 bg-white/4 hover:bg-white/8 rounded-full px-3.5 py-1.5 transition-all"
              >
                {p.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px border border-white/8 rounded-2xl overflow-hidden max-w-2xl bg-white/8"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 bg-[#060C18] px-6 py-5"
            >
              <div className="text-indigo-400">{s.icon}</div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">{s.value}</div>
                <div className="text-white/40 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
