import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { formatAmount } from '../utils/price';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = { open: () => void };

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  serviceName: string;
  serviceId: string;
  packageName: string;
  amount: number; // in paise
  displayPrice: string;
};

let razorpayLoaded = false;
function loadRazorpayScript(): Promise<void> {
  if (razorpayLoaded && window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      razorpayLoaded = true;
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => {
      razorpayLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(s);
  });
}

export default function PaymentModal({
  open,
  onClose,
  serviceName,
  serviceId,
  packageName,
  amount,
  displayPrice,
}: Props) {
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);

  const resetAndClose = useCallback(() => {
    setStep('form');
    setForm({ name: '', phone: '', email: '' });
    setError('');
    setPaymentId('');
    onClose();
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required');
      return;
    }
    if (!/^\+?\d{10,13}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      setError('Enter a valid phone number');
      return;
    }

    setError('');
    setStep('processing');

    try {
      await loadRazorpayScript();

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          serviceId,
          serviceName,
          packageName,
          amount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create order');
      }

      const order = await res.json();

      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: 'Mridhuv Associates',
        description: `${serviceName} — ${packageName}`,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#2563EB' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) throw new Error('Verification failed');

            setPaymentId(response.razorpay_payment_id);
            setStep('success');
          } catch {
            setError('Payment verification failed. Please contact support.');
            setStep('error');
          }
        },
        modal: {
          ondismiss: () => {
            setStep('form');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-[2px]"
            onClick={resetAndClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-[10vh] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[71] w-auto sm:w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-[calc(15px+2pt)]">Pay securely</div>
                  <div className="text-blue-200 text-[calc(12px+2pt)]">{serviceName}</div>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Package info bar */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[calc(12px+2pt)] font-bold text-blue-600 uppercase tracking-wider">{packageName}</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{displayPrice}</div>
            </div>

            {/* Form step */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="p-6 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Your name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+2pt)] focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone number *</label>
                  <input
                    ref={phoneRef}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+2pt)] focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+2pt)] focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-[calc(13px+2pt)]">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-[calc(14px+2pt)] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay {displayPrice}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[calc(11px+2pt)] text-gray-400 pt-1">
                  <Shield className="w-3 h-3" />
                  Secured by Razorpay. 256-bit encrypted.
                </div>
              </form>
            )}

            {/* Processing step */}
            {step === 'processing' && (
              <div className="p-10 text-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <p className="text-[calc(14px+2pt)] text-gray-600">Preparing payment...</p>
                <p className="text-[calc(12px+2pt)] text-gray-400">Razorpay checkout will open shortly.</p>
              </div>
            )}

            {/* Success step */}
            {step === 'success' && (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Payment Successful!</h3>
                <p className="text-[calc(14px+2pt)] text-gray-500 leading-relaxed">
                  Your payment for <strong>{packageName}</strong> ({displayPrice}) has been received.
                  Our team will begin processing shortly.
                </p>
                {paymentId && (
                  <p className="text-[calc(12px+2pt)] text-gray-400">
                    Payment ID: <span className="font-mono">{paymentId}</span>
                  </p>
                )}
                <button
                  onClick={resetAndClose}
                  className="mt-3 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-[calc(14px+2pt)] hover:bg-emerald-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* Error step */}
            {step === 'error' && (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Payment Failed</h3>
                <p className="text-[calc(14px+2pt)] text-gray-500 leading-relaxed">{error || 'Something went wrong. Please try again.'}</p>
                <div className="flex gap-2 justify-center mt-3">
                  <button
                    onClick={() => { setStep('form'); setError(''); }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-[calc(14px+2pt)] hover:bg-blue-700 transition-colors"
                  >
                    Try again
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[calc(14px+2pt)] hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
