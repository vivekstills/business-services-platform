import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { getCategoryServices, getNavCategoryBySlug, getServiceDetailRoute } from '../data/servicesData';

export default function ServicesCategoryPage() {
  const { category } = useParams();
  const navCategory = getNavCategoryBySlug(category);

  if (!navCategory) return <Navigate to="/services/registration" replace />;

  const services = getCategoryServices(category);

  return (
    <section className="min-h-screen pt-16 bg-transparent">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[22px] sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2.5 sm:mb-3">{navCategory.title} Services</h1>
        <p className="text-[13px] sm:text-base text-gray-500 mb-6 sm:mb-8">Explore services and open any sub-service for full details.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              to={getServiceDetailRoute(navCategory.slug, service.id)}
              className="group flex h-full min-w-0 w-full flex-col justify-between rounded-[14px] sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-6 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 sm:mb-4">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 leading-[1.3] line-clamp-1 break-words">{service.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-[1.4] line-clamp-2 min-h-[34px] sm:min-h-[44px] break-words">
                  {service.shortDescription || 'Expert assistance for this service with fast turnaround.'}
                </p>
              </div>
              <div className="mt-auto pt-2 inline-flex items-center gap-1 text-blue-600 font-medium text-[11px] sm:text-sm">
                View Details <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
