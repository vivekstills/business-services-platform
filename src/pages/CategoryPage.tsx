import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { SERVICE_CATEGORIES, getServicesByCategory } from '../data/services';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId) ?? null;
  const services = categoryId ? getServicesByCategory(categoryId) : [];

  if (!categoryId || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h1>
          <p className="text-gray-500 mb-6">Please choose a category from the navigation above.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Back to home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero header */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-50 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
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
            className="text-gray-500 max-w-2xl text-[15px]"
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {services.length === 0 ? (
          <div className="text-gray-400 text-sm">No services available in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/service/${s.id}`}
                  className="group flex flex-col h-full p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">
                      {s.mainHead}
                    </div>
                    <h3 className="text-[15px] font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors leading-snug mb-2">
                      {s.name}
                    </h3>
                    <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2">
                      {s.shortDescription || 'Expert assistance for this service — view details to get started.'}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 group-hover:text-indigo-600 transition-colors">
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
