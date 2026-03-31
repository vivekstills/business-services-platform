import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Search } from 'lucide-react';

const TOOLS = [
  {
    title: 'Trademark Search',
    description: 'Check trademark availability before filing.',
    to: '/trademark-search',
    icon: <FileSearch className="w-5 h-5" />,
  },
  {
    title: 'Business Search',
    description: 'Find company and LLP records quickly.',
    to: '/business-search',
    icon: <Search className="w-5 h-5" />,
  },
];

export default function QuickToolsSection() {
  return (
    <section className="bg-transparent py-10 sm:py-12">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Quick Tools</h2>
          <p className="text-gray-500 mt-2">Fast utility tools for instant checks</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="card-hover-warm group rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                {tool.icon}
              </div>
              <h3 className="text-[calc(14px+3pt)] font-semibold text-gray-900">{tool.title}</h3>
              <p className="text-[calc(12px+3pt)] text-gray-500 mt-1 line-clamp-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
