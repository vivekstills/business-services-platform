import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Tag, Calendar, User, Mail, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Service } from '../data/services';

type Props = {
  service: Service | null;
};

export default function ServiceDetail({ service }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!service) {
    return null;
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // This is where you can integrate your own backend/CRM.
    // For example, replace the console.log with a real API call:
    // await fetch('/api/leads', { method: 'POST', body: JSON.stringify({ ...formData, serviceId: service.id }) })
    console.log('New service enquiry', {
      ...formData,
      serviceId: service.id,
      serviceName: service.name
    });

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <section className="bg-[#0A0B0D] pt-32 pb-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="flex-1 max-w-[680px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666] mb-6 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 3–5 min read
                </span>
                <span className="w-1 h-1 rounded-full bg-[#333333]" />
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {service.mainHead}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#333333]" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Updated Feb 2026
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white leading-[1.15] tracking-tight mb-3">
                {service.name}
              </h1>

              {service.shortDescription && (
                <p className="text-lg text-[#A0A0A0] leading-relaxed font-light">
                  {service.shortDescription}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-8"
            >
              <div className="text-[calc(16px+1.5pt)] leading-[1.7] text-[#A0A0A0] whitespace-pre-line">
                {service.content}
              </div>

              {service.packages.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
                    Package Details
                  </h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    {service.packages.map((pkg) => (
                      <div
                        key={pkg.name}
                        className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-5"
                      >
                        <div className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-1">
                          {pkg.name} Plan
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          {pkg.price}
                        </div>
                        <p className="text-sm text-[#A0A0A0] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar: Lead Form */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="sticky top-32">
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Start this service
                </h4>
                <p className="text-sm text-[#9CA3AF]">
                  Share your details and our team will contact you with the next steps for{' '}
                  <span className="font-medium text-white">{service.name}</span>.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-6 space-y-5"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-[calc(13px+1.5pt)] font-medium text-[#E5E7EB]">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User
                        className={`w-4 h-4 transition-colors ${
                          errors.name ? 'text-[#FCA5A5]' : 'text-[#6B7280]'
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full h-[44px] bg-[#030712] border rounded-md pl-9 pr-3 text-[calc(14px+1.5pt)] text-white placeholder-[#6B7280] focus:outline-none transition-all duration-200 ${
                        errors.name
                          ? 'border-[#FCA5A5] focus:border-[#FCA5A5]'
                          : 'border-[#1F2937] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/40'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="w-4 h-4 text-[#FCA5A5]" />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-[calc(11px+1.5pt)] text-[#FCA5A5] mt-0.5">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[calc(13px+1.5pt)] font-medium text-[#E5E7EB]">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail
                        className={`w-4 h-4 transition-colors ${
                          errors.email ? 'text-[#FCA5A5]' : 'text-[#6B7280]'
                        }`}
                      />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full h-[44px] bg-[#030712] border rounded-md pl-9 pr-3 text-[calc(14px+1.5pt)] text-white placeholder-[#6B7280] focus:outline-none transition-all duration-200 ${
                        errors.email
                          ? 'border-[#FCA5A5] focus:border-[#FCA5A5]'
                          : 'border-[#1F2937] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/40'
                      }`}
                      placeholder="you@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[calc(11px+1.5pt)] text-[#FCA5A5] mt-0.5">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-[calc(13px+1.5pt)] font-medium text-[#E5E7EB]">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone
                        className={`w-4 h-4 transition-colors ${
                          errors.phone ? 'text-[#FCA5A5]' : 'text-[#6B7280]'
                        }`}
                      />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full h-[44px] bg-[#030712] border rounded-md pl-9 pr-3 text-[calc(14px+1.5pt)] text-white placeholder-[#6B7280] focus:outline-none transition-all duration-200 ${
                        errors.phone
                          ? 'border-[#FCA5A5] focus:border-[#FCA5A5]'
                          : 'border-[#1F2937] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/40'
                      }`}
                      placeholder="Your contact number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[calc(11px+1.5pt)] text-[#FCA5A5] mt-0.5">{errors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-[44px] mt-2 bg-white text-black text-[calc(14px+1.5pt)] font-semibold rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Details sent
                    </>
                  ) : (
                    <>Submit enquiry</>
                  )}
                </button>

                <p className="text-[calc(11px+1.5pt)] text-[#6B7280] mt-1">
                  By submitting, you agree to be contacted by our team regarding{' '}
                  <span className="text-[#E5E7EB]">{service.name}</span>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

