import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { getNavCategoryBySlug, getServiceBySlug } from '../data/servicesData';

function aboutBullets(content: string) {
  return content
    .replace(/\*\*/g, '')
    .split(/[.?!]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 36)
    .slice(0, 4);
}

export default function ServicesDetailPage() {
  const { category, service } = useParams();
  const navCategory = getNavCategoryBySlug(category);
  const data = getServiceBySlug(service);

  if (!navCategory || !data || data.categoryId !== navCategory.categoryId) {
    return <Navigate to="/services/registration" replace />;
  }

  const bullets = aboutBullets(data.content);

  return (
    <section className="min-h-screen pt-16 bg-transparent">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{data.name}</h1>
            <p className="text-gray-600 text-lg mb-6">
              {data.shortDescription || 'Get complete end-to-end expert support for this service.'}
            </p>
            <Link
              to={`/services/${category}/${service}/form`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600 leading-relaxed mb-5">{data.content.split('\n\n')[0]}</p>
          <ul className="space-y-2.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-700">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.packages.slice(0, 3).map((pkg, i) => {
              const isDeluxe = /deluxe/i.test(pkg.name) || i === 1;
              return (
                <div
                  key={pkg.name}
                  className={`rounded-2xl border p-6 ${
                    isDeluxe ? 'border-blue-300 bg-blue-50/70 shadow-md ring-1 ring-blue-200' : 'border-gray-200 bg-white shadow-sm'
                  }`}
                >
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">{pkg.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{pkg.price}</p>
                  <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                  <Link
                    to={`/services/${category}/${service}/form`}
                    className="inline-flex items-center gap-1.5 text-blue-700 font-semibold text-sm"
                  >
                    Start Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
