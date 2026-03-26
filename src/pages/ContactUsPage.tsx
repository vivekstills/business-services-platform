import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MessageSquare, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import PolicyLayout from '../components/PolicyLayout';
import { useContent } from '../context/ContentContext';

export default function ContactUsPage() {
  const { content } = useContent();
  const EMAIL = content.contact.email;
  const PHONE = content.contact.phone;
  const ADDRESS = content.contact.address;
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
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
        body: JSON.stringify({ ...formData, serviceId: 'contact', serviceName: 'Contact Us' }),
      });
    } catch { /* best-effort */ }
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const inputCls = (key: string) =>
    `w-full h-[46px] rounded-xl bg-white border px-4 text-[calc(14px+3pt)] text-gray-800 placeholder-gray-300 focus:outline-none transition-all ${
      errors[key] ? 'border-red-300' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <PolicyLayout title="Contact Us">
      <p className="text-gray-500 text-sm mb-10">We're here to help. Reach out anytime.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="space-y-4">
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-600" /></div>
              <div>
                <div className="text-[calc(11px+3pt)] font-bold uppercase tracking-wider text-gray-400">Email</div>
                <div className="font-semibold text-gray-900">{EMAIL}</div>
              </div>
            </a>
            <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Phone className="w-5 h-5 text-blue-600" /></div>
              <div>
                <div className="text-[calc(11px+3pt)] font-bold uppercase tracking-wider text-gray-400">Phone</div>
                <div className="font-semibold text-gray-900">{PHONE}</div>
              </div>
            </a>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-blue-600" /></div>
              <div>
                <div className="text-[calc(11px+3pt)] font-bold uppercase tracking-wider text-gray-400">Address</div>
                <div className="font-medium text-gray-800">{ADDRESS}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-red-400' : 'text-gray-300'}`} />
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`${inputCls('name')} pl-10`} placeholder="Your name" />
              </div>
              {errors.name && <p className="text-[calc(11px+3pt)] text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-gray-300'}`} />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`${inputCls('email')} pl-10`} placeholder="you@email.com" />
              </div>
              {errors.email && <p className="text-[calc(11px+3pt)] text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone *</label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.phone ? 'text-red-400' : 'text-gray-300'}`} />
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`${inputCls('phone')} pl-10`} placeholder="+91 98765 43210" />
              </div>
              {errors.phone && <p className="text-[calc(11px+3pt)] text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-[calc(12px+3pt)] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message (optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full rounded-xl bg-white border border-gray-200 pl-10 pr-4 py-3 text-[calc(14px+3pt)] text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" placeholder="How can we help?" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-60">
              {isSubmitting ? 'Sending…' : isSubmitted ? <><CheckCircle2 className="w-4 h-4" /> Sent!</> : <>Send Message <ArrowRight className="w-4 h-4" /></>}
            </button>
            {isSubmitted && <p className="text-[calc(13px+3pt)] text-emerald-600">Thank you! We'll get back to you within 24 hours.</p>}
          </form>
        </div>
      </div>
    </PolicyLayout>
  );
}
