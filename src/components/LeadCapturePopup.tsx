import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useIntentDetector, trackAnalytics, LEAD_SUBMITTED_KEY } from '../hooks/useIntentDetector';

type FormData = {
  name: string;
  phone: string;
  email: string;
  service: string;
};

const TRIGGER_MESSAGES: Record<string, string> = {
  time_on_page:
    "I noticed you've been exploring this service. Need help understanding the process or pricing? Our expert can assist you!",
  scroll_depth:
    "Looks like you're interested! Want us to walk you through the next steps? Enter your details and we'll reach out.",
  pricing_click:
    "Interested in our pricing? Let us give you a personalised quote. Share your details and we'll call you right away!",
  exit_intent:
    "Before you leave — get GST filing assistance in minutes. Our expert can help you with registration, returns, and compliance.",
};

const DEFAULT_MESSAGE =
  "Need help with GST filing? Our expert can assist you. Enter your phone number and we will contact you.";

export default function LeadCapturePopup() {
  const { shouldShowPopup, triggerReason, serviceName, timeOnPage, dismiss, isGstPage } =
    useIntentDetector();

  const [show, setShow] = useState(false);
  const [step, setStep] = useState<'chat' | 'form' | 'success'>('chat');
  const [form, setForm] = useState<FormData>({ name: '', phone: '', email: '', service: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldShowPopup) {
      setShow(true);
      setStep('chat');
      setForm((f) => ({
        ...f,
        service: serviceName || (isGstPage ? 'GST Services' : ''),
      }));
    }
  }, [shouldShowPopup, serviceName, isGstPage]);

  const handleClose = () => {
    setShow(false);
    dismiss();
  };

  const handleProceed = () => {
    setStep('form');
    setTimeout(() => phoneRef.current?.focus(), 200);
  };

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

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          service: form.service.trim(),
          pageUrl: window.location.pathname,
          timeSpent: timeOnPage,
          triggerType: triggerReason,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      localStorage.setItem(LEAD_SUBMITTED_KEY, '1');
      trackAnalytics('lead_submitted', window.location.pathname, {
        service: form.service,
        triggerType: triggerReason,
      });
      setStep('success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const message = TRIGGER_MESSAGES[triggerReason ?? ''] ?? DEFAULT_MESSAGE;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-24 sm:right-6 z-[61] w-[380px] max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl shadow-gray-400/30 border border-gray-200 overflow-hidden max-h-[calc(100dvh-80px)] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-[calc(15px+3pt)] leading-tight">Need Help?</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-emerald-100 text-[calc(12px+3pt)]">Expert available now</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat step */}
            {step === 'chat' && (
              <div className="p-5 space-y-4">
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-[calc(14px+3pt)] text-gray-700 leading-relaxed">
                    {message}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleProceed}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-[calc(14px+3pt)] hover:bg-emerald-700 transition-colors"
                  >
                    Yes, I need help
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-[calc(14px+3pt)] hover:bg-gray-50 transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            )}

            {/* Form step */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="p-5 space-y-3">
                <div className="flex gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-[calc(13px+3pt)] text-gray-600 leading-relaxed">
                    Share your details and our expert will contact you shortly.
                  </div>
                </div>

                <div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name *"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+3pt)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
                <div>
                  <input
                    ref={phoneRef}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone number *"
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+3pt)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
                <div>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Email (optional)"
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+3pt)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
                <div>
                  <input
                    value={form.service}
                    onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                    placeholder="Service interested in"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[calc(14px+3pt)] bg-gray-50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[calc(13px+3pt)]">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-[calc(14px+3pt)] hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? 'Submitting…' : 'Get Expert Help'}
                </button>

                <p className="text-[calc(11px+3pt)] text-gray-400 text-center">
                  We'll contact you within 30 minutes during business hours.
                </p>
              </form>
            )}

            {/* Success step */}
            {step === 'success' && (
              <div className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Thank you!</h3>
                <p className="text-[calc(14px+3pt)] text-gray-500 leading-relaxed">
                  Our expert will contact you shortly about{' '}
                  <strong>{form.service || 'your enquiry'}</strong>. We typically respond within 30 minutes.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-2 px-6 py-2 rounded-xl border border-gray-200 text-gray-600 text-[calc(14px+3pt)] hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
