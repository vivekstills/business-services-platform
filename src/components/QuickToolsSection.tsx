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
    <section className="bg-transparent py-5 sm:py-12 lg:py-[60px]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-5">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Quick Tools</h2>
          <p className="text-gray-500 mt-1 text-xs sm:text-base">Fast utility tools for instant checks</p>
        </div>

        <div className="grid grid-cols-2 [@media(max-width:379px)]:grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:gap-8 w-full max-w-full items-stretch">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="card-hover-warm group min-h-[112px] lg:h-auto w-full min-w-0 max-w-full rounded-xl lg:rounded-[18px] border border-gray-200/80 bg-white/90 shadow-sm p-3 lg:p-6 overflow-hidden flex flex-col justify-between gap-2"
            >
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 lg:mb-0 shrink-0">
                {tool.icon}
              </div>
              <h3 className="text-[13px] lg:text-[18px] font-semibold text-gray-900 line-clamp-1 break-words">{tool.title}</h3>
              <p className="text-[11px] lg:text-[14px] leading-4 text-gray-500 mt-0.5 lg:mt-0 line-clamp-2 break-words">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
