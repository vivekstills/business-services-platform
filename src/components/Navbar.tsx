import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICES_NAV_CATEGORIES, getServiceBySlug, getServiceDetailRoute } from '../data/servicesData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleServiceItemClick = (serviceSlug: string) => {
    console.log('[Navbar] clicked service slug:', serviceSlug);
    if (!getServiceBySlug(serviceSlug)) navigate('/services');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setServicesOpen(false); setIsMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (location.hash === '#pricing-section') {
      setTimeout(() => {
        const section = document.getElementById('pricing-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }, [location.hash, location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-2xl border-b-0 lg:border-b lg:border-gray-200/50 shadow-[0_1px_6px_rgba(0,0,0,0.05)]'
            : 'bg-white/90 backdrop-blur-lg border-b-0 lg:border-b lg:border-gray-100/50 shadow-[0_1px_6px_rgba(0,0,0,0.05)] lg:shadow-none'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center gap-2 lg:gap-3">
          <Link to="/" className="flex items-center shrink-0 z-10">
            <img
              src="/assets/logo.png"
              alt="Mridhuv Associates"
              className="h-12 lg:h-14 w-auto max-h-14 object-contain"
            />
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-1">
            <div className="relative flex items-center gap-6 xl:gap-8 text-base font-medium">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <button
                type="button"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
                onMouseEnter={() => setServicesOpen(true)}
                className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <a
                href="/#pricing-section"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname !== '/') {
                    navigate('/#pricing-section');
                    return;
                  }
                  const section = document.getElementById('pricing-section');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <Link to="/about-us" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link to="/contact-us" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="absolute z-[120] left-1/2 -translate-x-1/2 top-full mt-4 w-[min(96vw,980px)] bg-white rounded-2xl shadow-lg p-6 xl:p-7"
                  >
                    <div className="grid grid-cols-3 gap-x-10 xl:gap-x-12 gap-y-7">
                      {SERVICES_NAV_CATEGORIES.map((group) => (
                        <div key={group.slug}>
                          <p className="text-[calc(11px+2pt)] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                            {group.title}
                          </p>
                          <div className="space-y-2">
                            {group.featuredServiceIds.slice(0, 5).map((serviceSlug) => {
                              const service = getServiceBySlug(serviceSlug);
                              if (!service) return null;
                              return (
                              <Link
                                key={serviceSlug}
                                to={getServiceDetailRoute(group.slug, serviceSlug)}
                                onClick={() => {
                                  handleServiceItemClick(serviceSlug);
                                  setServicesOpen(false);
                                }}
                                className="block px-2 py-1.5 rounded-md text-[calc(13px+2pt)] font-normal text-gray-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors"
                              >
                                {service.name}
                              </Link>
                            );})}
                            <Link
                              to={`/services/${group.slug}`}
                              onClick={() => setServicesOpen(false)}
                              className="block px-2 pt-2 text-[calc(12px+2pt)] font-semibold text-blue-700 hover:text-blue-800"
                            >
                              View All →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              to="/payment"
              className="inline-flex items-center justify-center h-9 px-3.5 xl:px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 text-white text-[calc(12px+1pt)] xl:text-[calc(13px+1pt)] font-semibold hover:shadow-md hover:shadow-blue-200/50 transition-all shrink-0 leading-none"
            >
              ₹ Pay Now
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 sm:top-16 bg-black/40 z-[90] lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-14 sm:top-16 right-0 bottom-0 w-[85vw] max-w-full bg-white z-[91] overflow-y-auto lg:hidden shadow-2xl overscroll-contain"
          >
            <div className="py-4">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className="block px-5 py-3 text-gray-700">Home</Link>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="flex items-center justify-between w-full px-5 py-3 text-left text-gray-800"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {mobileServicesOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3 space-y-2">
                    {SERVICES_NAV_CATEGORIES.map((group) => (
                      <div key={group.slug} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">{group.title}</p>
                        {group.featuredServiceIds.slice(0, 5).map((serviceSlug) => {
                          const service = getServiceBySlug(serviceSlug);
                          if (!service) return null;
                          return (
                          <Link
                            key={serviceSlug}
                            to={getServiceDetailRoute(group.slug, serviceSlug)}
                            onClick={() => {
                              handleServiceItemClick(serviceSlug);
                              setIsMobileOpen(false);
                            }}
                            className="block py-1.5 px-1 text-gray-700 text-sm"
                          >
                            {service.name}
                          </Link>
                        );})}
                        <Link
                          to={`/services/${group.slug}`}
                          onClick={() => setIsMobileOpen(false)}
                          className="block pt-2 text-xs font-semibold text-blue-700"
                        >
                          View All →
                        </Link>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <a
                href="/#pricing-section"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileOpen(false);
                  if (location.pathname !== '/') {
                    navigate('/#pricing-section');
                    return;
                  }
                  const section = document.getElementById('pricing-section');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block px-5 py-3 text-gray-700"
              >
                Pricing
              </a>
              <Link to="/about-us" onClick={() => setIsMobileOpen(false)} className="block px-5 py-3 text-gray-700">About</Link>
              <Link to="/contact-us" onClick={() => setIsMobileOpen(false)} className="block px-5 py-3 text-gray-700">Contact</Link>

              <div className="px-5 pt-5 pb-8 space-y-3">
                <Link
                  to="/payment"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-[calc(14px+3pt)] font-semibold text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-h-[48px]"
                >
                  ₹ Pay Now
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
}
