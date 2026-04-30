import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, ArrowLeft, ArrowRight, AlignLeft } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import RichContent from '../components/RichContent';
import type { Article } from '../types/content';
import SEOHead, { SITE_URL } from '../components/SEOHead';
import { formatReadingTimeLabel } from '../utils/readingTime';
import {
  getArticleCategoryPremiumHeaderBadge,
  normalizeArticleCategory,
} from '../data/articleCategories';
import { ARTICLE_REDIRECTS } from '../data/articleRedirects';
import { articleSectionIdFromMarkdownH2Line } from '../utils/articleSectionIds';

function CategoryBadge({ cat }: { cat: string }) {
  const label = normalizeArticleCategory(cat) || cat;
  const cls = getArticleCategoryPremiumHeaderBadge(cat);
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.75rem] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group/card flex flex-col gap-2 rounded-xl border border-[#e2e8f0] bg-white p-4 transition-all hover:border-[#c7d2fe] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="flex gap-3">
        <div
          className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg ${article.coverImage ? '' : 'flex items-center justify-center bg-slate-50'}`}
        >
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-4 w-4 text-slate-300" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {article.category ? (
            <span
              className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getArticleCategoryPremiumHeaderBadge(article.category)}`}
            >
              {normalizeArticleCategory(article.category)}
            </span>
          ) : null}
          <p className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-[#1e293b] group-hover/card:text-indigo-700">
            {article.title}
          </p>
          <p className="mt-1 text-[0.8rem] text-[#94a3b8]">{formatReadingTimeLabel(article.content)}</p>
        </div>
      </div>
    </Link>
  );
}

function extractTOC(content: string): { id: string; label: string }[] {
  return content
    .split('\n')
    .filter((l) => l.trim().startsWith('## '))
    .map((l) => {
      const text = l.trim().slice(3).trim();
      return { id: articleSectionIdFromMarkdownH2Line(l.trim()), label: text };
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
            className="mb-4 text-[2.25rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#0f172a]"
          >
            {article.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="mb-6 max-w-[680px] text-[1.05rem] leading-[1.7] text-[#475569]"
          >
            {article.excerpt}
          </motion.p>

          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 pb-6 text-[0.875rem] text-[#94a3b8]">
            <span className="inline-flex items-center gap-1">{article.author}</span>
            <span aria-hidden className="px-1">
              ·
            </span>
            <span>
              {new Date(article.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span aria-hidden className="px-1">
              ·
            </span>
            <span>{formatReadingTimeLabel(article.content)}</span>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-[#e2e8f0] pb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[#e2e8f0] px-3 py-1 text-[0.75rem] font-medium text-[#475569] transition-colors hover:bg-[#f1f5f9]"
              >
                {tag}
              </span>
            ))}
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
            <div className="rounded-xl border border-[#e2e8f0]/80 bg-white px-6 py-8 sm:px-8">
              <RichContent content={article.content} stripLeadingH1 articlePremium />
            </div>

            {(prev || next) && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {prev ? (
                  <Link
                    to={`/articles/${prev.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 transition-colors hover:border-[#c7d2fe] sm:p-5"
                  >
                    <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8] transition-colors group-hover:text-indigo-600" />
                    <div className="min-w-0">
                      <p className="mb-1 text-[0.75rem] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Previous
                      </p>
                      <p className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-[#1e293b] group-hover:text-indigo-700">
                        {prev.title}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    to={`/articles/${next.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-right transition-colors hover:border-[#c7d2fe] sm:flex-row-reverse sm:p-5"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8] transition-colors group-hover:text-indigo-600" />
                    <div className="min-w-0 flex-1 sm:text-right">
                      <p className="mb-1 text-[0.75rem] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Next
                      </p>
                      <p className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-[#1e293b] group-hover:text-indigo-700">
                        {next.title}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {/* Related articles (below prev/next on all screens) */}
            {sidebar.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#e2e8f0]/80 bg-white p-4">
                <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">More Articles</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {sidebar.map((a) => (
                    <RelatedCard key={a.id} article={a} />
                  ))}
                </div>
                <Link
                  to="/articles"
                  className="mt-4 flex items-center gap-1 border-t border-[#f1f5f9] pt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View all articles <ArrowRight className="h-3 w-3" />
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
              <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#e2e8f0]/80 bg-white">
                <div className="flex-shrink-0 border-b border-[#f1f5f9] px-4 pb-2 pt-4">
                  <p className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">
                    <AlignLeft className="h-3 w-3" aria-hidden /> Contents
                  </p>
                </div>
                <nav className="max-h-[min(40vh,320px)] flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
                  {toc.map(({ id, label }, idx) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={`w-full rounded-md py-[0.35rem] text-left text-[0.85rem] transition-colors ${
                        activeSection === id
                          ? 'border-l-2 border-[#4f46e5] pl-3 font-semibold text-[#4f46e5]'
                          : 'border-l-2 border-transparent pl-3 font-normal text-[#64748b] hover:text-[#1e293b]'
                      }`}
                    >
                      <span className="mr-2 inline-block w-4 tabular-nums text-[0.7rem] text-[#cbd5e1]">{idx + 1}</span>
                      <span className="leading-snug">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* CTA — always fully visible, never overlaps TOC */}
            <div className="flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 text-white shadow-lg shadow-slate-900/20">
              <h3 className="mb-1 text-sm font-bold text-white">Need expert help?</h3>
              <p className="mb-5 text-xs leading-relaxed text-[#94a3b8]">
                Our specialists handle this end-to-end.
              </p>
              <Link
                to="/contact-us"
                className="block w-full rounded-full bg-[#4f46e5] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#4338ca]"
              >
                Get Free Consultation
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
