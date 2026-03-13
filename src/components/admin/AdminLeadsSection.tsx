import React, { useState, useEffect } from 'react';
import {
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail as MailIcon,
  Clock,
  Globe,
  Zap,
  RefreshCw,
  Download,
  User,
} from 'lucide-react';

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  page_url: string;
  time_spent: number;
  trigger_type: string;
  created_at: string;
};

type AnalyticsSummary = { event: string; count: number };

type Props = {
  token: string;
};

const TRIGGER_LABELS: Record<string, string> = {
  time_on_page: 'Time on page',
  scroll_depth: 'Scroll depth',
  pricing_click: 'Pricing click',
  exit_intent: 'Exit intent',
};

export default function AdminLeadsSection({ token }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary[]>([]);
  const limit = 20;

  const fetchLeads = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?page=${p}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
      setPage(p);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setAnalytics(data.summary ?? []);
    } catch {}
  };

  useEffect(() => {
    fetchLeads(1);
    fetchAnalytics();
  }, [token]);

  const deleteLead = async (id: number) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads((p) => p.filter((l) => l.id !== id));
      setTotal((t) => t - 1);
    } catch {}
  };

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Service', 'Page URL', 'Time (s)', 'Trigger', 'Date'];
    const rows = leads.map((l) => [
      l.name,
      l.phone,
      l.email,
      l.service,
      l.page_url,
      String(l.time_spent),
      l.trigger_type,
      l.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / limit);

  const getEventCount = (event: string) => analytics.find((a) => a.event === event)?.count ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={total}
          icon={<User className="w-4 h-4" />}
          color="blue"
        />
        <StatCard
          label="Page Visits (30d)"
          value={getEventCount('page_visit')}
          icon={<Globe className="w-4 h-4" />}
          color="indigo"
        />
        <StatCard
          label="Chatbot Triggered"
          value={getEventCount('chatbot_triggered')}
          icon={<Zap className="w-4 h-4" />}
          color="amber"
        />
        <StatCard
          label="Leads Submitted"
          value={getEventCount('lead_submitted')}
          icon={<MailIcon className="w-4 h-4" />}
          color="emerald"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { fetchLeads(page); fetchAnalytics(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
        {leads.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400">{total} total leads</span>
      </div>

      {/* Leads table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <User className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No leads captured yet.</p>
          <p className="text-xs mt-1">Leads will appear here when visitors submit the intent popup.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Trigger</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <MailIcon className="w-3 h-3" /> {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-medium">
                        {lead.service || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {TRIGGER_LABELS[lead.trigger_type] ?? lead.trigger_type ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px] truncate" title={lead.page_url}>
                      {lead.page_url || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lead.time_spent}s
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(lead.created_at + 'Z').toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => fetchLeads(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fetchLeads(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[color] ?? colors.blue}`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
    </div>
  );
}
