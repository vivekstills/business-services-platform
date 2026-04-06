import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function PopularTagsSection() {
  const { content } = useContent();
  const popular = content.hero.popular ?? [];

  if (popular.length === 0) return null;

  return (
    <section className="sm:hidden bg-transparent px-4 py-4 border-b-0 shadow-none">
      <div className="max-w-[1280px] mx-auto">
        <p className="text-xs text-gray-400 font-medium mb-2">Popular services</p>
        <div className="flex flex-wrap gap-2">
          {popular.slice(0, 5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[11px] text-gray-600 border border-gray-200 bg-white rounded-full px-2.5 py-1.5 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
