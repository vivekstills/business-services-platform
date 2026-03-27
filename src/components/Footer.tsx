import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Search, FileText, CreditCard, Loader2, CheckCircle2, AlertCircle, IndianRupee, Link2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const DEFAULT_QUICK_TOOLS = [
  { label: 'Business Search', to: '/business-search' },
  { label: 'Trademark Search', to: '/trademark-search' },
];

function quickToolIcon(to: string) {
  const t = to.toLowerCase();
  if (t.includes('business-search')) return <Search className="w-4 h-4" />;
  if (t.includes('trademark')) return <FileText className="w-4 h-4" />;
  return <Link2 className="w-4 h-4" />;
}

/* ── Razorpay helpers ─────────────────────────────── */
declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}
let _rzpLoaded = false;
function loadRzp(): Promise<void> {
  if (_rzpLoaded && window.Razorpay) return Promise.resolve();
  if (document.querySelector('script[src*="checkout.razorpay.com"]')) { _rzpLoaded = true; return Promise.resolve(); }
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => { _rzpLoaded = true; res(); };
    s.onerror = () => rej(new Error('Failed to load Razorpay'));
    document.head.appendChild(s);
  });
}

type PayPlaceholders = {
  amount: string;
  name: string;
  phone: string;
  email: string;
  note: string;
};

type PayWidgetProps = {
  footnote: string;
  payButtonLabel: string;
  successTitle: string;
  successSub: string;
  checkoutBrandName: string;
  placeholders: PayPlaceholders;
};

