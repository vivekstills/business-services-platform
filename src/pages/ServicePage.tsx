import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getServiceById } from '../context/ContentContext';
import { useContent } from '../context/ContentContext';
import ServiceLeadHero from '../sections/ServiceLeadHero';
import SEOHead, { SITE_URL } from '../components/SEOHead';

export default function ServicePage() {
  const { serviceId } = useParams();
  const { content } = useContent();
  const service = serviceId ? getServiceById(content.services, serviceId) ?? null : null;

  if (!service) {
    return <Navigate to="/services" replace />;
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

