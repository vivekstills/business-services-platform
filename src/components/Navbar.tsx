import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Briefcase, FileText, Calculator, Shield, Scale, Landmark } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services';
import { getServiceBySlug, getServiceDetailRoute } from '../data/servicesData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const categoryIcons: Record<string, React.ReactNode> = {
    'new-business': <Briefcase className="w-5 h-5" />,
    registration: <FileText className="w-5 h-5" />,
    'return-filing': <Calculator className="w-5 h-5" />,
    'trademark-ip': <Shield className="w-5 h-5" />,
    'legal-compliance': <Scale className="w-5 h-5" />,
    'mandatory-licenses': <Landmark className="w-5 h-5" />,
  };
  const allServiceGroups = useMemo(
    () =>
      SERVICE_CATEGORIES
        .map((category) => ({
          id: category.id,
          title: category.title,
          services: SERVICES.filter((service) => service.categoryId === category.id),
        }))
        .filter((group) => group.services.length > 0),
    []
  );
  const activeGroup =
    allServiceGroups.find((group) => group.id === activeCategoryId) ??
    allServiceGroups[0] ??
    null;

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
    if (allServiceGroups.length === 0) return;
    if (!activeCategoryId || !allServiceGroups.some((group) => group.id === activeCategoryId)) {
      setActiveCategoryId(allServiceGroups[0].id);
    }
  }, [allServiceGroups, activeCategoryId]);

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
                    className="absolute z-[120] left-1/2 -translate-x-1/2 top-full mt-4 w-[min(96vw,1080px)] bg-white rounded-2xl shadow-lg p-0 overflow-hidden"
                  >
                    <div className="flex min-h-[460px] max-h-[72vh]">
                      <div className="w-[280px] border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-gray-400">Service Categories</p>
                        </div>
                        <div className="py-2">
                          {allServiceGroups.map((group) => {
                            const isActive = activeGroup?.id === group.id;
                            return (
                              <button
                                key={group.id}
                                type="button"
                                onMouseEnter={() => setActiveCategoryId(group.id)}
                                onFocus={() => setActiveCategoryId(group.id)}
                                onClick={() => setActiveCategoryId(group.id)}
                                className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                                  isActive
                                    ? 'border-l-blue-600 bg-blue-50/70 text-gray-900'
                                    : 'border-l-transparent text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                                }`}
                                aria-current={isActive ? 'true' : undefined}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded-md inline-flex items-center justify-center ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                      {categoryIcons[group.id] ?? <FileText className="w-4 h-4" />}
                                    </span>
                                    <span className="text-[calc(12px+2pt)] font-medium leading-tight">{group.title}</span>
                                  </span>
                                  <span className="text-[10px] font-semibold text-gray-400">{group.services.length}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex-1 bg-white overflow-y-auto">
                        {activeGroup && (
                          <div className="px-6 py-5">
                            <div className="mb-4">
                              <p className="text-[calc(15px+2pt)] font-semibold text-gray-900">{activeGroup.title}</p>
                              <p className="text-[12px] text-gray-500 mt-1">
                                {activeGroup.services.length} services available
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                              {activeGroup.services.map((service) => {
                                const serviceSlug = service.id;
                                return (
                                  <Link
                                    key={serviceSlug}
                                    to={getServiceDetailRoute(activeGroup.id, serviceSlug)}
                                    onClick={() => {
                                      handleServiceItemClick(serviceSlug);
                                      setServicesOpen(false);
                                    }}
                                    className="px-2.5 py-2 rounded-md text-[calc(12px+2pt)] text-gray-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors"
                                  >
                                    {service.name}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
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
                    {allServiceGroups.map((group) => (
                      <div key={group.id} className="border-b border-gray-100 pb-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedCategory((prev) => (prev === group.id ? null : group.id))
                          }
                          className="w-full flex items-center justify-between px-1 py-2.5 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 inline-flex items-center justify-center">
                              {categoryIcons[group.id] ?? <FileText className="w-4 h-4" />}
                            </span>
                            <span className="text-[12px] uppercase tracking-wider text-gray-500 font-semibold">{group.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-400">
                              {group.services.length}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-500 transition-transform ${
                                mobileExpandedCategory === group.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileExpandedCategory === group.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden px-1 pb-2"
                            >
                              <div className="max-h-[40vh] overflow-y-auto space-y-1">
                                {group.services.map((service) => {
                                  const serviceSlug = service.id;
                                  return (
                                    <Link
                                      key={serviceSlug}
                                      to={getServiceDetailRoute(group.id, serviceSlug)}
                                      onClick={() => {
                                        handleServiceItemClick(serviceSlug);
                                        setIsMobileOpen(false);
                                      }}
                                      className="block py-1.5 px-2 rounded-md text-gray-700 text-sm hover:bg-blue-50/60"
                                    >
                                      {service.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
