import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Building2, ExternalLink, ChevronRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const MCA_SEARCH_URL = 'https://www.mca.gov.in/content/mca/global/en/mca/fo-llp-services/company-llp-name-search.html';

export default function BusinessSearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-gray-50 to-white pt-16 noise-overlay">
      <SEOHead
        title="Company / LLP Name Search — MCA Portal"
        description="Search for registered companies and LLPs on the MCA portal. Mridhuv Associates also provides company registration, due diligence, and compliance verification services."
        canonical="/business-search"
        keywords="MCA company search, LLP search, company name search India, CIN search, company registration check, Mridhuv Associates"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">Business Search</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
            <Building2 className="w-3.5 h-3.5" /> MCA Company Search
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Search for Company / LLP
          </h1>
          <p className="text-gray-500 text-[calc(16px+3pt)] max-w-xl mx-auto">
            Look up registered companies and LLPs on the Ministry of Corporate Affairs (MCA) portal. Enter a company name or CIN to find details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">MCA.gov.in — Company / LLP Name Search</h2>
              <p className="text-[calc(13px+3pt)] text-gray-500">Search by company name or CIN on the official MCA portal</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter company name or CIN..."
              className="flex-1 h-12 rounded-xl border border-gray-200 px-4 text-[calc(15px+3pt)] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <a
              href={MCA_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              Search on MCA.gov.in <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[calc(12px+3pt)] text-gray-400 mt-4">
            You will be redirected to the official <strong>MCA.gov.in</strong> Company/LLP Name Search. Our team can also help you with company search, due diligence, or compliance verification — contact us at{' '}
            <a href="mailto:enquiry@mridhuvassociates.com" className="text-blue-600 font-medium">enquiry@mridhuvassociates.com</a>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-2xl"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Need company registration instead?</h3>
          <p className="text-[calc(14px+3pt)] text-gray-500 mb-4">We help you incorporate a new Private Limited Company, LLP, or other business structure.</p>
          <Link to="/category/new-business" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
            View incorporation services <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
