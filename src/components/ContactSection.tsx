import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, MessageSquare, AlertCircle, CheckCircle2, ArrowRight, Clock, BadgeCheck, Wallet, MapPin } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function ContactSection() {
  const { content } = useContent();
  const cs = content.contactSection;
  const SERVICES_LIST = useMemo(() => {
    const names = content.services.map((service) => service.name?.trim()).filter(Boolean) as string[];
    const uniqueOrdered = Array.from(new Set(names));
    return uniqueOrdered.length > 0 ? uniqueOrdered : cs.servicesList;
  }, [content.services, cs.servicesList]);
  const [formData, setFormData]     = useState({ name: '', phone: '', service: '', city: '', message: '', email: '' });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())  e.name  = 'Name is required';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    if (!formData.service)      e.service = 'Please select a service';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = { ...formData, serviceId: 'general', serviceName: formData.service };
      console.log('[ContactSection] submitting enquiry', payload);
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[ContactSection] enquiry response', { ok: response.ok, status: response.status });
      if (response.ok) {
        alert('Form submitted successfully');
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', service: '', city: '', message: '', email: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setSubmitError('Submission failed. Please try again.');
        alert('Submission failed');
      }
    } catch (error) {
      console.error('[ContactSection] enquiry submission failed', error);
      setSubmitError('Submission failed. Please try again.');
      alert('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (id: keyof typeof formData) => ({
    value: formData[id],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData((p) => ({ ...p, [id]: e.target.value })),
  });

  const inputCls = (key: string) =>
    `w-full h-[42px] bg-white border rounded-xl pl-10 pr-4 text-xs sm:text-[calc(14px+3pt)] text-gray-800 placeholder-gray-300 focus:outline-none transition-all shadow-sm ${
      errors[key]
        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <section className="relative bg-transparent py-5 sm:py-12 overflow-hidden noise-overlay">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-t from-blue-100/25 to-transparent rounded-full blur-[130px] animate-float-glow-slow" />
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-bl from-indigo-100/20 to-transparent rounded-full blur-[100px] animate-float-glow" />
        <div className="absolute inset-0 dot-grid" />
      </div>
      <div className="relative z-[2] max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 lg:gap-16 items-start">

          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4"
            >
              {cs.label}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3 sm:mb-4"
            >
              {cs.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xs sm:text-[calc(15px+3pt)] leading-relaxed mb-5 sm:mb-10"
            >
              {cs.subheading}
            </motion.p>

            <div className="flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0 lg:space-y-5">
              {cs.features.map((item, i) => {
                const icons = [<BadgeCheck className="w-4 h-4 text-blue-600" key="b" />, <Clock className="w-4 h-4 text-blue-600" key="c" />, <Wallet className="w-4 h-4 text-blue-600" key="w" />];
                return (
                <div key={i} className="card-hover-warm snap-start shrink-0 basis-[75%] [@media(max-width:379px)]:basis-[88%] lg:basis-auto lg:shrink h-[92px] flex items-start gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100/80 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    {icons[i] ?? icons[0]}
                  </div>
                  <div>
                    <div className="text-xs sm:text-[calc(14px+3pt)] font-semibold text-gray-800 line-clamp-1 break-words">{item.label}</div>
                    <div className="text-[11px] sm:text-[calc(13px+3pt)] text-gray-500 mt-0.5 line-clamp-2 break-words">{item.desc}</div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-white/60 ring-1 ring-gray-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-8 shadow-sm sm:shadow-2xl sm:shadow-blue-100/20"
          >
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-red-400' : 'text-gray-300'}`} />
                  <input {...field('name')} className={inputCls('name')} placeholder="Your full name" />
                  {errors.name && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />}
                </div>
                {errors.name && <p className="text-[calc(11px+3pt)] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone *</label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.phone ? 'text-red-400' : 'text-gray-300'}`} />
                  <input {...field('phone')} type="tel" className={inputCls('phone')} placeholder="+91 98765 43210" />
                </div>
                {errors.phone && <p className="text-[calc(11px+3pt)] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-2">Service Required *</label>
                <select
                  {...field('service')}
                  className={`w-full h-[42px] bg-white border rounded-xl px-4 text-xs sm:text-[calc(14px+3pt)] text-gray-700 focus:outline-none transition-all appearance-none cursor-pointer shadow-sm ${
                    errors.service ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                  }`}
                >
                  <option value="">Select a service…</option>
                  {SERVICES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="text-[calc(11px+3pt)] text-red-500 mt-1">{errors.service}</p>}
              </div>

              <div>
                <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input {...field('city')} className={inputCls('city')} placeholder="Your city" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-2">Message (optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                  <textarea
                    {...field('message')}
                    rows={3}
                    className="w-full h-[80px] bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-[calc(14px+3pt)] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-sm"
                    placeholder="Tell us more about your requirements…"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 text-white text-[calc(14px+3pt)] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Sending…</>
                ) : isSubmitted ? (
                  <><CheckCircle2 className="w-4 h-4" /> Sent — we'll be in touch!</>
                ) : (
                  <>Send Message <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {isSubmitted && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[calc(12.5px+3pt)] text-emerald-700">
                    Thank you! Our team will reach out within 24 business hours.
                  </span>
                </div>
              )}
              {submitError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[calc(12.5px+3pt)] text-red-700">{submitError}</span>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
