import React, { useState, useEffect, useMemo } from 'react';
import { Save, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { SortableList } from './SortableList';

type ServicePackage = { name: string; price: string; description: string };
type Service = {
  id: string;
  name: string;
  mainHead: string;
  categoryId: string;
  shortDescription?: string;
  content: string;
  packages: ServicePackage[];
};

type Props = {
  data: unknown[];
  onSave: (data: unknown[]) => void;
  saving: boolean;
};

export default function AdminServicesSection({ data, onSave, saving }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setServices(
      Array.isArray(data)
        ? data.map((s) => {
            const x = s as Service;
            return {
              id: String(x.id ?? ''),
              name: String(x.name ?? ''),
              mainHead: String(x.mainHead ?? ''),
              categoryId: String(x.categoryId ?? ''),
              shortDescription: x.shortDescription ? String(x.shortDescription) : undefined,
              content: String(x.content ?? ''),
              packages: Array.isArray(x.packages)
                ? x.packages.map((p) => ({
                    name: String(p.name ?? ''),
                    price: String(p.price ?? ''),
                    description: String(p.description ?? ''),
                  }))
                : [],
            };
          })
        : []
    );
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.mainHead.toLowerCase().includes(q)
    );
  }, [services, search]);

  const update = (id: string, updates: Partial<Service>) => {
    setServices((p) =>
      p.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const updatePackage = (serviceId: string, pkgIndex: number, updates: Partial<ServicePackage>) => {
    setServices((p) =>
      p.map((s) => {
        if (s.id !== serviceId) return s;
        const next = [...s.packages];
        next[pkgIndex] = { ...next[pkgIndex], ...updates };
        return { ...s, packages: next };
      })
    );
  };

  const reorderPackages = (serviceId: string, packages: ServicePackage[]) => {
    setServices((p) =>
      p.map((s) => (s.id === serviceId ? { ...s, packages } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} services</span>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {!search.trim() ? (
        <SortableList
          items={services}
          onReorder={setServices}
          getItemId={(s) => s.id}
          renderItem={(s) => (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-400">{s.id}</div>
              </div>
              {expandedId === s.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedId === s.id && (
              <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    value={s.name}
                    onChange={(e) => update(s.id, { name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Short description</label>
                  <input
                    value={s.shortDescription ?? ''}
                    onChange={(e) => update(s.id, { shortDescription: e.target.value || undefined })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                  <textarea
                    value={s.content}
                    onChange={(e) => update(s.id, { content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Packages</label>
                  <p className="text-xs text-gray-400 mb-2">Drag to reorder packages.</p>
                  <SortableList
                    items={s.packages}
                    onReorder={(pkgs) => reorderPackages(s.id, pkgs)}
                    getItemId={(pkg, j) => `pkg-${s.id}-${j}`}
                    renderItem={(pkg, i) => (
                      <div className="p-3 rounded-lg bg-white border border-gray-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={pkg.name}
                            onChange={(e) => updatePackage(s.id, i, { name: e.target.value })}
                            placeholder="Package name"
                            className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                          />
                          <input
                            value={pkg.price}
                            onChange={(e) => updatePackage(s.id, i, { price: e.target.value })}
                            placeholder="Price"
                            className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                          />
                        </div>
                        <textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(s.id, i, { description: e.target.value })}
                          placeholder="Description"
                          rows={2}
                          className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
          )}
        />
        ) : (
        filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-400">{s.id}</div>
              </div>
              {expandedId === s.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedId === s.id && (
              <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    value={s.name}
                    onChange={(e) => update(s.id, { name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Short description</label>
                  <input
                    value={s.shortDescription ?? ''}
                    onChange={(e) => update(s.id, { shortDescription: e.target.value || undefined })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                  <textarea
                    value={s.content}
                    onChange={(e) => update(s.id, { content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Packages</label>
                  <div className="space-y-3">
                    {s.packages.map((pkg, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white border border-gray-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={pkg.name}
                            onChange={(e) => updatePackage(s.id, i, { name: e.target.value })}
                            placeholder="Package name"
                            className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                          />
                          <input
                            value={pkg.price}
                            onChange={(e) => updatePackage(s.id, i, { price: e.target.value })}
                            placeholder="Price"
                            className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                          />
                        </div>
                        <textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(s.id, i, { description: e.target.value })}
                          placeholder="Description"
                          rows={2}
                          className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
        )}
      </div>

      <button
        onClick={() => onSave(services)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Services'}
      </button>
    </div>
  );
}
