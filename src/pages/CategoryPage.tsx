import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useContent, getServicesByCategory } from '../context/ContentContext';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SEOHead, { SITE_URL } from '../components/SEOHead';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { content } = useContent();
  const category = content.categories.find((c) => c.id === categoryId) ?? null;
  const services = categoryId ? getServicesByCategory(content.services, categoryId) : [];

  if (!categoryId || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h1>
          <p className="text-gray-500 mb-6">Please choose a category from the navigation above.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            Back to home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-16 noise-overlay">
      <SEOHead
        title={`${category.title} Services`}
        description={`${category.description} — ${services.length} expert services by Mridhuv Associates. Transparent pricing, fast turnaround.`}
        canonical={`/category/${categoryId}`}
        keywords={`${category.title}, ${category.title} services, ${category.title} India, Mridhuv Associates ${category.title}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${category.title} Services`,
          description: category.description,
          url: `${SITE_URL}/category/${categoryId}`,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: category.title, item: `${SITE_URL}/category/${categoryId}` },
            ],
          },
        }}
      />
      {/* Hero header */}
      <div className="relative bg-transparent border-b border-gray-200/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-blue-100/30 to-sky-50/20 rounded-full blur-[100px] animate-float-glow" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-[80px]" />
          <div className="absolute inset-0 dot-grid" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-medium">{category.title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3"
          >
            {category.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-gray-500 max-w-2xl text-[calc(15px+3pt)]"
          >
            {category.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="mt-4 text-xs text-gray-400 font-medium"
          >
            {services.length} service{services.length !== 1 ? 's' : ''} available
          </motion.div>
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {services.length === 0 ? (
          <div className="text-gray-400 text-sm">No services available in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/service/${s.id}`}
                  className="card-hover-warm group flex flex-col p-6 rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="text-[calc(11px+3pt)] font-bold text-blue-500 uppercase tracking-widest mb-2">
                      {s.mainHead}
                    </div>
                    <h3 className="text-[calc(15px+3pt)] font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                      {s.name}
                    </h3>
                    <p className="text-[calc(13px+3pt)] text-gray-400 leading-relaxed line-clamp-2">
                      {s.shortDescription || 'Expert assistance for this service — view details to get started.'}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[calc(12px+3pt)] font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
                    View & apply <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
