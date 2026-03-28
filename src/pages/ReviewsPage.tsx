import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Quote, ChevronRight } from 'lucide-react';
import PolicyLayout from '../components/PolicyLayout';
import SEOHead from '../components/SEOHead';

const REVIEWS = [
  {
    name: 'Rajesh K.',
    role: 'Startup Founder, Mumbai',
    rating: 5,
    text: 'Mridhuv Associates helped us incorporate our Private Limited Company in under 10 days. Professional, transparent pricing, and excellent follow-up.',
  },
  {
    name: 'Priya S.',
    role: 'Restaurant Owner, Bangalore',
    rating: 5,
    text: 'GST and FSSAI registration was seamless. The team understood our requirements and guided us through every step. Highly recommended.',
  },
  {
    name: 'Amit D.',
    role: 'IT Services, Delhi',
    rating: 5,
    text: 'We use them for annual compliance and TDS filing. Always on time, no last-minute surprises. Great value for money.',
  },
  {
    name: 'Kavita M.',
    role: 'E-commerce, Pune',
    rating: 5,
    text: 'Trademark registration was handled professionally. They responded to the objection quickly and we got our registration without delay.',
  },
];

export default function ReviewsPage() {
  return (
    <PolicyLayout title="Client Reviews">
      <SEOHead
        title="Client Reviews — Trusted by 50,000+ Businesses"
        description="Read reviews from 50,000+ businesses who trust Mridhuv Associates for GST, company registration, trademark, and compliance services. 4.9/5 average rating."
        canonical="/reviews"
        keywords="Mridhuv Associates reviews, Mridu Associates reviews, business compliance reviews, CA firm reviews Bangalore"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Mridhuv Associates',
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '12000', bestRating: '5' },
        }}
      />
      <p className="text-gray-500 text-sm mb-10">What our clients say about us</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <Quote className="w-8 h-8 text-blue-100 mb-4" />
            <div className="flex gap-1 mb-3">
              {[...Array(r.rating)].map((_, j) => (
                <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-gray-600 text-[calc(15px+3pt)] leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
            <div>
              <div className="font-semibold text-gray-900">{r.name}</div>
              <div className="text-[calc(13px+3pt)] text-gray-500">{r.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
        <p className="text-gray-700 font-medium mb-2">Share your experience with us</p>
        <p className="text-[calc(14px+3pt)] text-gray-500 mb-4">We'd love to hear from you. Email your review to <a href="mailto:enquiry@mridhuvassociates.com" className="text-blue-600 font-semibold">enquiry@mridhuvassociates.com</a></p>
        <Link to="/contact-us" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
          Contact Us <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </PolicyLayout>
  );
}
