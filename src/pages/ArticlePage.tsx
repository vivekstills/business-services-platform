import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Clock, Calendar, User, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import RichContent from '../components/RichContent';
import type { Article } from '../types/content';

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
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[calc(11px+1.5pt)] font-semibold border ${cls}`}>{cat}</span>;
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link to={`/articles/${article.slug}`}
      className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden ${article.coverImage ? '' : 'bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center'}`}>
        {article.coverImage
          ? <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          : <BookOpen className="w-6 h-6 text-blue-300" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[calc(13px+1.5pt)] font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">{article.title}</p>
        <p className="text-[calc(11px+1.5pt)] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readingTime}</p>
      </div>
    </Link>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();

  const articles: Article[] = (content.articles ?? []).filter((a) => a.published);
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  const related = articles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, 4);

  const otherArticles = articles.filter((a) => a.id !== article.id && !related.find((r) => r.id === a.id)).slice(0, 4 - related.length);
  const sidebar = [...related, ...otherArticles].slice(0, 4);

  const articleIndex = articles.findIndex((a) => a.id === article.id);
  const prev = articles[articleIndex - 1];
  const next = articles[articleIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-white pt-16 noise-overlay">
      {/* Article header */}
      <div className="relative bg-gradient-to-br from-white via-white to-blue-50/30 border-b border-gray-200/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-blue-100/20 to-sky-50/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 dot-grid" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/articles" className="hover:text-gray-600 transition-colors">Articles</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-medium truncate max-w-48">{article.title}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {article.category && <CategoryBadge cat={article.category} />}
            <span className="text-[calc(11px+1.5pt)] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readingTime}</span>
          </div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            {article.title}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="text-gray-500 text-[calc(15px+1.5pt)] leading-relaxed mb-6 max-w-2xl">
            {article.excerpt}
          </motion.p>

          <div className="flex flex-wrap items-center gap-4 text-[calc(12px+1.5pt)] text-gray-400">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />
              {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {article.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {article.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[calc(11px+1.5pt)]">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-8">
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Main content + sidebar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Article body */}
          <div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8 shadow-sm">
              <RichContent content={article.content} />
            </div>

            {/* Prev / Next navigation */}
            {(prev || next) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {prev ? (
                  <Link to={`/articles/${prev.slug}`}
                    className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
                    <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[calc(11px+1.5pt)] text-gray-400 font-medium uppercase tracking-wider mb-1">Previous</p>
                      <p className="text-[calc(13px+1.5pt)] font-semibold text-gray-700 group-hover:text-blue-700 leading-snug line-clamp-2">{prev.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                {next && (
                  <Link to={`/articles/${next.slug}`}
                    className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all text-right sm:flex-row-reverse">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[calc(11px+1.5pt)] text-gray-400 font-medium uppercase tracking-wider mb-1">Next</p>
                      <p className="text-[calc(13px+1.5pt)] font-semibold text-gray-700 group-hover:text-blue-700 leading-snug line-clamp-2">{next.title}</p>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <h3 className="font-bold text-base mb-1">Need expert help?</h3>
              <p className="text-blue-200 text-sm mb-4 leading-relaxed">Our specialists are ready to handle this for you end-to-end.</p>
              <Link to="/contact-us"
                className="block w-full text-center py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:shadow-lg hover:shadow-blue-800/20 transition-all">
                Get Free Consultation
              </Link>
            </div>

            {/* Related articles */}
            {sidebar.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">More Articles</h3>
                <div className="divide-y divide-gray-100">
                  {sidebar.map((a) => <RelatedCard key={a.id} article={a} />)}
                </div>
                <Link to="/articles" className="mt-3 flex items-center justify-center gap-1.5 text-[calc(12px+1.5pt)] font-semibold text-blue-600 hover:text-blue-800 transition-colors pt-3 border-t border-gray-100">
                  View all articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Back to articles */}
            <Link to="/articles"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
