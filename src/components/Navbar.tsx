import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, ChevronDown, ArrowRight,
  Briefcase, FileText, Calculator, Shield, Scale, Globe, Landmark, Wine, Building2, Monitor
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES, getServiceById, getServicesByCategory, type ServiceCategory } from '../data/services';

// ─── Top-level nav groups ─────────────────────────────────────────────────────
// Each group maps to one button in the header bar.
// `categoryIds` lists which SERVICE_CATEGORIES appear in that dropdown.
type NavGroup = {
  label: string;
  icon: React.ReactNode;
  categoryIds: string[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Form New Business',
    icon: <Briefcase className="w-4 h-4" />,
    categoryIds: ['new-business', 'international-incorporations'],
  },
  {
    label: 'Registrations',
    icon: <FileText className="w-4 h-4" />,
    categoryIds: ['registration', 'hr-compliance', 'ngo-registrations'],
  },
  {
    label: 'GST & Taxes',
    icon: <Calculator className="w-4 h-4" />,
    categoryIds: ['gst-services', 'income-tax', 'return-filing'],
  },
  {
    label: 'Trademark & IP',
    icon: <Shield className="w-4 h-4" />,
    categoryIds: ['trademark-ip'],
  },
  {
    label: 'Compliance',
    icon: <Scale className="w-4 h-4" />,
    categoryIds: ['legal-compliance'],
  },
  {
    label: 'Licenses & More',
    icon: <Landmark className="w-4 h-4" />,
    categoryIds: ['liquor-licenses', 'mandatory-licenses', 'web-digital'],
  },
];

// Category icon map for the dropdown panels
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [openGroup, setOpenGroup]           = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen]     = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  // Derive which nav group is "active" from the current URL
  const activeGroupLabel = useMemo(() => {
    const p = location.pathname;
    let categoryId: string | null = null;
    if (p.startsWith('/category/')) {
      categoryId = decodeURIComponent(p.replace('/category/', '').split('/')[0]);
    } else if (p.startsWith('/service/')) {
      const sid = decodeURIComponent(p.replace('/service/', '').split('/')[0]);
      categoryId = getServiceById(sid)?.categoryId ?? null;
    }
    if (!categoryId) return null;
    return NAV_GROUPS.find((g) => g.categoryIds.includes(categoryId!))?.label ?? null;
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (openGroup && navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [openGroup]);

  // Close dropdown on route change
  useEffect(() => { setOpenGroup(null); setIsMobileOpen(false); }, [location.pathname]);

  const categoriesForGroup = (group: NavGroup): ServiceCategory[] =>
    group.categoryIds
      .map((id) => SERVICE_CATEGORIES.find((c) => c.id === id))
      .filter(Boolean) as ServiceCategory[];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080C18]/95 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-[#080C18] border-b border-white/8'
      }`}
    >
      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#2563EB] flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-[17px] font-bold text-white tracking-tight group-hover:text-white/90 transition-colors">
              YourBrand
            </span>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_GROUPS.map((group) => {
              const isActive = activeGroupLabel === group.label;
              const isOpen   = openGroup === group.label;
              return (
                <button
                  key={group.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenGroup(isOpen ? null : group.label);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                    isActive || isOpen
                      ? 'bg-white/10 text-white'
                      : 'text-white/65 hover:text-white hover:bg-white/6'
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : 'text-white/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-[13.5px] font-medium text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/6 transition-all">
              Login
            </button>
            <button className="h-8 px-4 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#2563EB] text-white text-[13px] font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-px">
              Get Started
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/8 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Desktop mega-dropdown ── */}
      <AnimatePresence>
        {openGroup && (
          <motion.div
            key={openGroup}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="hidden lg:block absolute left-0 right-0 top-16 bg-[#0D1120] border-b border-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
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
                          {/* Category header */}
                          <button
                            onClick={() => { navigate(`/category/${cat.id}`); setOpenGroup(null); }}
                            className="group flex items-center gap-2 mb-3 w-full text-left"
                          >
                            <div className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                              {CATEGORY_ICON[cat.id] ?? <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-[12px] font-bold uppercase tracking-widest text-white/40 group-hover:text-indigo-400 transition-colors">
                              {cat.title}
                            </span>
                            <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all ml-auto" />
                          </button>

                          {/* Services list */}
                          <div className="space-y-0.5">
                            {services.map((svc) => (
                              <button
                                key={svc.id}
                                onClick={() => { navigate(`/service/${svc.id}`); setOpenGroup(null); }}
                                className="group w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <div className="text-[13.5px] font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
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

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed top-16 right-0 bottom-0 w-[300px] bg-[#0D1120] border-l border-white/8 z-40 overflow-y-auto lg:hidden"
            >
              <div className="py-4">
                {NAV_GROUPS.map((group) => {
                  const cats    = categoriesForGroup(group);
                  const isOpen  = mobileOpenGroup === group.label;
                  return (
                    <div key={group.label} className="border-b border-white/6 last:border-none">
                      <button
                        onClick={() => setMobileOpenGroup(isOpen ? null : group.label)}
                        className="flex items-center justify-between w-full px-5 py-3.5 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-white/40">{group.icon}</span>
                          <span className="text-[14px] font-semibold text-white">{group.label}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
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
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                                      {cat.title}
                                    </span>
                                  </button>
                                  <div className="space-y-0.5 pl-1">
                                    {services.map((svc) => (
                                      <button
                                        key={svc.id}
                                        onClick={() => { navigate(`/service/${svc.id}`); setIsMobileOpen(false); }}
                                        className="w-full text-left px-2 py-1.5 rounded-md text-[13px] text-white/65 hover:text-white hover:bg-white/5 transition-colors block"
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

                {/* Mobile CTA */}
                <div className="px-5 pt-5 pb-6 space-y-3">
                  <button className="w-full py-2.5 rounded-lg border border-white/10 text-[14px] font-medium text-white/80 hover:bg-white/5 transition-colors">
                    Login
                  </button>
                  <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#2563EB] text-[14px] font-semibold text-white hover:opacity-95 transition-opacity">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
