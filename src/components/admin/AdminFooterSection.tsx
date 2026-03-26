import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { SortableList } from './SortableList';

type FooterLink = { label: string; to: string };
type ServiceLinkGroup = { heading: string; items: FooterLink[] };

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

function newLink(): FooterLink { return { label: '', to: '' }; }
function newGroup(): ServiceLinkGroup { return { heading: 'New Section', items: [newLink()] }; }

export default function AdminFooterSection({ data, onSave, saving }: Props) {
  const [tagline, setTagline] = useState('');
  const [logoAlt, setLogoAlt] = useState('');
  const [quickToolsHeading, setQuickToolsHeading] = useState('');
  const [quickTools, setQuickTools] = useState<FooterLink[]>([]);
  const [paymentTitle, setPaymentTitle] = useState('');
  const [paymentFootnote, setPaymentFootnote] = useState('');
  const [paymentPayButtonLabel, setPaymentPayButtonLabel] = useState('');
  const [paymentSuccessTitle, setPaymentSuccessTitle] = useState('');
  const [paymentSuccessSub, setPaymentSuccessSub] = useState('');
  const [copyrightLine, setCopyrightLine] = useState('');
  const [contactBlockHeading, setContactBlockHeading] = useState('');
  const [showBottomContactRow, setShowBottomContactRow] = useState(true);
  const [paymentCheckoutBrandName, setPaymentCheckoutBrandName] = useState('');
  const [paymentPlaceholderAmount, setPaymentPlaceholderAmount] = useState('');
  const [paymentPlaceholderName, setPaymentPlaceholderName] = useState('');
  const [paymentPlaceholderPhone, setPaymentPlaceholderPhone] = useState('');
  const [paymentPlaceholderEmail, setPaymentPlaceholderEmail] = useState('');
  const [paymentPlaceholderNote, setPaymentPlaceholderNote] = useState('');
  const [serviceLinks, setServiceLinks] = useState<ServiceLinkGroup[]>([]);
  const [policyLinks, setPolicyLinks] = useState<FooterLink[]>([]);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const d = data as {
      tagline?: string;
      logoAlt?: string;
      quickToolsHeading?: string;
      quickTools?: FooterLink[];
      paymentTitle?: string;
      paymentFootnote?: string;
      paymentPayButtonLabel?: string;
      paymentSuccessTitle?: string;
      paymentSuccessSub?: string;
      copyrightLine?: string;
      serviceLinks?: ServiceLinkGroup[];
      policyLinks?: FooterLink[];
    };
    setTagline(String(d.tagline ?? ''));
    setLogoAlt(String(d.logoAlt ?? ''));
    setQuickToolsHeading(String(d.quickToolsHeading ?? ''));
    setQuickTools(
      Array.isArray(d.quickTools)
        ? d.quickTools.map((i) => ({ label: String(i.label ?? ''), to: String(i.to ?? '') }))
        : []
    );
    setPaymentTitle(String(d.paymentTitle ?? ''));
    setPaymentFootnote(String(d.paymentFootnote ?? ''));
    setPaymentPayButtonLabel(String(d.paymentPayButtonLabel ?? ''));
    setPaymentSuccessTitle(String(d.paymentSuccessTitle ?? ''));
    setPaymentSuccessSub(String(d.paymentSuccessSub ?? ''));
    setCopyrightLine(String(d.copyrightLine ?? ''));
    setContactBlockHeading(String(d.contactBlockHeading ?? ''));
    setShowBottomContactRow(d.showBottomContactRow !== false);
    setPaymentCheckoutBrandName(String(d.paymentCheckoutBrandName ?? ''));
    setPaymentPlaceholderAmount(String(d.paymentPlaceholderAmount ?? ''));
    setPaymentPlaceholderName(String(d.paymentPlaceholderName ?? ''));
    setPaymentPlaceholderPhone(String(d.paymentPlaceholderPhone ?? ''));
    setPaymentPlaceholderEmail(String(d.paymentPlaceholderEmail ?? ''));
    setPaymentPlaceholderNote(String(d.paymentPlaceholderNote ?? ''));
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

  const updateGroupHeading = (i: number, heading: string) =>
    setServiceLinks((p) => { const n = [...p]; n[i] = { ...n[i], heading }; return n; });

  const deleteGroup = (i: number) =>
    setServiceLinks((p) => p.filter((_, idx) => idx !== i));

  const addGroup = () =>
    setServiceLinks((p) => [...p, newGroup()]);

  const updateItem = (gi: number, ii: number, field: 'label' | 'to', val: string) =>
    setServiceLinks((p) => {
      const n = [...p];
      const items = [...n[gi].items];
      items[ii] = { ...items[ii], [field]: val };
      n[gi] = { ...n[gi], items };
      return n;
    });

  const addItem = (gi: number) =>
    setServiceLinks((p) => {
      const n = [...p];
      n[gi] = { ...n[gi], items: [...n[gi].items, newLink()] };
      return n;
    });

  const deleteItem = (gi: number, ii: number) =>
    setServiceLinks((p) => {
      const n = [...p];
      n[gi] = { ...n[gi], items: n[gi].items.filter((_, idx) => idx !== ii) };
      return n;
    });

  const reorderItems = (gi: number, items: FooterLink[]) =>
    setServiceLinks((p) => { const n = [...p]; n[gi] = { ...n[gi], items }; return n; });

  const updatePolicy = (i: number, field: 'label' | 'to', val: string) =>
    setPolicyLinks((p) => { const n = [...p]; n[i] = { ...n[i], [field]: val }; return n; });

  const addPolicy = () => setPolicyLinks((p) => [...p, newLink()]);

  const deletePolicy = (i: number) =>
    setPolicyLinks((p) => p.filter((_, idx) => idx !== i));

  const updateQuickTool = (i: number, field: 'label' | 'to', val: string) =>
    setQuickTools((p) => { const n = [...p]; n[i] = { ...n[i], [field]: val }; return n; });

  const addQuickTool = () => setQuickTools((p) => [...p, newLink()]);

  const deleteQuickTool = (i: number) =>
    setQuickTools((p) => p.filter((_, idx) => idx !== i));

  const toggleCollapse = (i: number) =>
    setCollapsed((c) => ({ ...c, [i]: !c[i] }));

  const handleSave = () => {
    onSave({
      tagline,
      logoAlt,
      contactBlockHeading: contactBlockHeading.trim(),
      showBottomContactRow,
      quickToolsHeading,
      quickTools,
      paymentTitle,
      paymentFootnote,
      paymentPayButtonLabel,
      paymentSuccessTitle,
      paymentSuccessSub,
      paymentCheckoutBrandName: paymentCheckoutBrandName.trim() || undefined,
      paymentPlaceholderAmount: paymentPlaceholderAmount.trim() || undefined,
      paymentPlaceholderName: paymentPlaceholderName.trim() || undefined,
      paymentPlaceholderPhone: paymentPlaceholderPhone.trim() || undefined,
      paymentPlaceholderEmail: paymentPlaceholderEmail.trim() || undefined,
      paymentPlaceholderNote: paymentPlaceholderNote.trim() || undefined,
      copyrightLine,
      serviceLinks,
      policyLinks,
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-5 space-y-3">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-950 mb-1">Manage the whole footer here — except live contact data</p>
            <p className="text-sm text-blue-900/90 leading-relaxed">
              <strong>Phone, email, and address</strong> always come from <strong>Site-wide → Contact info</strong> (not this screen).
              You can still set an optional <strong>heading</strong> above those lines (e.g. “Contact Us”) below.
            </p>
          </div>
        </div>
        <ul className="text-sm text-blue-900/85 list-disc pl-9 space-y-1">
          <li>Brand: tagline, logo alt, optional contact heading</li>
          <li>Service columns: headings + links (mega-menu style blocks)</li>
          <li>Quick tools: heading + shortcut links</li>
          <li>Payment widget: titles, button, success text, form placeholders, checkout name</li>
          <li>Policy &amp; legal row + copyright + optional bottom contact repeat</li>
        </ul>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          To change <strong>phone, email, or address</strong>, open <strong>Contact info</strong> in the sidebar. Values update everywhere, including the footer.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">1 · Brand column</h2>
        <p className="text-xs text-gray-400">Logo file is <code className="bg-gray-100 px-1 rounded">/public/assets/logo.png</code> — replace on the server to change the image.</p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
          <textarea
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Logo alt text (accessibility)</label>
          <input
            value={logoAlt}
            onChange={(e) => setLogoAlt(e.target.value)}
            placeholder="e.g. Mridhuv Associates"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Heading above phone &amp; email (optional)</label>
          <input
            value={contactBlockHeading}
            onChange={(e) => setContactBlockHeading(e.target.value)}
            placeholder="e.g. Contact Us"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Leave empty to hide. Phone, email, and address still come from Contact info.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showBottomContactRow}
            onChange={(e) => setShowBottomContactRow(e.target.checked)}
            className="rounded border-gray-300"
          />
          Show email &amp; phone again in the bottom bar (same values as Contact info)
        </label>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">2 · Service link columns</h2>
            <p className="text-xs text-gray-400 mt-0.5">Headings and links in the middle of the footer (e.g. Form New Business, Registrations).</p>
          </div>
          <button
            onClick={addGroup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" /> Add Section
          </button>
        </div>

        <SortableList
          items={serviceLinks}
          onReorder={setServiceLinks}
          getItemId={(g, i) => `grp-${i}-${g.heading}`}
          renderItem={(g, gi) => (
            <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />
                <input
                  value={g.heading}
                  onChange={(e) => updateGroupHeading(gi, e.target.value)}
                  placeholder="Section heading"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
                <button
                  onClick={() => toggleCollapse(gi)}
                  className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title={collapsed[gi] ? 'Expand' : 'Collapse'}
                >
                  {collapsed[gi] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteGroup(gi)}
                  className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {!collapsed[gi] && (
                <div className="p-4 space-y-3">
                  <SortableList
                    items={g.items}
                    onReorder={(items) => reorderItems(gi, items)}
                    getItemId={(item, ii) => `${gi}-item-${ii}-${item.label}`}
                    renderItem={(item, ii) => (
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 cursor-grab" />
                        <input
                          value={item.label}
                          onChange={(e) => updateItem(gi, ii, 'label', e.target.value)}
                          placeholder="Link label"
                          className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm focus:border-blue-400"
                        />
                        <input
                          value={item.to}
                          onChange={(e) => updateItem(gi, ii, 'to', e.target.value)}
                          placeholder="/path"
                          className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-500 focus:border-blue-400"
                        />
                        <button
                          onClick={() => deleteItem(gi, ii)}
                          className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  />
                  <button
                    onClick={() => addItem(gi)}
                    className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 font-medium mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add link
                  </button>
                </div>
              )}
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">3 · Quick tools</h2>
            <p className="text-xs text-gray-400 mt-0.5">Shortcut links under the contact block (e.g. Business Search).</p>
          </div>
          <button
            onClick={addQuickTool}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" /> Add link
          </button>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Section heading</label>
          <input
            value={quickToolsHeading}
            onChange={(e) => setQuickToolsHeading(e.target.value)}
            placeholder="Quick Tools"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <SortableList
          items={quickTools}
          onReorder={setQuickTools}
          getItemId={(item, i) => `qt-${i}-${item.to}`}
          renderItem={(item, i) => (
            <div className="flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 cursor-grab" />
              <input
                value={item.label}
                onChange={(e) => updateQuickTool(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm"
              />
              <input
                value={item.to}
                onChange={(e) => updateQuickTool(i, 'to', e.target.value)}
                placeholder="/path"
                className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-500"
              />
              <button onClick={() => deleteQuickTool(i)} className="p-1.5 rounded text-red-400 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">4 · Make a payment column</h2>
        <p className="text-xs text-gray-400">Titles, Razorpay checkout name, form placeholders, and success messages.</p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Checkout / modal business name</label>
          <input
            value={paymentCheckoutBrandName}
            onChange={(e) => setPaymentCheckoutBrandName(e.target.value)}
            placeholder="Mridhuv Associates"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Column title</label>
            <input value={paymentTitle} onChange={(e) => setPaymentTitle(e.target.value)} placeholder="Make a Payment" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pay button label</label>
            <input value={paymentPayButtonLabel} onChange={(e) => setPaymentPayButtonLabel(e.target.value)} placeholder="Pay Now" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Trust line (below button)</label>
          <input value={paymentFootnote} onChange={(e) => setPaymentFootnote(e.target.value)} placeholder="Secured by Razorpay…" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Success — title</label>
            <input value={paymentSuccessTitle} onChange={(e) => setPaymentSuccessTitle(e.target.value)} placeholder="Payment successful!" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Success — subtitle</label>
            <input value={paymentSuccessSub} onChange={(e) => setPaymentSuccessSub(e.target.value)} placeholder="You'll receive a confirmation…" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">Form placeholders</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Amount field</label>
            <input value={paymentPlaceholderAmount} onChange={(e) => setPaymentPlaceholderAmount(e.target.value)} placeholder="Amount (₹)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name field</label>
            <input value={paymentPlaceholderName} onChange={(e) => setPaymentPlaceholderName(e.target.value)} placeholder="Your name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone field</label>
            <input value={paymentPlaceholderPhone} onChange={(e) => setPaymentPlaceholderPhone(e.target.value)} placeholder="Phone number" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email field</label>
            <input value={paymentPlaceholderEmail} onChange={(e) => setPaymentPlaceholderEmail(e.target.value)} placeholder="Email (optional…)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Note / reference field</label>
            <input value={paymentPlaceholderNote} onChange={(e) => setPaymentPlaceholderNote(e.target.value)} placeholder="Payment note…" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">5 · Policy &amp; legal links</h2>
            <p className="text-xs text-gray-400 mt-0.5">Privacy, Terms, Refund, About, Contact link, etc. Drag to reorder.</p>
          </div>
          <button
            onClick={addPolicy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" /> Add Link
          </button>
        </div>
        <SortableList
          items={policyLinks}
          onReorder={setPolicyLinks}
          getItemId={(item, i) => `policy-${i}-${item.label}`}
          renderItem={(item, i) => (
            <div className="flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 cursor-grab" />
              <input
                value={item.label}
                onChange={(e) => updatePolicy(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400"
              />
              <input
                value={item.to}
                onChange={(e) => updatePolicy(i, 'to', e.target.value)}
                placeholder="/privacy-policy"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 focus:border-blue-400"
              />
              <button
                onClick={() => deletePolicy(i)}
                className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">6 · Copyright row</h2>
        <p className="text-xs text-gray-400">
          Use <code className="bg-gray-100 px-1 rounded">{'{{year}}'}</code> for the current year. Toggle “bottom contact row” in section 1 if you want to hide the duplicate email/phone on the right.
        </p>
        <input
          value={copyrightLine}
          onChange={(e) => setCopyrightLine(e.target.value)}
          placeholder="© {{year}} Mridhuv Associates. All rights reserved."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Footer'}
      </button>
    </div>
  );
}
