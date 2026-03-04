import React from 'react';
import { Link } from 'react-router-dom';

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
      { label: 'International Trademark',to: '/service/international-trademark' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#040810] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">

        {/* Top row: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-[17px] font-bold text-white">YourBrand</span>
            </Link>
            <p className="text-[13px] text-white/35 leading-relaxed">
              India's trusted platform for business registrations, tax compliance and legal services.
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-[13px] text-white/45 hover:text-white/80 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/6 pt-8">
          <p className="text-[12px] text-white/25">
            &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((t) => (
              <a key={t} href="#" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