/* ── Custom Payment Widget ────────────────────────── */
function PayWidget({
  footnote,
  payButtonLabel,
  successTitle,
  successSub,
  checkoutBrandName,
  placeholders,
}: PayWidgetProps) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handlePay = useCallback(async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 1) { setErrMsg('Please enter a valid amount (min ₹1).'); setStatus('error'); return; }
    if (!name.trim()) { setErrMsg('Please enter your name.'); setStatus('error'); return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) { setErrMsg('Please enter a valid 10-digit phone number.'); setStatus('error'); return; }

    setStatus('loading');
    setErrMsg('');

    try {
      await loadRzp();

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || '',
          serviceId: 'custom-payment',
          serviceName: note.trim() || 'Custom Payment',
          packageName: 'Custom Amount',
          amount: Math.round(amt * 100),
        }),
      });

      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Order creation failed'); }

      const { razorpayOrderId, keyId } = await res.json();

      const rzp = new window.Razorpay({
        key: keyId,
        amount: Math.round(amt * 100),
        currency: 'INR',
        order_id: razorpayOrderId,
        name: checkoutBrandName,
        description: note.trim() || 'Custom Payment',
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme: { color: '#2563EB' },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            }),
          });
          setStatus('success');
          setAmount(''); setName(''); setPhone(''); setEmail(''); setNote('');
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });

      rzp.open();
      setStatus('idle');
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : 'Payment failed. Please try again.');
      setStatus('error');
    }
  }, [amount, name, phone, email, note, checkoutBrandName]);

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
        <p className="text-[calc(15px+3pt)] text-slate-200 font-semibold">{successTitle}</p>
        <p className="text-[calc(13px+3pt)] text-slate-400">{successSub}</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-2 text-[calc(13px+3pt)] text-blue-400 hover:text-blue-300 underline">Make another payment</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setStatus('idle'); }}
          placeholder={placeholders.amount}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-white placeholder-slate-500 text-[calc(14px+3pt)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setStatus('idle'); }}
          placeholder={placeholders.name}
          className="px-3 py-2.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-white placeholder-slate-500 text-[calc(14px+3pt)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setStatus('idle'); }}
          placeholder={placeholders.phone}
          className="px-3 py-2.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-white placeholder-slate-500 text-[calc(14px+3pt)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
        placeholder={placeholders.email}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-white placeholder-slate-500 text-[calc(14px+3pt)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
      />

      <input
        value={note}
        onChange={(e) => { setNote(e.target.value); setStatus('idle'); }}
        placeholder={placeholders.note}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-white placeholder-slate-500 text-[calc(14px+3pt)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
      />

      {status === 'error' && errMsg && (
        <div className="flex items-center gap-2 text-red-400 text-[calc(13px+3pt)]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[calc(15px+3pt)] font-semibold transition-colors disabled:opacity-60"
      >
        {status === 'loading'
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          : <><CreditCard className="w-4 h-4" /> {payButtonLabel}</>}
      </button>

      <p className="text-[calc(13px+3pt)] text-slate-500 text-center">{footnote}</p>
    </div>
  );
}

function formatCopyright(line: string | undefined, year: number): string {
  const raw = (line && line.trim()) || '© {{year}} Mridhuv Associates. All rights reserved.';
  return raw.replace(/\{\{year\}\}/gi, String(year));
}

const footText = 'text-[calc(14px+3pt)]';
const footMuted = 'text-[calc(14px+3pt)] text-slate-400';
const footHeading = 'text-[calc(12px+3pt)] font-bold uppercase tracking-widest text-slate-500';

/* ── Footer ───────────────────────────────────────── */
export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;
  const contact = content.contact;

  const quickHeading = footer.quickToolsHeading?.trim() || 'Quick Tools';
  const quickItems = footer.quickTools && footer.quickTools.length > 0 ? footer.quickTools : DEFAULT_QUICK_TOOLS;
  const paymentTitle = footer.paymentTitle?.trim() || 'Make a Payment';
  const paymentFootnote = footer.paymentFootnote?.trim() || 'Secured by Razorpay · 256-bit SSL encryption';
  const payBtn = footer.paymentPayButtonLabel?.trim() || 'Pay Now';
  const successTitle = footer.paymentSuccessTitle?.trim() || 'Payment successful!';
  const successSub = footer.paymentSuccessSub?.trim() || "You'll receive a confirmation shortly.";
  const logoAlt = footer.logoAlt?.trim() || 'Mridhuv Associates';
  const displayAddress = contact.address || footer.address || '';
  const contactHeading = (footer.contactBlockHeading ?? '').trim();
  const showBottomContact = footer.showBottomContactRow !== false;
  const checkoutBrand = footer.paymentCheckoutBrandName?.trim() || 'Mridhuv Associates';
  const payPh = {
    amount: footer.paymentPlaceholderAmount?.trim() || 'Amount (₹)',
    name: footer.paymentPlaceholderName?.trim() || 'Your name',
    phone: footer.paymentPlaceholderPhone?.trim() || 'Phone number',
    email: footer.paymentPlaceholderEmail?.trim() || 'Email (optional, for receipt)',
    note: footer.paymentPlaceholderNote?.trim() || 'Payment note / reference (optional)',
  };

  const year = new Date().getFullYear();
  const copyrightText = formatCopyright(footer.copyrightLine, year);

  return (
    <footer className="relative bg-[#0f172a] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/[0.06] to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-indigo-500/[0.05] to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
      </div>

      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 sm:gap-10 mb-10 sm:mb-14">

          {/* Brand + contact block — phone/email/address always from Contact info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-5 group">
              <span className="inline-flex items-center justify-center rounded-xl bg-slate-800/60 ring-1 ring-slate-600/50 p-4 transition-all group-hover:bg-slate-700/60 group-hover:ring-slate-500/50">
                <img src="/assets/logo.png" alt={logoAlt} className="h-14 sm:h-16 w-auto max-w-[220px] object-contain" />
              </span>
            </Link>
            <p className={`${footMuted} leading-relaxed mb-6`}>{footer.tagline}</p>

            {contactHeading && (
              <h3 className={`${footHeading} mb-3 text-slate-400`}>{contactHeading}</h3>
            )}
            <div className="space-y-2.5">
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={`flex items-center gap-2.5 ${footMuted} hover:text-white transition-colors`}>
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className={`flex items-center gap-2.5 ${footMuted} hover:text-white transition-colors break-all`}>
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" /> {contact.email}
              </a>
              {displayAddress && (
                <div className={`flex items-start gap-2.5 ${footMuted}`}>
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> {displayAddress}
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <h4 className={`${footHeading} mb-3`}>{quickHeading}</h4>
              <div className="flex flex-wrap gap-2">
                {quickItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-blue-600 hover:text-white ${footText} font-medium transition-colors`}
                  >
                    {quickToolIcon(item.to)} {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {footer.serviceLinks.map((col) => (
            <div key={col.heading}>
              <h4 className={`${footHeading} mb-4`}>{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={`${footMuted} hover:text-white transition-colors`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className={`${footHeading} mb-4 flex items-center gap-1.5`}>
              <CreditCard className="w-4 h-4 text-blue-400" /> {paymentTitle}
            </h4>
            <PayWidget
              footnote={paymentFootnote}
              payButtonLabel={payBtn}
              successTitle={successTitle}
              successSub={successSub}
              checkoutBrandName={checkoutBrand}
              placeholders={payPh}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-6 border-t border-slate-700/50">
          {footer.policyLinks.map((item) => (
            <Link key={item.to} to={item.to} className="text-[calc(13px+3pt)] text-slate-400 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/50 pt-6 sm:pt-8">
          <p className="text-[calc(13px+3pt)] text-slate-400 text-center sm:text-left">
            {copyrightText}
          </p>
          {showBottomContact && (
            <div className="flex items-center gap-4 text-[calc(13px+3pt)] text-slate-400">
              <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{contact.phone}</a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
