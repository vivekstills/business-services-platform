import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function PolicyLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-gray-50 to-white pt-16 noise-overlay">
      <div className="relative bg-gradient-to-br from-white via-white to-blue-50/20 border-b border-gray-200/60">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">{title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <article className="text-gray-600 text-[calc(15px+3pt)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:first:mt-0 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1 [&_a]:text-blue-600 [&_a]:hover:underline">
          {children}
        </article>
      </div>
    </div>
  );
}
