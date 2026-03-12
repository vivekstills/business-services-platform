import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const LINKS = [
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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center mb-5">
              <img src="/assets/logo.png" alt="Mridhuv Associates" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
              India's trusted platform for business registrations, tax compliance and legal services.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 98765 43210
              </a>
              <a href="mailto:info@mridhuvassociates.com" className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> info@mridhuvassociates.com
              </a>
              <div className="flex items-start gap-2.5 text-[13px] text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" /> Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-[13px] text-gray-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-800 pt-8">
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Mridhuv Associates. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((t) => (
              <a key={t} href="#" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
