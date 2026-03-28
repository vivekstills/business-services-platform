import { Helmet } from 'react-helmet-async';

export const SITE_NAME = 'Mridhuv Associates';
export const SITE_URL = 'https://mridhuvassociates.com';
export const DEFAULT_DESCRIPTION =
  'Mridhuv Associates — India\'s trusted platform for GST registration, company incorporation, trademark, income tax filing, and 120+ business compliance services. Expert support, transparent pricing, fast turnaround.';
const DEFAULT_OG_IMAGE = '/assets/logo.png';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  noindex,
  keywords,
  jsonLd,
}: SEOHeadProps) {
  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Business Compliance & Legal Services in India`;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const pageImage = ogImage || `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
