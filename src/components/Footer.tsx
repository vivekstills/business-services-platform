import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Search, FileText } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const TOOL_LINKS = [
  { label: 'Business Search', to: '/business-search', icon: <Search className="w-3.5 h-3.5" /> },
  { label: 'Trademark Search', to: '/trademark-search', icon: <FileText className="w-3.5 h-3.5" /> },
];

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;
  const contact = content.contact;
  return (
    <footer className="relative bg-[#0f172a] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/[0.06] to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-indigo-500/[0.05] to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
      </div>
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand + Contact */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-5 group">
              <span className="inline-flex items-center justify-center rounded-xl bg-slate-800/60 ring-1 ring-slate-600/50 p-3 transition-all group-hover:bg-slate-700/60 group-hover:ring-slate-500/50">
                <img src="/assets/logo.png" alt="Mridhuv Associates" className="h-9 w-auto max-w-[160px] object-contain" />
              </span>
            </Link>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-6">
              {footer.tagline}
            </p>
            <div className="space-y-2.5">
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors break-all">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {contact.email}
              </a>
              <div className="flex items-start gap-2.5 text-[13px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" /> {footer.address || contact.address}
              </div>
            </div>

            {/* Business Search & Trademark Search */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Tools</h4>
              <div className="flex flex-wrap gap-2">
                {TOOL_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-blue-600 text-white text-[12px] font-medium transition-colors"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Service columns */}
          {footer.serviceLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Policy links row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-6 border-t border-slate-700/50">
          {footer.policyLinks.map((item) => (
            <Link key={item.to} to={item.to} className="text-[12px] text-slate-400 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/50 pt-8">
          <p className="text-[12px] text-slate-400">
            &copy; {new Date().getFullYear()} Mridhuv Associates. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-slate-400">
            <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{contact.phone}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
