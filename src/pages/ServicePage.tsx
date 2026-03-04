import React from 'react';
import { useParams } from 'react-router-dom';
import { getServiceById } from '../data/services';
import ServiceLeadHero from '../sections/ServiceLeadHero';

export default function ServicePage() {
  const { serviceId } = useParams();
  const service = serviceId ? getServiceById(serviceId) ?? null : null;

  if (!service) {
    return (
      <section className="pt-28 pb-20 bg-[#0B0F1A] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Service not found</h1>
          <p className="text-sm text-white/60 mt-2">Please choose a service from the header.</p>
        </div>
      </section>
    );
  }

  return <ServiceLeadHero service={service} />;
}

