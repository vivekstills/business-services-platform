import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICES } from '../data/services';

type ServiceItem = { label: string; to: string; slug?: string; isService: boolean };
type ServiceGroup = { label: string; items: ServiceItem[] };
const SERVICE_LOOKUP = new Map(SERVICES.map((s) => [s.id, s]));

const NAV_GROUP_CONFIG: Array<{
  label: string;
  serviceIds: string[];
  extraLinks?: Array<{ label: string; to: string }>;
}> = [
  {
    label: 'Registration',
    serviceIds: ['gst-registration', 'fssai-registration', 'trade-license', 'digital-signature'],
  },
  {
    label: 'Start Business',
    serviceIds: ['proprietorship', 'partnership', 'llp', 'private-limited-company', 'one-person-company'],
  },
  {
    label: 'Tax & Filing',
    serviceIds: ['itr-1-filing', 'tds-return-filing', 'gst-return-filing'],
  },
  {
    label: 'Trademark & IP',
    serviceIds: ['trademark-registration'],
    extraLinks: [{ label: 'Trademark Search', to: '/trademark-search' }],
  },
  {
    label: 'Compliance',
    serviceIds: ['annual-compliance-private-limited', 'roc-filing'],
  },
  {
    label: 'Licenses & More',
    serviceIds: ['import-export-code', 'pf-registration', 'esi-registration'],
  },
];

const SERVICE_GROUPS: ServiceGroup[] = NAV_GROUP_CONFIG.map((group) => {
  const serviceItems: ServiceItem[] = group.serviceIds
    .filter((id) => SERVICE_LOOKUP.has(id))
    .map((id) => {
      const service = SERVICE_LOOKUP.get(id)!;
      return { label: service.name, to: `/service/${service.id}`, slug: service.id, isService: true };
    });
  const extraItems: ServiceItem[] = (group.extraLinks ?? []).map((x) => ({
    label: x.label,
    to: x.to,
    isService: false,
  }));
  return { label: group.label, items: [...serviceItems, ...extraItems] };
}).filter((g) => g.items.length > 0);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleServiceItemClick = (item: ServiceItem) => {
    if (item.isService) {
      console.log('[Navbar] clicked service slug:', item.slug);
      if (!item.slug || !SERVICE_LOOKUP.has(item.slug)) {
        navigate('/category/new-business');
      }
    }
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
            ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-white/90 backdrop-blur-lg border-b border-gray-100/50'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-2 lg:gap-3">
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
                      {SERVICE_GROUPS.map((group) => (
                        <div key={group.label}>
                          <p className="text-[calc(11px+2pt)] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                            {group.label}
                          </p>
                          <div className="space-y-2">
                            {group.items.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => {
                                  handleServiceItemClick(item);
                                  setServicesOpen(false);
                                }}
                                className="block px-2 py-1.5 rounded-md text-[calc(13px+2pt)] font-normal text-gray-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
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
              to="/category/new-business"
              className="inline-flex items-center justify-center h-9 px-3.5 xl:px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 text-white text-[calc(12px+1pt)] xl:text-[calc(13px+1pt)] font-semibold hover:shadow-md hover:shadow-blue-200/50 transition-all shrink-0 leading-none"
            >
              Get Started
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
            className="fixed inset-0 top-16 bg-black/40 z-[90] lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-16 right-0 bottom-0 w-[min(300px,85vw)] bg-white border-l border-gray-200 z-[91] overflow-y-auto lg:hidden shadow-2xl overscroll-contain"
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
                    {SERVICE_GROUPS.map((group) => (
                      <div key={group.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">{group.label}</p>
                        {group.items.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => {
                              handleServiceItemClick(item);
                              setIsMobileOpen(false);
                            }}
                            className="block py-1.5 px-1 text-gray-700 text-sm"
                          >
                            {item.label}
                          </Link>
                        ))}
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
                  to="/category/new-business"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-[calc(14px+3pt)] font-semibold text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-h-[48px]"
                >
                  Get Started
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
