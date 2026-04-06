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
  const handleGetStartedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <section className="hero-section-mobile relative bg-[#edf4ff] flex items-center overflow-hidden pt-16 sm:pt-16 min-h-0 sm:min-h-screen noise-overlay border-b-0 shadow-none">
      <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 to-sky-100/30 rounded-full blur-[140px] translate-x-1/4 animate-float-glow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100/40 to-blue-100/30 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 animate-float-glow-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-sky-100/20 via-transparent to-blue-100/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 dot-grid" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">

          {/* Left content */}
          <div className="mt-0 sm:mt-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-200/70 bg-amber-50/50 text-amber-700 text-xs font-semibold mb-8 relative z-10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {hero.badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-[24px] sm:text-4xl md:text-5xl lg:text-[calc(58px+3pt)] font-bold text-gray-900 tracking-tight leading-[1.3] sm:leading-[1.15] mb-3 sm:mb-6"
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
              className="text-[14px] sm:text-[calc(17px+3pt)] text-gray-500 leading-[1.5] sm:leading-relaxed max-w-xl mb-4 sm:mb-10"
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hero-buttons flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 mb-0 sm:mb-12"
            >
              <button
                type="button"
                onClick={handleGetStartedClick}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-7 h-[46px] sm:h-auto py-0 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-[13px] sm:text-[calc(14px+3pt)] font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-7 h-[46px] sm:h-auto py-0 sm:py-3 rounded-xl border border-gray-200 text-gray-700 text-[13px] sm:text-[calc(14px+3pt)] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-500" /> Talk to an expert
              </a>
            </motion.div>

            {/* Popular service chips (desktop/tablet only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden sm:flex flex-wrap items-center gap-2 max-w-full"
            >
              <span className="text-xs text-gray-400 font-medium mr-1">Popular:</span>
              {POPULAR.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="text-[11px] text-gray-600 hover:text-amber-700 active:text-amber-700 border border-gray-200 hover:border-amber-300 active:border-amber-300 focus-visible:border-amber-300 bg-white hover:bg-amber-50 active:bg-amber-50/70 rounded-full px-2.5 py-1.5 transition-all shadow-sm whitespace-normal max-w-[48%] text-center line-clamp-2 leading-tight"
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
            className="hidden sm:flex items-center justify-center bg-transparent -mt-6 p-2 sm:p-4 overflow-hidden"
          >
            <motion.img
              src="/assets/hero-illustration-v2.png"
              alt="Business services illustration"
              initial={{ y: 0 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                imageRendering: 'auto',
                filter: 'contrast(1.06) brightness(1.03)',
                WebkitFontSmoothing: 'antialiased',
              }}
              className="w-full max-w-[320px] sm:max-w-[550px] lg:max-w-[620px] max-h-[160px] sm:max-h-none h-auto object-contain bg-transparent border border-transparent rounded-2xl sm:rounded-3xl p-2 sm:p-3 mt-3 sm:mt-0"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
