import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;
  const contact = content.contact;
  const POPULAR = hero.popular;
  return (
    <section className="relative bg-transparent flex items-center overflow-hidden pt-16 min-h-screen noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 to-sky-100/30 rounded-full blur-[140px] translate-x-1/4 animate-float-glow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100/40 to-blue-100/30 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 animate-float-glow-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-sky-100/20 via-transparent to-blue-100/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">

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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[calc(58px+3pt)] font-bold text-gray-900 tracking-tight leading-[1.1] mb-5 sm:mb-6"
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
              className="text-[calc(15px+3pt)] sm:text-[calc(17px+3pt)] text-gray-500 leading-relaxed max-w-xl mb-8 sm:mb-10"
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-10 sm:mb-12"
            >
              <Link
                to="/category/new-business"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[calc(14px+3pt)] font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all min-h-[48px]"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 text-[calc(14px+3pt)] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all min-h-[48px]"
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

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center lg:-mt-8"
          >
            <motion.img
              src="/assets/hero-illustration-transparent.png"
              alt="Business services illustration"
              initial={{ y: 0 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full max-w-[520px] lg:max-w-[620px] h-auto object-contain bg-transparent"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
