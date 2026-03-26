import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, ChevronDown, ArrowRight,
  Briefcase, FileText, Calculator, Shield, Scale, Globe, Landmark, Wine, Building2, Monitor
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContent, getServiceById, getServicesByCategory } from '../context/ContentContext';
import type { ServiceCategory } from '../data/services';

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
  const { content } = useContent();
  const [isScrolled, setIsScrolled]           = useState(false);
  const [openGroup, setOpenGroup]             = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen]       = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const navRef  = useRef<HTMLElement>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeGroupLabel = useMemo(() => {
    const p = location.pathname;
    let categoryId: string | null = null;
    if (p.startsWith('/category/'))  categoryId = decodeURIComponent(p.replace('/category/', '').split('/')[0]);
    else if (p.startsWith('/service/')) {
      const sid = decodeURIComponent(p.replace('/service/', '').split('/')[0]);
      categoryId = getServiceById(content.services, sid)?.categoryId ?? null;
    }
    if (!categoryId) return null;
    return NAV_GROUPS.find((g) => g.categoryIds.includes(categoryId!))?.label ?? null;
  }, [location.pathname, content.services]);

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

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) clearTimeout(hoverCloseTimerRef.current);
    };
  }, []);

  const cancelHoverClose = () => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  };

  /** Delay closing so the pointer can move from a trigger to the mega-menu without a gap flicker */
  const scheduleHoverClose = () => {
    cancelHoverClose();
    hoverCloseTimerRef.current = setTimeout(() => setOpenGroup(null), 220);
  };

  useEffect(() => { setOpenGroup(null); setIsMobileOpen(false); }, [location.pathname]);

  const categoriesForGroup = (group: NavGroup): ServiceCategory[] =>
    group.categoryIds.map((id) => content.categories.find((c) => c.id === id)).filter(Boolean) as ServiceCategory[];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-white/90 backdrop-blur-lg border-b border-gray-100/50'
      }`}
    >
      {/* Top bar: logo | nav + Articles (single row; scroll if needed) | phone + CTA */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center gap-2 lg:gap-3">
          <Link to="/" className="flex items-center shrink-0 z-10">
            <img
              src="/assets/logo.png"
              alt="Mridhuv Associates"
              className="h-12 lg:h-14 w-auto max-h-14 object-contain"
            />
          </Link>

          {/* Desktop: hover opens mega-menu; delayed close bridges gap to panel. Articles stays a plain link. */}
          <div className="hidden lg:flex flex-1 min-w-0 items-stretch justify-center px-1 min-h-0">
            <div
              className="relative flex flex-1 min-w-0 flex-col items-center justify-center"
              onMouseEnter={cancelHoverClose}
              onMouseLeave={scheduleHoverClose}
            >
              <div
                className="flex max-w-full flex-nowrap items-center justify-center gap-0 overflow-x-auto overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="navigation"
                aria-label="Primary"
                onMouseEnter={cancelHoverClose}
              >
                {NAV_GROUPS.map((group) => {
                  const isActive = activeGroupLabel === group.label;
                  const isOpen   = openGroup === group.label;
                  return (
                    <div
                      key={group.label}
                      className="shrink-0"
                      onMouseEnter={() => {
                        cancelHoverClose();
                        setOpenGroup(group.label);
                      }}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenGroup(isOpen ? null : group.label);
                        }}
                        className={`inline-flex items-center gap-0.5 px-2 py-1.5 rounded-md text-[calc(12px+1pt)] xl:text-[calc(13px+1pt)] font-medium leading-tight tracking-tight transition-all duration-150 whitespace-nowrap ${
                          isActive || isOpen
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span>{group.label}</span>
                        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  );
                })}
                <Link
                  to="/articles"
                  className={`inline-flex shrink-0 items-center px-2 py-1.5 rounded-md text-[calc(12px+1pt)] xl:text-[calc(13px+1pt)] font-medium leading-tight transition-all duration-150 whitespace-nowrap ${
                    location.pathname.startsWith('/articles')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Articles
                </Link>
              </div>

              {/* Mega-menu: inside hover region (absolute below triggers) */}
              <AnimatePresence>
                {openGroup && (
                  <motion.div
                    key={openGroup}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute left-1/2 top-full z-40 w-[min(100vw-1rem,72rem)] max-w-[calc(100vw-1rem)] -translate-x-1/2 pointer-events-none"
                  >
                    {/* Negative margin + padding bridges any subpixel gap between triggers and panel */}
                    <div className="pointer-events-auto flex justify-center px-3 sm:px-4 lg:px-6 -mt-2 pt-2">
                      {(() => {
                        const group = NAV_GROUPS.find((g) => g.label === openGroup)!;
                        const cats  = categoriesForGroup(group);
                        return (
                          <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 py-4 px-4 lg:py-5 lg:px-5 w-max max-w-[min(100vw-1.5rem,56rem)]">
                            <div
                              className={`flex flex-wrap items-start justify-start gap-x-5 lg:gap-x-6 gap-y-5 ${
                                cats.length === 1 ? 'flex-col' : ''
                              }`}
                            >
                              {cats.map((cat) => {
                                const services = getServicesByCategory(content.services, cat.id);
                                return (
                                  <div
                                    key={cat.id}
                                    className={`flex-none min-w-0 ${
                                      cats.length === 1
                                        ? 'w-full max-w-md'
                                        : 'w-[13.75rem] sm:w-[14.5rem] lg:w-[15rem]'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigate(`/category/${cat.id}`);
                                        setOpenGroup(null);
                                      }}
                                      className="group flex items-center gap-2 mb-2.5 w-full text-left"
                                    >
                                      <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                        {CATEGORY_ICON[cat.id] ?? <FileText className="w-3.5 h-3.5" />}
                                      </div>
                                      <span className="text-[calc(11px+3pt)] font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors leading-tight">
                                        {cat.title}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-auto" />
                                    </button>
                                    <div className="space-y-0.5 pr-1">
                                      {services.map((svc) => (
                                        <button
                                          key={svc.id}
                                          type="button"
                                          onClick={() => {
                                            navigate(`/service/${svc.id}`);
                                            setOpenGroup(null);
                                          }}
                                          className="group w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                          <div className="text-[calc(13px+3pt)] font-medium text-gray-600 group-hover:text-blue-700 transition-colors leading-snug">
                                            {svc.name}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 shrink-0 z-10 pl-2 ml-0.5 border-l border-gray-200/70">
            <a
              href={`tel:${content.contact.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center text-[calc(12px+1pt)] xl:text-[calc(13px+1pt)] font-medium text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-all whitespace-nowrap tabular-nums leading-tight"
            >
              {content.contact.phone}
            </a>
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
                          <span className="text-[calc(14px+3pt)] font-semibold text-gray-800">{group.label}</span>
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
                              const services = getServicesByCategory(content.services, cat.id);
                              return (
                                <div key={cat.id} className="px-5 pb-3">
                                  <button
                                    onClick={() => { navigate(`/category/${cat.id}`); setIsMobileOpen(false); }}
                                    className="flex items-center gap-2 mb-1.5 mt-2 w-full text-left"
                                  >
                                    <span className="text-[calc(11px+3pt)] font-bold uppercase tracking-wider text-blue-600">{cat.title}</span>
                                  </button>
                                  <div className="space-y-0.5 pl-1">
                                    {services.map((svc) => (
                                      <button
                                        key={svc.id}
                                        onClick={() => { navigate(`/service/${svc.id}`); setIsMobileOpen(false); }}
                                        className="w-full text-left px-2 py-1.5 rounded-md text-[calc(13px+3pt)] text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors block"
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
                  <Link
                    to="/articles"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full py-2.5 rounded-lg border border-gray-200 text-[calc(14px+3pt)] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Articles
                  </Link>
                  <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="w-full py-2.5 rounded-lg border border-gray-200 text-[calc(14px+3pt)] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
                    {content.contact.phone}
                  </a>
                  <Link
                    to="/category/new-business"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 text-[calc(14px+3pt)] font-semibold text-white hover:opacity-95 transition-opacity flex items-center justify-center"
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
