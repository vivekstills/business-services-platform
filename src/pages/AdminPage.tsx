import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Home,
  Mail,
  Layers,
  Briefcase,
  HelpCircle,
  CreditCard,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import AdminHeroSection from '../components/admin/AdminHeroSection';
import AdminContactSection from '../components/admin/AdminContactSection';
import AdminCategoriesSection from '../components/admin/AdminCategoriesSection';
import AdminServicesSection from '../components/admin/AdminServicesSection';
import AdminFAQSection from '../components/admin/AdminFAQSection';
import AdminPricingSection from '../components/admin/AdminPricingSection';
import AdminFooterSection from '../components/admin/AdminFooterSection';
import AdminGetInTouchSection from '../components/admin/AdminGetInTouchSection';
import AdminOurServicesSection from '../components/admin/AdminOurServicesSection';
import AdminJsonEditor from '../components/admin/AdminJsonEditor';
import AdminLeadsSection from '../components/admin/AdminLeadsSection';
import AdminOrdersSection from '../components/admin/AdminOrdersSection';
import AdminStateFAQSection from '../components/admin/AdminStateFAQSection';
import AdminStatePricingSection from '../components/admin/AdminStatePricingSection';
import AdminArticlesSection from '../components/admin/AdminArticlesSection';
import { Search, Code, Users, CreditCard as CreditCardIcon, MapPin, DollarSign, BookOpen } from 'lucide-react';

const TOKEN_KEY = 'admin_token';

const SECTION_GROUPS = [
  {
    label: 'Homepage',
    sections: [
      { id: 'hero', label: 'Hero', icon: Home },
      { id: 'contactSection', label: 'Get in Touch', icon: Mail },
      { id: 'servicesSection', label: 'Our Services', icon: Briefcase },
    ],
  },
  {
    label: 'Site-wide',
    sections: [
      { id: 'contact', label: 'Contact info', icon: Mail },
      { id: 'footer', label: 'Footer', icon: FileText },
    ],
  },
  {
    label: 'Content',
    sections: [
      { id: 'categories', label: 'Categories', icon: Layers },
      { id: 'services', label: 'Services', icon: Briefcase },
      { id: 'faqs', label: 'FAQs', icon: HelpCircle },
      { id: 'pricing', label: 'Pricing', icon: CreditCard },
      { id: 'stateFaqs', label: 'State FAQs', icon: MapPin },
      { id: 'statePackages', label: 'State Pricing', icon: DollarSign },
    ],
  },
  {
    label: 'Content Writing',
    sections: [
      { id: 'articles', label: 'Articles', icon: BookOpen },
    ],
  },
  {
    label: 'Leads & Payments',
    sections: [
      { id: 'leads', label: 'Captured Leads', icon: Users },
      { id: 'orders', label: 'Orders & Payments', icon: CreditCardIcon },
    ],
  },
  {
    label: 'Advanced',
    sections: [{ id: 'json', label: 'All content (JSON)', icon: Code }],
  },
] as const;

