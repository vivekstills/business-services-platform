import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getNavCategoryBySlug, getServiceBySlug } from '../data/servicesData';

export default function ServiceFormPage() {
  const { category, service } = useParams();
  const navCategory = getNavCategoryBySlug(category);
  const data = getServiceBySlug(service);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    businessType: '',
    message: '',
    file: null as File | null,
  });

  if (!navCategory || !data || data.categoryId !== navCategory.categoryId) {
    return <Navigate to="/services/registration" replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setDone(false);
    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          businessType: form.businessType,
          message: form.message,
          fileName: form.file?.name || '',
          serviceId: data.id,
          serviceName: data.name,
        }),
      });
      setDone(true);
      setForm({ name: '', phone: '', email: '', businessType: '', message: '', file: null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen pt-16 bg-transparent">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name} - Enquiry Form</h1>
        <p className="text-gray-500 mb-8">Share your details and our team will contact you shortly.</p>

        <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="w-full h-11 rounded-xl border border-gray-200 bg-slate-50 px-4" />
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="w-full h-11 rounded-xl border border-gray-200 bg-slate-50 px-4" />
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full h-11 rounded-xl border border-gray-200 bg-slate-50 px-4" />
          <input value={form.businessType} onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))} placeholder="Business Type" className="w-full h-11 rounded-xl border border-gray-200 bg-slate-50 px-4" />
          <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Message" rows={4} className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3" />
          <input type="file" onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))} className="w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
          <button disabled={submitting} className="h-11 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          {done && <p className="text-emerald-600 text-sm">Thanks! Your form has been submitted.</p>}
        </form>
      </div>
    </section>
  );
}
