import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SortableList } from './SortableList';

type FooterLink = { label: string; to: string };
type ServiceLinkGroup = { heading: string; items: FooterLink[] };

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

export default function AdminFooterSection({ data, onSave, saving }: Props) {
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [serviceLinks, setServiceLinks] = useState<ServiceLinkGroup[]>([]);
  const [policyLinks, setPolicyLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    const d = data as {
      tagline?: string;
      address?: string;
      serviceLinks?: ServiceLinkGroup[];
      policyLinks?: FooterLink[];
    };
    setTagline(String(d.tagline ?? ''));
    setAddress(String(d.address ?? ''));
    setServiceLinks(
      Array.isArray(d.serviceLinks)
        ? d.serviceLinks.map((g) => ({
            heading: String(g.heading ?? ''),
            items: Array.isArray(g.items)
              ? g.items.map((i) => ({ label: String(i.label ?? ''), to: String(i.to ?? '') }))
              : [],
          }))
        : []
    );
    setPolicyLinks(
      Array.isArray(d.policyLinks)
        ? d.policyLinks.map((i) => ({ label: String(i.label ?? ''), to: String(i.to ?? '') }))
        : []
    );
  }, [data]);

  const updateServiceGroup = (i: number, updates: Partial<ServiceLinkGroup>) => {
    setServiceLinks((p) => {
      const next = [...p];
      next[i] = { ...next[i], ...updates };
      return next;
    });
  };

  const updateServiceItem = (groupIndex: number, itemIndex: number, updates: Partial<FooterLink>) => {
    setServiceLinks((p) => {
      const next = [...p];
      const items = [...next[groupIndex].items];
      items[itemIndex] = { ...items[itemIndex], ...updates };
      next[groupIndex] = { ...next[groupIndex], items };
      return next;
    });
  };

  const updatePolicyLink = (i: number, updates: Partial<FooterLink>) => {
    setPolicyLinks((p) => {
      const next = [...p];
      next[i] = { ...next[i], ...updates };
      return next;
    });
  };

  const reorderServiceItems = (groupIndex: number, items: FooterLink[]) => {
    setServiceLinks((p) => {
      const next = [...p];
      next[groupIndex] = { ...next[groupIndex], items };
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Footer</h2>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Service links</h2>
        <p className="text-xs text-gray-400">Drag groups and items to reorder.</p>
        <SortableList
          items={serviceLinks}
          onReorder={setServiceLinks}
          getItemId={(g, i) => `group-${i}-${g.heading}`}
          renderItem={(g, i) => (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
              <input
                value={g.heading}
                onChange={(e) => updateServiceGroup(i, { heading: e.target.value })}
                placeholder="Heading"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium"
              />
              <SortableList
                items={g.items}
                onReorder={(items) => reorderServiceItems(i, items)}
                getItemId={(item) => item.label || item.to}
                renderItem={(item, j) => (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={item.label}
                      onChange={(e) => updateServiceItem(i, j, { label: e.target.value })}
                      placeholder="Label"
                      className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                    />
                    <input
                      value={item.to}
                      onChange={(e) => updateServiceItem(i, j, { to: e.target.value })}
                      placeholder="/service/..."
                      className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Policy links</h2>
        <p className="text-xs text-gray-400">Drag to reorder.</p>
        <SortableList
          items={policyLinks}
          onReorder={setPolicyLinks}
          getItemId={(item) => item.label || item.to}
          renderItem={(item, i) => (
            <div className="grid grid-cols-2 gap-2">
              <input
                value={item.label}
                onChange={(e) => updatePolicyLink(i, { label: e.target.value })}
                placeholder="Label"
                className="px-4 py-2 rounded-lg border border-gray-200"
              />
              <input
                value={item.to}
                onChange={(e) => updatePolicyLink(i, { to: e.target.value })}
                placeholder="/privacy-policy"
                className="px-4 py-2 rounded-lg border border-gray-200"
              />
            </div>
          )}
        />
      </div>

      <button
        onClick={() => onSave({ tagline, address, serviceLinks, policyLinks })}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Footer'}
      </button>
    </div>
  );
}
