import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Users, Award, Target } from 'lucide-react';
import PolicyLayout from '../components/PolicyLayout';

export default function AboutUsPage() {
  return (
    <PolicyLayout title="About Us">
      <p className="text-gray-500 text-sm mb-8">Your trusted partner in business compliance</p>
      <h2>Who We Are</h2>
      <p>Mridhuv Associates is a leading business compliance and legal services platform in India. We help entrepreneurs, startups, and established businesses navigate the complexities of registrations, tax filings, trademark protection, and ongoing compliance.</p>
      <h2>Our Mission</h2>
      <p>To make business compliance simple, transparent, and accessible. We believe every business deserves expert support without the hassle of dealing with multiple government portals and paperwork.</p>
      <h2>What We Offer</h2>
      <ul>
        <li>120+ services across registrations, tax, IP, and compliance</li>
        <li>State-specific guidance for GST, Professional Tax, Trade Licences</li>
        <li>End-to-end support from document collection to certificate delivery</li>
        <li>Transparent pricing with no hidden fees</li>
      </ul>
      <h2>Why Choose Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {[
          { icon: <Shield className="w-5 h-5" />, title: 'Government Approved', desc: 'All processes follow official guidelines and timelines.' },
          { icon: <Users className="w-5 h-5" />, title: '50,000+ Businesses', desc: 'Trusted by entrepreneurs across India.' },
          { icon: <Award className="w-5 h-5" />, title: '4.9/5 Rating', desc: 'Consistently high client satisfaction.' },
          { icon: <Target className="w-5 h-5" />, title: 'Fast Turnaround', desc: 'Most services completed in 7–10 working days.' },
        ].map((item) => (
          <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">{item.icon}</div>
            <div>
              <div className="font-semibold text-gray-900">{item.title}</div>
              <div className="text-[calc(14px+2pt)] text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="font-semibold text-gray-900 mb-2">Ready to get started?</p>
        <p className="text-gray-600 text-[calc(14px+2pt)] mb-4">Explore our services or reach out for a personalised consultation.</p>
        <Link to="/contact-us" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
          Contact Us <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PolicyLayout>
  );
}
