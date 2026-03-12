import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Search, FileText } from 'lucide-react';

const FOOTER_EMAIL = 'enquiry@mridhuvassociates.com';
const FOOTER_PHONE = '+91 98765 43210';

const SERVICE_LINKS = [
  {
    heading: 'Form New Business',
    items: [
      { label: 'Private Limited Company', to: '/service/private-limited-company' },
      { label: 'LLP',                     to: '/service/llp' },
      { label: 'One Person Company',      to: '/service/one-person-company' },
      { label: 'Partnership',             to: '/service/partnership' },
      { label: 'Nidhi Company',           to: '/service/nidhi-company' },
    ],
  },
  {
    heading: 'Registrations',
    items: [
      { label: 'GST Registration',   to: '/service/gst-registration' },
      { label: 'FSSAI Registration', to: '/service/fssai-registration' },
      { label: 'Trade License',      to: '/service/trade-license' },
      { label: 'Import Export Code', to: '/service/import-export-code' },
      { label: 'Digital Signature',  to: '/service/digital-signature' },
    ],
  },
  {
    heading: 'GST & Tax',
    items: [
      { label: 'GST Return Filing',  to: '/service/gst-return-filing' },
      { label: 'GST Refund',         to: '/service/gst-refund' },
      { label: 'ITR-1 Filing',       to: '/service/itr-1-filing' },
      { label: 'ITR-3 Filing',       to: '/service/itr-3-filing' },
      { label: 'TDS Return Filing',  to: '/service/tds-return-filing' },
    ],
  },
  {
    heading: 'Trademark & IP',
    items: [
      { label: 'Trademark Registration', to: '/service/trademark-registration' },
      { label: 'Trademark Renewal',      to: '/service/trademark-renewal' },
      { label: 'Copyright Registration', to: '/service/copyright-registration' },
      { label: 'Patent Registration',    to: '/service/patent-registration' },
    ],
  },
];

const POLICY_LINKS = [
  { label: 'Privacy Policy',        to: '/privacy-policy' },
  { label: 'Refund Policy',          to: '/refund-policy' },
  { label: 'Confidentiality Policy', to: '/confidentiality-policy' },
  { label: 'Disclaimer Policy',      to: '/disclaimer-policy' },
  { label: 'Terms & Conditions',     to: '/terms-conditions' },
  { label: 'Review Page',            to: '/reviews' },
  { label: 'About Us',               to: '/about-us' },
  { label: 'Contact Us',             to: '/contact-us' },
];

const TOOL_LINKS = [
  { label: 'Business Search',   to: '/business-search', icon: <Search className="w-3.5 h-3.5" /> },
  { label: 'Trademark Search',   to: '/trademark-search', icon: <FileText className="w-3.5 h-3.5" /> },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand + Contact */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-5 group">
              <span className="inline-flex items-center justify-center rounded-xl bg-slate-800/60 ring-1 ring-slate-600/50 p-3 transition-all group-hover:bg-slate-700/60 group-hover:ring-slate-500/50">
                <img src="/assets/logo.png" alt="Mridhuv Associates" className="h-9 w-auto max-w-[160px] object-contain" />
              </span>
            </Link>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-6">
              India's trusted platform for business registrations, tax compliance and legal services.
            </p>
            <div className="space-y-2.5">
              <a href={`tel:${FOOTER_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {FOOTER_PHONE}
              </a>
              <a href={`mailto:${FOOTER_EMAIL}`} className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors break-all">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {FOOTER_EMAIL}
              </a>
              <div className="flex items-start gap-2.5 text-[13px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" /> Mumbai, Maharashtra, India
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
          {SERVICE_LINKS.map((col) => (
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
          {POLICY_LINKS.map((item) => (
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
            <a href={`mailto:${FOOTER_EMAIL}`} className="hover:text-white transition-colors">{FOOTER_EMAIL}</a>
            <a href={`tel:${FOOTER_PHONE.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{FOOTER_PHONE}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
