import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, ChevronDown, ArrowRight,
  Briefcase, FileText, Calculator, Shield, Scale, Globe, Landmark, Wine, Building2, Monitor
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES, getServiceById, getServicesByCategory, type ServiceCategory } from '../data/services';

type NavGroup = {
  label: string;
  icon: React.ReactNode;
  categoryIds: string[];
};

const NAV_GROUPS: NavGroup[] = [
  { label: 'Form New Business', icon: <Briefcase className="w-4 h-4" />, categoryIds: ['new-business', 'international-incorporations'] },
  { label: 'Registrations',     icon: <FileText className="w-4 h-4" />,  categoryIds: ['registration', 'hr-compliance', 'ngo-registrations'] },
  { label: 'GST & Taxes',       icon: <Calculator className="w-4 h-4" />,categoryIds: ['gst-services', 'income-tax', 'return-filing'] },
  { label: 'Trademark & IP',    icon: <Shield className="w-4 h-4" />,    categoryIds: ['trademark-ip'] },
  { label: 'Compliance',        icon: <Scale className="w-4 h-4" />,     categoryIds: ['legal-compliance'] },
  { label: 'Licenses & More',   icon: <Landmark className="w-4 h-4" />, categoryIds: ['liquor-licenses', 'mandatory-licenses', 'web-digital'] },
];

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  'new-business':               <Briefcase className="w-4 h-4" />,
  'international-incorporations': <Globe className="w-4 h-4" />,
  'registration':               <FileText className="w-4 h-4" />,
  'hr-compliance':              <Building2 className="w-4 h-4" />,
  'ngo-registrations':          <Landmark className="w-4 h-4" />,
  'gst-services':               <Calculator className="w-4 h-4" />,
  'income-tax':                 <Calculator className="w-4 h-4" />,
  'return-filing':              <FileText className="w-4 h-4" />,
  'trademark-ip':               <Shield className="w-4 h-4" />,
  'legal-compliance':           <Scale className="w-4 h-4" />,
  'liquor-licenses':            <Wine className="w-4 h-4" />,
  'mandatory-licenses':         <Building2 className="w-4 h-4" />,
  'web-digital':                <Monitor className="w-4 h-4" />,
};

export default function Navbar() {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [openGroup, setOpenGroup]             = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen]       = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const navRef  = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeGroupLabel = useMemo(() => {
    const p = location.pathname;
    let categoryId: string | null = null;
    if (p.startsWith('/category/'))  categoryId = decodeURIComponent(p.replace('/category/', '').split('/')[0]);
    else if (p.startsWith('/service/')) {
      const sid = decodeURIComponent(p.replace('/service/', '').split('/')[0]);
      categoryId = getServiceById(sid)?.categoryId ?? null;
    }
    if (!categoryId) return null;
    return NAV_GROUPS.find((g) => g.categoryIds.includes(categoryId!))?.label ?? null;
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (openGroup && navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [openGroup]);

  useEffect(() => { setOpenGroup(null); setIsMobileOpen(false); }, [location.pathname]);

  const categoriesForGroup = (group: NavGroup): ServiceCategory[] =>
    group.categoryIds.map((id) => SERVICE_CATEGORIES.find((c) => c.id === id)).filter(Boolean) as ServiceCategory[];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/assets/logo.png"
              alt="Mridhuv Associates"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_GROUPS.map((group) => {
              const isActive = activeGroupLabel === group.label;
              const isOpen   = openGroup === group.label;
              return (
                <button
                  key={group.label}
                  onClick={(e) => { e.stopPropagation(); setOpenGroup(isOpen ? null : group.label); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive || isOpen
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {group.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <a href="tel:+919876543210" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
              +91 98765 43210
            </a>
            <Link
              to="/category/new-business"
              className="h-9 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[13px] font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all hover:-translate-y-px flex items-center"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop mega-dropdown */}
      <AnimatePresence>
        {openGroup && (
          <motion.div
            key={openGroup}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="hidden lg:block absolute left-0 right-0 top-16 bg-white border-b border-gray-200 shadow-xl shadow-gray-200/60"
          >
            <div className="max-w-7xl mx-auto px-8 py-8">
              {(() => {
                const group = NAV_GROUPS.find((g) => g.label === openGroup)!;
                const cats  = categoriesForGroup(group);
                return (
                  <div className={`grid gap-8 ${cats.length === 1 ? 'grid-cols-1' : cats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {cats.map((cat) => {
                      const services = getServicesByCategory(cat.id);
                      return (
                        <div key={cat.id}>
                          <button
                            onClick={() => { navigate(`/category/${cat.id}`); setOpenGroup(null); }}
                            className="group flex items-center gap-2 mb-3 w-full text-left"
                          >
                            <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                              {CATEGORY_ICON[cat.id] ?? <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-indigo-600 transition-colors">
                              {cat.title}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all ml-auto" />
                          </button>
                          <div className="space-y-0.5">
                            {services.map((svc) => (
                              <button
                                key={svc.id}
                                onClick={() => { navigate(`/service/${svc.id}`); setOpenGroup(null); }}
                                className="group w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                              >
                                <div className="text-[13px] font-medium text-gray-600 group-hover:text-indigo-700 transition-colors leading-snug">
                                  {svc.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed top-16 right-0 bottom-0 w-[300px] bg-white border-l border-gray-200 z-40 overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="py-4">
                {NAV_GROUPS.map((group) => {
                  const cats   = categoriesForGroup(group);
                  const isOpen = mobileOpenGroup === group.label;
                  return (
                    <div key={group.label} className="border-b border-gray-100 last:border-none">
                      <button
                        onClick={() => setMobileOpenGroup(isOpen ? null : group.label)}
                        className="flex items-center justify-between w-full px-5 py-3.5 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-gray-400">{group.icon}</span>
                          <span className="text-[14px] font-semibold text-gray-800">{group.label}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {cats.map((cat) => {
                              const services = getServicesByCategory(cat.id);
                              return (
                                <div key={cat.id} className="px-5 pb-3">
                                  <button
                                    onClick={() => { navigate(`/category/${cat.id}`); setIsMobileOpen(false); }}
                                    className="flex items-center gap-2 mb-1.5 mt-2 w-full text-left"
                                  >
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">{cat.title}</span>
                                  </button>
                                  <div className="space-y-0.5 pl-1">
                                    {services.map((svc) => (
                                      <button
                                        key={svc.id}
                                        onClick={() => { navigate(`/service/${svc.id}`); setIsMobileOpen(false); }}
                                        className="w-full text-left px-2 py-1.5 rounded-md text-[13px] text-gray-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors block"
                                      >
                                        {svc.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <div className="px-5 pt-5 pb-6 space-y-3">
                  <a href="tel:+919876543210" className="w-full py-2.5 rounded-lg border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
                    +91 98765 43210
                  </a>
                  <Link
                    to="/category/new-business"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-[14px] font-semibold text-white hover:opacity-95 transition-opacity flex items-center justify-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
