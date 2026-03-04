import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MessageSquare, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const SERVICES_LIST = [
  'GST Registration', 'Private Limited Company', 'LLP Formation', 'Trademark Registration',
  'FSSAI Registration', 'Import Export Code', 'ITR Filing', 'TDS Return', 'Other',
];

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())  e.name  = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    if (!formData.service)      e.service = 'Please select a service';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, serviceId: 'general', serviceName: formData.service }),
      });
    } catch { /* best-effort */ }
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const field = (id: keyof typeof formData) => ({
    value: formData[id],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData((p) => ({ ...p, [id]: e.target.value })),
  });

  const inputCls = (key: string) =>
    `w-full h-[46px] bg-[#0A1020] border rounded-xl pl-10 pr-4 text-[14px] text-white placeholder-white/25 focus:outline-none transition-all ${
      errors[key]
        ? 'border-red-500/60 focus:border-red-500'
        : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
    }`;

  return (
    <section className="bg-[#060C18] py-24 lg:py-32 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4"
            >
              Get in Touch
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
            >
              Let's get your business started
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-[15px] leading-relaxed mb-10"
            >
              Fill out the form and our team will reach out within 24 business hours with a personalised plan for your requirements.
            </motion.p>

            {/* Info blocks */}
            <div className="space-y-5">
              {[
                { label: 'Expert consultation', desc: 'Talk to a specialist who understands your industry.' },
                { label: 'Fast turnaround',     desc: 'Most services completed within 7–10 working days.' },
                { label: 'Fixed pricing',        desc: 'No hidden fees — you know the cost upfront.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-white">{item.label}</div>
                    <div className="text-[13px] text-white/40">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-2">Full Name *</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-red-400' : 'text-white/25'}`} />
                  <input {...field('name')} className={inputCls('name')} placeholder="Your full name" />
                  {errors.name && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />}
                </div>
                {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email + Phone — 2 col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-2">Email *</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-white/25'}`} />
                    <input {...field('email')} type="email" className={inputCls('email')} placeholder="you@email.com" />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-2">Phone *</label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.phone ? 'text-red-400' : 'text-white/25'}`} />
                    <input {...field('phone')} type="tel" className={inputCls('phone')} placeholder="+91 98765 43210" />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-2">Service Required *</label>
                <select
                  {...field('service')}
                  className={`w-full h-[46px] bg-[#0A1020] border rounded-xl px-4 text-[14px] text-white focus:outline-none transition-all appearance-none cursor-pointer ${
                    errors.service ? 'border-red-500/60' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
                  }`}
                >
                  <option value="" className="bg-[#0A1020]">Select a service…</option>
                  {SERVICES_LIST.map((s) => (
                    <option key={s} value={s} className="bg-[#0A1020]">{s}</option>
                  ))}
                </select>
                {errors.service && <p className="text-[11px] text-red-400 mt-1">{errors.service}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-2">Message (optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-white/25" />
                  <textarea
                    {...field('message')}
                    rows={3}
                    className="w-full bg-[#0A1020] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
                    placeholder="Tell us more about your requirements…"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_28px_rgba(99,102,241,0.4)] hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Sending…</>
                ) : isSubmitted ? (
                  <><CheckCircle2 className="w-4 h-4" /> Message sent — we'll be in touch!</>
                ) : (
                  <>Send Message <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
