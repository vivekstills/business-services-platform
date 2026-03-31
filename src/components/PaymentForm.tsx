import React from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle, IndianRupee, Lock } from 'lucide-react';

let rzpLoaded = false;
function loadRzp(): Promise<void> {
  if (rzpLoaded && (window as any).Razorpay) return Promise.resolve();
  if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
    rzpLoaded = true;
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      rzpLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
}

type PaymentPlaceholders = { amount: string; name: string; phone: string; email: string; note: string };

type Props = {
  footnote: string;
  payButtonLabel: string;
  successTitle: string;
  successSub: string;
  checkoutBrandName: string;
  placeholders: PaymentPlaceholders;
};

export default function PaymentForm({
  footnote,
  payButtonLabel,
  successTitle,
  successSub,
  checkoutBrandName,
  placeholders,
}: Props) {
  const [amount, setAmount] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [note, setNote] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const onPay = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 1) return setError('Enter a valid amount');
    if (!name.trim()) return setError('Enter your name');
    if (phone.replace(/\D/g, '').length < 10) return setError('Enter a valid phone number');

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await loadRzp();

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          serviceId: 'payment-page',
          serviceName: 'Payment Page',
          packageName: 'Custom Amount',
          amount: Math.round(amt * 100),
          note: note.trim(),
        }),
      });
      if (!orderRes.ok) throw new Error('Unable to create payment order');

      const { razorpayOrderId, keyId } = await orderRes.json();
      const RazorpayCtor = (window as any).Razorpay;
      const rzp = new RazorpayCtor({
        key: keyId,
        amount: Math.round(amt * 100),
        currency: 'INR',
        order_id: razorpayOrderId,
        name: checkoutBrandName || 'Mridhuv Associates',
        description: 'Custom payment',
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme: { color: '#2563EB' },
        handler: () => {
          setSuccess(true);
          setAmount('');
          setName('');
          setPhone('');
          setEmail('');
          setNote('');
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-lg">
      <div className="grid grid-cols-1 gap-3">
        <div className="relative">
          <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="1"
            placeholder={placeholders.amount}
            className="w-full h-12 rounded-xl border border-gray-200 bg-slate-50 pl-10 pr-4 text-[calc(13px+3pt)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholders.name}
          className="w-full h-12 rounded-xl border border-gray-200 bg-slate-50 px-4 text-[calc(13px+3pt)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={placeholders.phone}
          className="w-full h-12 rounded-xl border border-gray-200 bg-slate-50 px-4 text-[calc(13px+3pt)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholders.email}
          className="w-full h-12 rounded-xl border border-gray-200 bg-slate-50 px-4 text-[calc(13px+3pt)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={placeholders.note}
          className="w-full h-12 rounded-xl border border-gray-200 bg-slate-50 px-4 text-[calc(13px+3pt)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-[calc(12px+3pt)]">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="mt-3 flex items-center gap-2 text-emerald-600 text-[calc(12px+3pt)]">
          <CheckCircle2 className="w-4 h-4" /> {successTitle} {successSub}
        </div>
      )}

      <button
        type="button"
        onClick={onPay}
        disabled={loading}
        className="mt-4 w-full h-12 rounded-xl bg-blue-600 text-white text-[calc(13px+3pt)] font-semibold hover:bg-blue-700 hover:scale-[1.02] disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
        {loading ? 'Processing...' : payButtonLabel}
      </button>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[calc(11px+3pt)] text-gray-600">
        <Lock className="w-3.5 h-3.5" />
        <p>{footnote}</p>
      </div>
    </div>
  );
}
