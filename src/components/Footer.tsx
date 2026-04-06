import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useContent } from '../context/ContentContext';

function formatCopyright(line: string | undefined, year: number): string {
  const raw = (line && line.trim()) || '© {{year}} Mridhuv Associates. All rights reserved.';
  return raw.replace(/\{\{year\}\}/gi, String(year));
}

const footMuted = 'text-[calc(14px+3pt)] text-slate-400';
const footHeading = 'text-[calc(12px+3pt)] font-bold uppercase tracking-widest text-slate-500';

/* ── Footer ───────────────────────────────────────── */
export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;
  const contact = content.contact;

  const logoAlt = footer.logoAlt?.trim() || 'Mridhuv Associates';
  const displayAddress = contact.address || footer.address || '';
  const contactHeading = (footer.contactBlockHeading ?? '').trim();
  const showBottomContact = footer.showBottomContactRow !== false;
  const legalPolicyLinks = footer.policyLinks.filter((item) =>
    /privacy|refund|confidentiality|disclaimer|terms/i.test(item.label)
  );
  const companyLinks = footer.policyLinks.filter((item) => !legalPolicyLinks.some((x) => x.to === item.to));

  const year = new Date().getFullYear();
  const copyrightText = formatCopyright(footer.copyrightLine, year);

  return (
    <footer className="relative bg-[#0f172a]/96 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/[0.06] to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-indigo-500/[0.05] to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
      </div>

      <div className="relative z-[2] max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-16 pb-5 sm:pb-10">
        <div className="md:hidden space-y-2.5 mb-5">
          <details className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-200">Services</summary>
            <div className="mt-3 space-y-3">
              {footer.serviceLinks.map((col) => (
                <div key={col.heading}>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1.5">{col.heading}</p>
                  <div className="space-y-1.5">
                    {col.items.map((item) => (
                      <Link key={item.to} to={item.to} className="block text-[12px] text-slate-300">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
          <details className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-200">Company</summary>
            <div className="mt-3 space-y-1.5">
              {companyLinks.map((item) => (
                <Link key={item.to} to={item.to} className="block text-[12px] text-slate-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <details className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-200">Legal</summary>
            <div className="mt-3 space-y-1.5">
              {legalPolicyLinks.map((item) => (
                <Link key={item.to} to={item.to} className="block text-[12px] text-slate-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-14">

          {/* Brand + contact block — phone/email/address always from Contact info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-5 group">
              <span className="inline-flex items-center justify-center rounded-xl bg-slate-800/60 ring-1 ring-slate-600/50 p-4 transition-all group-hover:bg-slate-700/60 group-hover:ring-slate-500/50">
                <img src="/assets/logo.png" alt={logoAlt} className="h-14 sm:h-16 w-auto max-w-[220px] object-contain" />
              </span>
            </Link>
            <p className={`${footMuted} leading-relaxed mb-6`}>{footer.tagline}</p>

            {contactHeading && (
              <h3 className={`${footHeading} mb-3 text-slate-400`}>{contactHeading}</h3>
            )}
            <div className="space-y-2.5">
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={`flex items-center gap-2.5 ${footMuted} hover:text-white transition-colors`}>
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className={`flex items-center gap-2.5 ${footMuted} hover:text-white transition-colors break-all`}>
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" /> {contact.email}
              </a>
              {displayAddress && (
                <div className={`flex items-start gap-2.5 ${footMuted}`}>
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> {displayAddress}
                </div>
              )}
            </div>

          </div>

          {footer.serviceLinks.map((col) => (
            <div key={col.heading}>
              <h4 className={`${footHeading} mb-4`}>{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={`${footMuted} hover:text-white transition-colors`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2 py-6 border-t border-slate-700/50">
          {footer.policyLinks.map((item) => (
            <Link key={item.to} to={item.to} className="text-[calc(13px+3pt)] text-slate-400 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/50 pt-4 sm:pt-8">
          <p className="text-[calc(13px+3pt)] text-slate-400 text-center sm:text-left">
            {copyrightText}
          </p>
          {showBottomContact && (
            <div className="flex items-center gap-4 text-[calc(13px+3pt)] text-slate-400">
              <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{contact.phone}</a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
