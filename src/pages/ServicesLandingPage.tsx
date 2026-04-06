import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES_NAV_CATEGORIES } from '../data/servicesData';

export default function ServicesLandingPage() {
  return (
    <section className="min-h-screen pt-16 bg-transparent">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Services</h1>
        <p className="text-gray-500 mb-8">Choose a category to explore sub-services.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES_NAV_CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/services/${c.slug}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <h2 className="font-semibold text-gray-900 mb-2">{c.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{c.featuredServiceIds.length} featured services</p>
              <span className="inline-flex items-center gap-1.5 text-blue-700 text-sm font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
