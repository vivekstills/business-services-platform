import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Clock, Calendar, User, ArrowLeft, ArrowRight, AlignLeft } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import RichContent from '../components/RichContent';
import type { Article } from '../types/content';
import SEOHead, { SITE_URL } from '../components/SEOHead';
import { formatReadingTimeLabel } from '../utils/readingTime';
import { getArticleCategoryBadgeClasses, normalizeArticleCategory } from '../data/articleCategories';
import { ARTICLE_REDIRECTS } from '../data/articleRedirects';

function CategoryBadge({ cat }: { cat: string }) {
  const label = normalizeArticleCategory(cat) || cat;
  const cls = getArticleCategoryBadgeClasses(cat);
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>{label}</span>;
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link to={`/articles/${article.slug}`}
      className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden ${article.coverImage ? '' : 'bg-gray-100 flex items-center justify-center'}`}>
        {article.coverImage
          ? <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          : <BookOpen className="w-4 h-4 text-gray-300" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{article.title}</p>
        <p className="text-xs text-gray-400 mt-1">{formatReadingTimeLabel(article.content)}</p>
      </div>
    </Link>
  );
}

function extractTOC(content: string): { id: string; label: string }[] {
  return content.split('\n')
    .filter((l) => l.trim().startsWith('## '))
    .map((l) => {
      const text = l.trim().slice(3).trim();
      const id = `section-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
      return { id, label: text };
    });
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const [activeSection, setActiveSection] = useState('');

  const articles: Article[] = (content.articles ?? []).filter((a) => a.published);

  if (slug && ARTICLE_REDIRECTS[slug]) {
    return <Navigate to={`/articles/${ARTICLE_REDIRECTS[slug]}`} replace />;
  }

  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/articles" replace />;

  const toc = extractTOC(article.content);

  const related = articles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, 4);
  const otherArticles = articles.filter((a) => a.id !== article.id && !related.find((r) => r.id === a.id)).slice(0, 4 - related.length);
  const sidebar = [...related, ...otherArticles].slice(0, 4);

  const articleIndex = articles.findIndex((a) => a.id === article.id);
  const prev = articles[articleIndex - 1];
  const next = articles[articleIndex + 1];

  useEffect(() => {
    if (toc.length === 0) return;
    const observers: IntersectionObserver[] = [];
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [toc]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-transparent pt-16 noise-overlay">
      <SEOHead
        title={article.title}
        description={article.excerpt}
        canonical={`/articles/${article.slug}`}
        ogType="article"
        ogImage={article.coverImage || undefined}
        keywords={article.tags.join(', ') + ', Mridhuv Associates'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          author: { '@type': 'Person', name: article.author },
          datePublished: article.date,
          publisher: { '@type': 'Organization', name: 'Mridhuv Associates', url: SITE_URL },
          url: `${SITE_URL}/articles/${article.slug}`,
          ...(article.coverImage && { image: article.coverImage }),
        }}
      />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full blur-[100px]" />
          <div className="absolute inset-0 dot-grid" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/articles" className="hover:text-gray-600 transition-colors">Articles</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500 truncate max-w-40">{article.title}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {article.category && <CategoryBadge cat={article.category} />}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-4"
          >
            {article.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="text-gray-500 text-[15px] leading-relaxed mb-6 max-w-2xl"
          >
            {article.excerpt}
          </motion.p>

          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-violet-300 text-violet-500 text-xs font-medium">
              <User className="w-3 h-3" /> {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-400 text-xs font-medium">
              <Calendar className="w-3 h-3" />
              {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-400 text-xs font-medium">
              <Clock className="w-3 h-3" /> {formatReadingTimeLabel(article.content)}
            </span>
            {article.tags.map((tag, idx) => {
              const palettes = [
                'border-blue-300 text-blue-500',
                'border-emerald-300 text-emerald-600',
                'border-orange-300 text-orange-500',
                'border-pink-300 text-pink-500',
                'border-teal-300 text-teal-600',
                'border-amber-300 text-amber-600',
              ];
              return (
                <span key={tag} className={`inline-flex items-center px-3 py-1 rounded-full bg-white border text-xs font-medium ${palettes[idx % palettes.length]}`}>
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="rounded-xl overflow-hidden h-56 md:h-72 shadow-sm">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">

          {/* Content */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200/80 px-6 sm:px-8 py-8">
              <RichContent content={article.content} stripLeadingH1 pastelArticle />
            </div>

            {(prev || next) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {prev ? (
                  <Link to={`/articles/${prev.slug}`}
                    className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                    <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-blue-500 mt-0.5 flex-shrink-0 transition-colors" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Previous</p>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 leading-snug line-clamp-2 transition-colors">{prev.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                {next && (
                  <Link to={`/articles/${next.slug}`}
                    className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all sm:flex-row-reverse text-right">
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 mt-0.5 flex-shrink-0 transition-colors" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Next</p>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 leading-snug line-clamp-2 transition-colors">{next.title}</p>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {/* Related articles (below prev/next on all screens) */}
            {sidebar.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200/80 p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">More Articles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 divide-y sm:divide-y-0 divide-gray-50">
                  {sidebar.map((a) => <RelatedCard key={a.id} article={a} />)}
                </div>
                <Link to="/articles" className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors pt-3 border-t border-gray-100">
                  View all articles <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            <Link to="/articles" className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to articles
            </Link>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-20 self-start max-h-[calc(100vh-5.5rem)]">

            {/* TOC — scrolls internally; grows to fill available space */}
            {toc.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden flex flex-col min-h-0">
                <div className="px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft className="w-3 h-3" /> Contents
                  </p>
                </div>
                <nav className="overflow-y-auto flex-1 px-2 py-2 space-y-0.5">
                  {toc.map(({ id, label }, idx) => (
                    <button key={id} onClick={() => scrollToSection(id)}
                      className={`w-full text-left flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${
                        activeSection === id
                          ? 'text-blue-600 font-semibold bg-blue-50'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}>
                      <span className="text-[10px] text-gray-300 font-bold pt-0.5 w-3 flex-shrink-0">{idx + 1}</span>
                      <span className="leading-snug">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* CTA — always fully visible, never overlaps TOC */}
            <div className="bg-gray-900 rounded-xl p-5 text-white flex-shrink-0">
              <h3 className="font-semibold text-sm mb-1">Need expert help?</h3>
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">Our specialists handle this end-to-end.</p>
              <Link to="/contact-us"
                className="block w-full text-center py-2 rounded-lg bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors">
                Get Free Consultation
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
