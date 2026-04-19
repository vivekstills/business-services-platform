import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const TM_SEARCH_URL = 'https://tmrsearch.ipindia.gov.in/tmrpublicsearch/';

export default function TrademarkSearchPage() {
  const [query, setQuery] = useState('');
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    window.location.href = TM_SEARCH_URL;
  };

  return (
    <div className="min-h-screen bg-transparent pt-16 noise-overlay">
      <SEOHead
        title="Trademark Search — IP India Public Search"
        description="Search for registered trademarks on the IP India portal. Mridhuv Associates provides complete trademark registration, objection, opposition, and renewal services."
        canonical="/trademark-search"
        keywords="trademark search India, IP India search, trademark registration check, trademark public search, Mridhuv Associates trademark"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">Trademark Search</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-6">
            <FileText className="w-3.5 h-3.5" /> tmsearch.ipindia.gov.in
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Search for Trademarks
          </h1>
          <p className="text-gray-500 text-[calc(16px+3pt)] max-w-xl mx-auto">
            Check if a trademark is already registered or applied for on the IP India (Trade Marks Registry) portal. Use this before filing your own trademark application.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-hover-warm bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-100 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Search className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">tmsearch.ipindia.gov.in — Trademark Public Search</h2>
              <p className="text-[calc(13px+3pt)] text-gray-500">Search by wordmark, device, or combination on the official IP India portal</p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter trademark / brand name..."
              className="flex-1 h-12 rounded-xl border border-gray-200 px-4 text-[calc(15px+3pt)] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Search on tmrsearch.ipindia.gov.in <ExternalLink className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[calc(12px+3pt)] text-gray-400 mt-4">
            You will be redirected to the official <strong>tmsearch.ipindia.gov.in</strong> Trademark Public Search. Our team can help you with trademark search, class selection, and registration — contact us at{' '}
            <a href="mailto:enquiry@mridhuvassociates.com" className="text-emerald-600 font-medium">enquiry@mridhuvassociates.com</a>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Ready to register your trademark?</h3>
          <p className="text-[calc(14px+3pt)] text-gray-500 mb-4">We handle the complete trademark registration process — from search to certificate.</p>
          <Link to="/service/trademark-registration" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700">
            Trademark Registration <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
