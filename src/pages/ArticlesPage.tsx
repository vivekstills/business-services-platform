import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Search, Clock, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import type { Article } from '../types/content';
import SEOHead from '../components/SEOHead';

const CATEGORY_COLORS: Record<string, string> = {
  'GST & Tax': 'bg-orange-50 text-orange-700 border-orange-200',
  'Company Registration': 'bg-blue-50 text-blue-700 border-blue-200',
  'Trademark & IP': 'bg-purple-50 text-purple-700 border-purple-200',
  'Compliance': 'bg-red-50 text-red-700 border-red-200',
  'Registrations': 'bg-teal-50 text-teal-700 border-teal-200',
  'Income Tax': 'bg-green-50 text-green-700 border-green-200',
  'Licensing': 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

function CategoryBadge({ cat }: { cat: string }) {
  const cls = CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[calc(11px+3pt)] font-semibold border ${cls}`}>
      {cat}
    </span>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-200/60 hover:border-blue-200/60 transition-all duration-300 flex flex-col"
    >
      {/* Cover image */}
      {article.coverImage ? (
        <div className="h-44 overflow-hidden">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-blue-200" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Category + reading time */}
        <div className="flex items-center justify-between mb-3">
          {article.category && <CategoryBadge cat={article.category} />}
          <span className="flex items-center gap-1 text-[calc(11px+3pt)] text-gray-400">
            <Clock className="w-3 h-3" /> {article.readingTime}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[calc(15px+3pt)] font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-[calc(11px+3pt)] text-gray-400">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <Link to={`/articles/${article.slug}`} className="flex items-center gap-1 text-[calc(12px+3pt)] font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ArticlesPage() {
  const { content } = useContent();
  const allArticles: Article[] = (content.articles ?? []).filter((a) => a.published);
  const categories: string[] = content.articleCategories ?? [];

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');

  const filtered = useMemo(() => {
    return allArticles.filter((a) => {
      if (activeCat && a.category !== activeCat) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allArticles, activeCat, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-gray-50 to-white pt-16 noise-overlay">
      <SEOHead
        title="Articles & Guides — Business Compliance Knowledge Base"
        description="Expert articles on GST, company registration, trademark, tax filing, and business compliance in India. Written by Mridhuv Associates specialists."
        canonical="/articles"
        keywords="business compliance articles, GST guide, company registration guide, trademark guide India, tax filing tips, Mridhuv Associates blog"
      />
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-white via-white to-blue-50/30 border-b border-gray-200/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-blue-100/30 to-sky-50/20 rounded-full blur-[100px] animate-float-glow" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-[80px]" />
          <div className="absolute inset-0 dot-grid" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-medium">Articles</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Knowledge Base</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Articles & Guides
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-gray-500 max-w-xl mt-2 text-[calc(15px+3pt)]">
                Expert articles on GST, company registration, trademark, tax filing, and business compliance — written by our specialists.
              </motion.p>
            </div>

            {/* Search */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
              />
            </motion.div>
          </div>

          {/* Category tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !activeCat ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              All ({allArticles.length})
            </button>
            {categories.filter((c) => allArticles.some((a) => a.category === c)).map((cat) => {
              const count = allArticles.filter((a) => a.category === cat).length;
              return (
                <button key={cat} onClick={() => setActiveCat(cat === activeCat ? '' : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCat === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-700'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No articles found</h3>
            <p className="text-sm text-gray-400 mt-1">Try a different search or category filter.</p>
          </div>
        ) : (
          <>
            {/* Featured article (first result) */}
            {featured && !search && !activeCat && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="mb-10 group">
                <Link to={`/articles/${featured.slug}`} className="block bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:border-blue-200/60 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className={`h-64 lg:h-auto min-h-[280px] ${featured.coverImage ? '' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700'} overflow-hidden`}>
                      {featured.coverImage
                        ? <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-20 h-20 text-blue-300/60" /></div>
                      }
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[calc(11px+3pt)] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">Featured</span>
                        {featured.category && <CategoryBadge cat={featured.category} />}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-700 transition-colors">{featured.title}</h2>
                      <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[calc(12px+3pt)] text-gray-400">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {featured.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readingTime}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-600">Read article <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(search || activeCat ? filtered : rest).map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