const ALL_SECTIONS = SECTION_GROUPS.flatMap((g) => g.sections);
type SectionId = (typeof ALL_SECTIONS)[number]['id'];

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = (searchParams.get('section') || 'hero') as SectionId;
  const [sectionSearch, setSectionSearch] = useState('');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('/api/admin/content', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        setContent(data);
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (sectionId: string, data: Record<string, unknown> | unknown[]) => {
    if (!token || !content) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      const payload = sectionId === 'json' ? data : { ...content, [sectionId]: data };
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      setContent(sectionId === 'json' ? (data as Record<string, unknown>) : (prev) => (prev ? { ...prev, [sectionId]: data } : null));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const [autoLoginDone, setAutoLoginDone] = useState(false);

  useEffect(() => {
    if (token) return;
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: '' }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
        }
      })
      .catch(() => {})
      .finally(() => setAutoLoginDone(true));
  }, []);

  if (!token && !autoLoginDone) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const sectionLabel = ALL_SECTIONS.find((s) => s.id === section)?.label ?? section;

  const Sidebar = () => (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white border-r border-slate-700/50 transform transition-transform lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0">
        <span className="font-semibold text-blue-400">Admin</span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-3 border-b border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={sectionSearch}
            onChange={(e) => setSectionSearch(e.target.value)}
            placeholder="Search sections…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
        </div>
      </div>
      <nav className="p-3 space-y-4 overflow-y-auto flex-1">
        {SECTION_GROUPS.map((group) => {
          const filtered = group.sections.filter(
            (s) =>
              !sectionSearch.trim() ||
              s.label.toLowerCase().includes(sectionSearch.toLowerCase()) ||
              s.id.toLowerCase().includes(sectionSearch.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <div key={group.label}>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.label}
              </div>
              <div className="space-y-1">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSearchParams({ section: s.id });
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors text-sm ${
                      section === s.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <s.icon className="w-4 h-4 flex-shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <LayoutDashboard className="w-4 h-4" /> View site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{sectionLabel}</h1>
          <div className="flex items-center gap-2">
            {saveStatus === 'success' && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" /> Save failed
              </span>
            )}
          </div>
        </header>

        <main className="p-6 max-w-4xl">
          {section === 'hero' && content?.hero && (
            <AdminHeroSection
              data={content.hero as Record<string, unknown>}
              onSave={(d) => handleSave('hero', d)}
              saving={saving}
            />
          )}
          {section === 'contact' && content?.contact && (
            <AdminContactSection
              data={content.contact as Record<string, unknown>}
              onSave={(d) => handleSave('contact', d)}
              saving={saving}
            />
          )}
          {section === 'footer' && content?.footer && (
            <AdminFooterSection
              data={content.footer as Record<string, unknown>}
              onSave={(d) => handleSave('footer', d)}
              saving={saving}
            />
          )}
          {section === 'categories' && content?.categories && (
            <AdminCategoriesSection
              data={content.categories as unknown[]}
              onSave={(d) => handleSave('categories', d)}
              saving={saving}
            />
          )}
          {section === 'services' && content?.services && (
            <AdminServicesSection
              data={content.services as unknown[]}
              onSave={(d) => handleSave('services', d)}
              saving={saving}
            />
          )}
          {section === 'faqs' && content?.faqs && (
            <AdminFAQSection
              data={content.faqs as Record<string, unknown[]>}
              services={content.services as { id: string; name: string }[]}
              onSave={(d) => handleSave('faqs', d)}
              saving={saving}
            />
          )}
          {section === 'pricing' && content?.pricing && (
            <AdminPricingSection
              data={content.pricing as Record<string, unknown>}
              onSave={(d) => handleSave('pricing', d)}
              saving={saving}
            />
          )}
          {section === 'contactSection' && (
            <AdminGetInTouchSection
              data={(content?.contactSection ?? {}) as Record<string, unknown>}
              onSave={(d) => handleSave('contactSection', d)}
              saving={saving}
            />
          )}
          {section === 'servicesSection' && (
            <AdminOurServicesSection
              data={(content?.servicesSection ?? {}) as Record<string, unknown>}
              onSave={(d) => handleSave('servicesSection', d)}
              saving={saving}
            />
          )}
          {section === 'stateFaqs' && (
            <AdminStateFAQSection
              data={(content?.stateFaqConfig ?? {}) as Record<string, unknown>}
              services={(content?.services ?? []) as { id: string; name: string }[]}
              onSave={(d) => handleSave('stateFaqConfig', d)}
              saving={saving}
            />
          )}
          {section === 'statePackages' && (
            <AdminStatePricingSection
              data={(content?.statePackages ?? {}) as Record<string, unknown>}
              services={(content?.services ?? []) as { id: string; name: string }[]}
              onSave={(d) => handleSave('statePackages', d)}
              saving={saving}
            />
          )}
          {section === 'articles' && content && (
            <AdminArticlesSection
              data={(content?.articles ?? []) as import('../types/content').Article[]}
              categories={(content?.articleCategories ?? []) as string[]}
              onSave={(articles, categories) => {
                const merged = { ...content, articles, articleCategories: categories };
                handleSave('json', merged as unknown as Record<string, unknown>);
              }}
              saving={saving}
            />
          )}
          {section === 'leads' && token && (
            <AdminLeadsSection token={token} />
          )}
          {section === 'orders' && token && (
            <AdminOrdersSection token={token} />
          )}
          {section === 'json' && content && (
            <AdminJsonEditor
              data={content}
              onSave={(d) => handleSave('json', d)}
              saving={saving}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export { TOKEN_KEY };
