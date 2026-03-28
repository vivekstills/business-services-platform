import React from 'react';
import { useParams } from 'react-router-dom';
import { getServiceById } from '../context/ContentContext';
import { useContent } from '../context/ContentContext';
import ServiceLeadHero from '../sections/ServiceLeadHero';
import SEOHead, { SITE_URL } from '../components/SEOHead';

export default function ServicePage() {
  const { serviceId } = useParams();
  const { content } = useContent();
  const service = serviceId ? getServiceById(content.services, serviceId) ?? null : null;

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

  const seoDesc = service.shortDescription
    || `${service.name} — expert assistance by Mridhuv Associates. Transparent pricing, fast turnaround, government-approved process.`;
  const category = content.categories.find(c => c.id === service.categoryId);

  return (
    <>
      <SEOHead
        title={`${service.name} — Online ${service.mainHead} Service`}
        description={seoDesc}
        canonical={`/service/${service.id}`}
        ogType="product"
        keywords={`${service.name}, ${service.mainHead}, ${service.name} online, ${service.name} India, ${service.name} Bangalore, Mridhuv Associates`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: seoDesc,
          url: `${SITE_URL}/service/${service.id}`,
          provider: {
            '@type': 'Organization',
            name: 'Mridhuv Associates',
            url: SITE_URL,
          },
          areaServed: { '@type': 'Country', name: 'India' },
          category: category?.title || service.mainHead,
          ...(service.packages.length > 0 && {
            offers: service.packages.map(pkg => ({
              '@type': 'Offer',
              name: pkg.name,
              description: pkg.description,
              price: pkg.price.replace(/[^\d]/g, ''),
              priceCurrency: 'INR',
            })),
          }),
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              ...(category ? [{ '@type': 'ListItem', position: 2, name: category.title, item: `${SITE_URL}/category/${category.id}` }] : []),
              { '@type': 'ListItem', position: category ? 3 : 2, name: service.name, item: `${SITE_URL}/service/${service.id}` },
            ],
          },
        }}
      />
      <ServiceLeadHero service={service} />
    </>
  );
}

