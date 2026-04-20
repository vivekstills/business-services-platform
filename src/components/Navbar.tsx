import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Briefcase, FileText, Calculator, Shield, Scale, Landmark, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services';
import { getCategoryTitleById, getServiceBySlug, getServiceDetailRoute } from '../data/servicesData';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const navSearchDesktopRef = useRef<HTMLDivElement>(null);
  const navSearchMobileRef = useRef<HTMLDivElement>(null);
  const navSearchDesktopInputRef = useRef<HTMLInputElement>(null);
  const navSearchMobileInputRef = useRef<HTMLInputElement>(null);
  const debouncedNavSearchQuery = useDebouncedValue(navSearchQuery, 200);
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

  const serviceSearchRows = useMemo(
    () =>
      SERVICES.map((service) => ({
        service,
        categoryTitle: getCategoryTitleById(service.categoryId),
        href: getServiceDetailRoute(undefined, service.id),
      })),
    []
  );

  const navSearchMatches = useMemo(() => {
    const q = debouncedNavSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return serviceSearchRows
      .filter(({ service, categoryTitle }) => {
        const sub = service.mainHead.toLowerCase();
        return (
          service.name.toLowerCase().includes(q) ||
          categoryTitle.toLowerCase().includes(q) ||
          sub.includes(q)
        );
      })
      .slice(0, 50);
  }, [serviceSearchRows, debouncedNavSearchQuery]);

  const closeNavSearch = useCallback(() => {
    setNavSearchOpen(false);
    setNavSearchQuery('');
  }, []);

  const handleServiceItemClick = (serviceSlug: string) => {
    if (!getServiceBySlug(serviceSlug)) navigate('/services');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
    setIsMobileOpen(false);
    closeNavSearch();
  }, [location.pathname, closeNavSearch]);
  useEffect(() => {
    if (allServiceGroups.length === 0) return;
    if (!activeCategoryId || !allServiceGroups.some((group) => group.id === activeCategoryId)) {
      setActiveCategoryId(allServiceGroups[0].id);
    }
  }, [allServiceGroups, activeCategoryId]);

  useEffect(() => {
    if (!navSearchOpen) return;
    const id = requestAnimationFrame(() => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      if (desktop) navSearchDesktopInputRef.current?.focus();
      else navSearchMobileInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [navSearchOpen]);

  useEffect(() => {
    if (!navSearchOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      const inDesktop = navSearchDesktopRef.current?.contains(t) ?? false;
      const inMobile = navSearchMobileRef.current?.contains(t) ?? false;
      if (!inDesktop && !inMobile) closeNavSearch();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [navSearchOpen, closeNavSearch]);

  useEffect(() => {
    if (!navSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNavSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navSearchOpen, closeNavSearch]);

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

          <div className="hidden lg:flex flex-1 min-w-0 items-center gap-2">
            <div
              className={`relative flex min-w-0 justify-center transition-[max-width,opacity,margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                navSearchOpen
                  ? 'max-w-0 min-w-0 opacity-0 pointer-events-none mr-0 overflow-visible'
                  : 'max-w-[min(100%,1200px)] flex-1 min-w-0 opacity-100 overflow-visible'
              }`}
            >
              <div className="relative flex items-center gap-6 xl:gap-8 text-base font-medium whitespace-nowrap">
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors shrink-0">Home</Link>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((v) => !v)}
                  onMouseEnter={() => setServicesOpen(true)}
                  className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors shrink-0"
                >
                  Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <Link to="/articles" className="text-gray-600 hover:text-gray-900 transition-colors shrink-0">Articles</Link>
                <Link to="/about-us" className="text-gray-600 hover:text-gray-900 transition-colors shrink-0">About</Link>
                <Link to="/contact-us" className="text-gray-600 hover:text-gray-900 transition-colors shrink-0">Contact</Link>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="absolute z-[120] left-1/2 -translate-x-1/2 top-full w-[min(96vw,1080px)] pt-4 -mt-4"
                    role="presentation"
                  >
                    <div
                      className="overflow-hidden whitespace-normal rounded-xl bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.1)] lg:p-5"
                      role="navigation"
                      aria-label="Services menu"
                    >
                      <div className="flex min-h-[min(420px,65vh)] max-h-[min(72vh,calc(100dvh-5.5rem))]">
                        <aside className="flex w-[25%] min-w-[12.5rem] max-w-[17.5rem] shrink-0 flex-col border-r border-gray-100 bg-gray-50/60 pr-3 lg:pr-4 whitespace-normal">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                            Service categories
                          </p>
                          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain pr-1">
                            {allServiceGroups.map((group) => {
                              const isActive = activeGroup?.id === group.id;
                              return (
                                <button
                                  key={group.id}
                                  type="button"
                                  onMouseEnter={() => setActiveCategoryId(group.id)}
                                  onFocus={() => setActiveCategoryId(group.id)}
                                  onClick={() => setActiveCategoryId(group.id)}
                                  className={`w-full rounded-lg border-l-2 px-2.5 py-2 text-left text-xs font-medium leading-snug transition-colors ${
                                    isActive
                                      ? 'border-l-blue-600 bg-blue-50 text-gray-900'
                                      : 'border-l-transparent text-gray-600 hover:bg-white hover:text-gray-900'
                                  }`}
                                  aria-current={isActive ? 'true' : undefined}
                                >
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="inline-flex min-w-0 items-center gap-1.5">
                                      <span
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                                          isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                        }`}
                                      >
                                        {categoryIcons[group.id] ?? <FileText className="h-3.5 w-3.5" />}
                                      </span>
                                      <span className="min-w-0 break-words">{group.title}</span>
                                    </span>
                                    <span className="shrink-0 text-[9px] font-semibold text-gray-400 tabular-nums">
                                      {group.services.length}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </aside>

                        <div className="min-w-0 max-w-full flex-[1_1_75%] overflow-y-auto overflow-x-hidden overscroll-contain pl-3 lg:pl-5 whitespace-normal">
                          {activeGroup && (
                            <div className="min-w-0 max-w-full">
                              <div className="mb-3">
                                <p className="text-sm font-semibold leading-tight text-gray-900 break-words">
                                  {activeGroup.title}
                                </p>
                                <p className="mt-0.5 text-[11px] text-gray-500">
                                  {activeGroup.services.length} services available
                                </p>
                              </div>
                              <ul
                                className="grid min-w-0 max-w-full grid-cols-2 gap-x-3 gap-y-0.5"
                                role="list"
                              >
                                {activeGroup.services.map((service) => {
                                  const serviceSlug = service.id;
                                  return (
                                    <li key={serviceSlug} className="min-w-0">
                                      <Link
                                        to={getServiceDetailRoute(activeGroup.id, serviceSlug)}
                                        onClick={() => {
                                          handleServiceItemClick(serviceSlug);
                                          setServicesOpen(false);
                                        }}
                                        className="block min-w-0 max-w-full break-words rounded-md px-2 py-1.5 text-left text-xs leading-snug text-gray-700 transition-colors hover:bg-blue-50/80 hover:text-blue-800"
                                      >
                                        {service.name}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>

            <div
              ref={navSearchDesktopRef}
              className={`relative z-[100] flex items-center gap-1.5 self-stretch isolate min-w-0 ${
                navSearchOpen ? 'flex-1 min-w-0' : 'shrink-0'
              }`}
            >
              <div
                className={`min-w-0 overflow-hidden flex justify-start items-center transition-[max-width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                  navSearchOpen ? 'max-w-full flex-1 pointer-events-auto' : 'max-w-0 pointer-events-none'
                }`}
              >
                <div
                  className={`w-full min-w-0 origin-left pr-1 pl-0.5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none will-change-transform ${
                    navSearchOpen ? 'scale-x-100' : 'scale-x-0'
                  }`}
                >
                  <div className="relative w-full max-w-full">
                    <input
                      ref={navSearchDesktopInputRef}
                      type="text"
                      role="searchbox"
                      inputMode="search"
                      autoComplete="off"
                      value={navSearchQuery}
                      onChange={(e) => setNavSearchQuery(e.target.value)}
                      placeholder="Search services…"
                      title="Search services (GST, FSSAI, Trademark...)"
                      aria-label="Search services"
                      tabIndex={navSearchOpen ? 0 : -1}
                      className="w-full h-9 rounded-full border border-gray-200 bg-white pl-3.5 pr-9 text-xs text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus-visible:outline-none"
                    />
                    <button
                      type="button"
                      onClick={closeNavSearch}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (navSearchOpen) closeNavSearch();
                  else {
                    setServicesOpen(false);
                    setNavSearchOpen(true);
                  }
                }}
                className="relative z-[2] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                aria-expanded={navSearchOpen}
                aria-label={navSearchOpen ? 'Close search' : 'Open search'}
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              {navSearchOpen && debouncedNavSearchQuery.trim() && (
                <ul
                  className="absolute left-2 right-[calc(2.25rem+0.375rem)] top-full z-[140] mt-1.5 max-h-56 overflow-y-auto rounded-2xl border border-gray-100 bg-white py-1 shadow-xl"
                  role="listbox"
                >
                  {navSearchMatches.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-gray-500">No services found</li>
                  ) : (
                    navSearchMatches.map(({ service, categoryTitle, href }) => (
                      <li key={service.id} role="none">
                        <Link
                          to={href}
                          role="option"
                          onClick={() => {
                            handleServiceItemClick(service.id);
                            closeNavSearch();
                          }}
                          className="block px-3 py-2 text-left hover:bg-blue-50/80 transition-colors"
                        >
                          <span className="block text-xs font-medium text-gray-900 leading-snug">{service.name}</span>
                          <span className="block text-[11px] text-gray-500 mt-0.5 leading-snug">
                            {`${categoryTitle} > ${service.mainHead}`}
                          </span>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="hidden lg:flex shrink-0 items-center">
            <Link
              to="/payment"
              className="inline-flex items-center justify-center h-9 px-3.5 xl:px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 text-white text-[calc(12px+1pt)] xl:text-[calc(13px+1pt)] font-semibold hover:shadow-md hover:shadow-blue-200/50 transition-all shrink-0 leading-none"
            >
              ₹ Pay Now
            </Link>
          </div>

          <div className="flex items-center gap-0.5 ml-auto lg:ml-0 shrink-0">
            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => {
                if (navSearchOpen) closeNavSearch();
                else {
                  setIsMobileOpen(false);
                  setNavSearchOpen(true);
                }
              }}
              aria-expanded={navSearchOpen}
              aria-label={navSearchOpen ? 'Close search' : 'Open search'}
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
              onClick={() => {
                setIsMobileOpen((v) => {
                  if (!v) closeNavSearch();
                  return !v;
                });
              }}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          </div>
        </div>
      </nav>

      {navSearchOpen && (
        <>
          <div
            className="fixed inset-0 z-[95] bg-black/25 lg:hidden"
            onClick={closeNavSearch}
            aria-hidden
          />
          <div
            ref={navSearchMobileRef}
            className="fixed top-0 left-0 right-0 z-[100] flex flex-col bg-white border-b border-gray-100 shadow-md lg:hidden"
          >
            <div className="flex h-14 sm:h-16 items-center gap-2 px-3 shrink-0">
              <div className="relative flex-1 min-w-0">
                <input
                  ref={navSearchMobileInputRef}
                  type="text"
                  role="searchbox"
                  inputMode="search"
                  autoComplete="off"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Search services…"
                  title="Search services (GST, FSSAI, Trademark...)"
                  aria-label="Search services"
                  className="w-full h-9 sm:h-10 rounded-full border border-gray-200 bg-white pl-3.5 pr-10 text-xs text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={closeNavSearch}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {debouncedNavSearchQuery.trim() && (
              <ul
                className="max-h-[min(50vh,20rem)] overflow-y-auto border-t border-gray-100 py-1"
                role="listbox"
              >
                {navSearchMatches.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500">No services found</li>
                ) : (
                  navSearchMatches.map(({ service, categoryTitle, href }) => (
                    <li key={service.id} role="none">
                      <Link
                        to={href}
                        role="option"
                        onClick={() => {
                          handleServiceItemClick(service.id);
                          closeNavSearch();
                        }}
                        className="block px-4 py-2.5 text-left hover:bg-blue-50/80 transition-colors"
                      >
                        <span className="block text-sm font-medium text-gray-900">{service.name}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {`${categoryTitle} > ${service.mainHead}`}
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </>
      )}

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
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-1 overflow-hidden px-4 pb-3"
                  >
                    {allServiceGroups.map((group) => {
                      const expanded = mobileExpandedCategory === group.id;
                      return (
                        <div key={group.id} className="rounded-xl border border-gray-100 bg-gray-50/40">
                          <button
                            type="button"
                            aria-expanded={expanded}
                            onClick={() =>
                              setMobileExpandedCategory((prev) => (prev === group.id ? null : group.id))
                            }
                            className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors hover:bg-white"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                {categoryIcons[group.id] ?? <FileText className="h-4 w-4" />}
                              </span>
                              <span className="min-w-0 text-sm font-semibold leading-snug text-gray-800">
                                {group.title}
                              </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="text-[10px] font-semibold text-gray-400 tabular-nums">
                                {group.services.length}
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-500 transition-transform ${
                                  expanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t border-gray-100/80 bg-white"
                              >
                                <ul className="max-h-[40vh] space-y-0.5 overflow-y-auto overscroll-contain px-2 py-2" role="list">
                                  {group.services.map((service) => {
                                    const serviceSlug = service.id;
                                    return (
                                      <li key={serviceSlug}>
                                        <Link
                                          to={getServiceDetailRoute(group.id, serviceSlug)}
                                          onClick={() => {
                                            handleServiceItemClick(serviceSlug);
                                            setIsMobileOpen(false);
                                          }}
                                          className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50/80 hover:text-blue-800"
                                        >
                                          {service.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              <Link to="/articles" onClick={() => setIsMobileOpen(false)} className="block px-5 py-3 text-gray-700">Articles</Link>
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
