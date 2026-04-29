import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Search, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import type { Article } from '../types/content';
import SEOHead from '../components/SEOHead';
import {
  getArticleCategoryBadgeClasses,
  getArticleCategoryPillClasses,
  normalizeArticleCategory,
} from '../data/articleCategories';
import { formatReadingTimeLabel } from '../utils/readingTime';

function CategoryBadge({ cat }: { cat: string }) {
  const cls = getArticleCategoryBadgeClasses(cat);
  return (
    <span
      className={`inline-flex max-w-full min-w-0 items-center rounded-full border px-2.5 py-1 text-sm font-semibold [word-break:break-word] [overflow-wrap:anywhere] md:min-h-0 md:px-2 md:py-0.5 md:text-[11px] md:truncate md:whitespace-nowrap max-md:min-h-9 max-md:whitespace-normal ${cls}`}
      title={cat}
    >
      {cat}
    </span>
  );
}

const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => {
  return (
    <li className="min-w-0 w-full max-w-full list-none [box-sizing:border-box]">
      <Link
        to={`/articles/${article.slug}`}
        className="group/card block w-full max-w-full min-w-0 cursor-pointer [box-sizing:border-box] rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label={`Read article: ${article.title}`}
      >
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="min-h-0 w-full max-w-full [box-sizing:border-box] flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm md:transition-all md:duration-300 [@media(hover:hover)]:md:group-hover/card:border-gray-300 [@media(hover:hover)]:md:group-hover/card:shadow-lg [@media(hover:hover)]:md:group-hover/card:shadow-gray-200/60"
        >
          {/* Thumbnail — 16:9 on mobile; fixed height on md+ (matches prior desktop) */}
          {article.coverImage ? (
            <div className="relative w-full max-w-full overflow-hidden aspect-[16/9] md:aspect-auto md:h-44">
              <img
                src={article.coverImage}
                alt={article.title}
                width={800}
                height={450}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover md:max-h-44 [@media(hover:hover)]:md:group-hover/card:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div
              className="flex w-full max-w-full aspect-[16/9] items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 md:aspect-auto md:h-44"
              aria-hidden
            >
              <BookOpen className="h-10 w-10 text-blue-200" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col p-4 [word-break:break-word] [overflow-wrap:break-word] md:p-6">
            {/* Desktop: category + read time (unchanged) — hidden on mobile; mobile meta is below */}
            <div className="mb-3 hidden min-w-0 items-center justify-between gap-2 md:flex">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                {article.category && <CategoryBadge cat={article.category} />}
              </div>
              <span className="shrink-0 text-[11px] text-gray-400 [word-break:break-word]">
                <span className="inline-flex min-w-0 items-center gap-1">
                  <Clock className="h-3 w-3 shrink-0" aria-hidden /> {formatReadingTimeLabel(article.content)}
                </span>
              </span>
            </div>

            {/* Mobile: category only (read time in footer) */}
            {article.category && (
              <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 [flex-wrap:wrap] md:mb-0 md:hidden">
                <CategoryBadge cat={article.category} />
              </div>
            )}

            <h2 className="mb-2 min-w-0 text-base font-semibold leading-[1.4] text-gray-900 [overflow-wrap:anywhere] [word-break:break-word] [font-size:clamp(1rem,4vw,1.25rem)] line-clamp-3 md:mb-2 md:line-clamp-2 md:font-bold md:leading-snug md:text-[calc(15px+3pt)] [@media(hover:hover)]:md:group-hover/card:text-blue-700 md:transition-colors">
              {article.title}
            </h2>

            <p className="mb-4 min-h-0 flex-1 text-sm leading-relaxed text-gray-500 [overflow-wrap:anywhere] [word-break:break-word] [font-size:clamp(0.85rem,3.5vw,1rem)] line-clamp-3 md:mb-4 md:line-clamp-2 md:text-sm">
              {article.excerpt}
            </p>

            {/* Mobile: date + author + read, then full-width CTA */}
            <div className="mt-auto flex min-w-0 flex-col gap-3 border-t border-gray-100 pt-3 md:hidden">
              <div className="flex min-w-0 flex-col gap-1.5 text-sm text-gray-400 [word-break:break-word]">
                <span className="inline-flex min-h-11 items-center gap-1.5">
                  <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {article.author}
                </span>
                <span className="inline-flex min-h-11 items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="inline-flex min-h-11 items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {formatReadingTimeLabel(article.content)}
                </span>
              </div>
              <span className="inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-1.5 rounded-xl bg-gray-50 px-3 text-base font-semibold text-blue-600 [min-height:48px]">
                Read article
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </span>
            </div>

            {/* Desktop: original footer — author, date | Read */}
            <div className="hidden min-w-0 items-center justify-between border-t border-gray-100 pt-4 md:flex">
              <div className="flex min-w-0 flex-wrap items-center gap-3 text-[calc(11px+3pt)] text-gray-400 [word-break:break-word]">
                <span className="flex min-w-0 items-center gap-1">
                  <User className="h-3 w-3 shrink-0" aria-hidden /> {article.author}
                </span>
                <span className="flex min-w-0 items-center gap-1">
                  <Calendar className="h-3 w-3 shrink-0" aria-hidden />
                  {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <span className="inline-flex min-h-11 shrink-0 items-center gap-1 text-[calc(12px+3pt)] font-semibold text-blue-600 [@media(hover:hover)]:group-hover/card:text-blue-800 [@media(hover:hover)]:transition-colors">
                Read
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </li>
  );
};

export default function ArticlesPage() {
  const { content } = useContent();
  const allArticles: Article[] = (content.articles ?? [])
    .filter((a) => a.published)
    .map((a) => ({ ...a, category: normalizeArticleCategory(a.category || '') }));
  const categories: string[] = (content.articleCategories ?? []).map((c) => normalizeArticleCategory(c));

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
  const listArticles = search || activeCat ? filtered : rest;

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-transparent pt-16 noise-overlay [word-break:break-word] [overflow-wrap:break-word]">
      <SEOHead
        title="Articles & Guides — Business Compliance Knowledge Base"
        description="Expert articles on GST, company registration, trademark, tax filing, and business compliance in India. Written by Mridhuv Associates specialists."
        canonical="/articles"
        keywords="business compliance articles, GST guide, company registration guide, trademark guide India, tax filing tips, Mridhuv Associates blog"
      />
      <div className="relative max-w-full overflow-x-hidden bg-transparent">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-20 right-0 h-[min(50vh,400px)] w-[min(100vw,500px)] max-w-full rounded-full bg-gradient-to-bl from-blue-100/30 to-sky-50/20 blur-[100px] animate-float-glow" />
          <div className="absolute bottom-0 left-0 h-[200px] w-[min(90vw,300px)] rounded-full bg-gradient-to-tr from-indigo-100/20 to-transparent blur-[80px]" />
          <div className="absolute inset-0 min-h-[200px] dot-grid md:min-h-0" />
        </div>
        <div className="relative mx-auto w-full min-w-0 max-w-7xl [box-sizing:border-box] px-4 pt-12 pb-6 min-[360px]:px-4 sm:px-6 md:py-12 lg:px-8">
          <div className="mb-4 flex min-h-0 flex-wrap items-center gap-2 text-sm text-gray-400 md:mb-6 md:text-xs [word-break:break-word]">
            <Link
              to="/"
              className="inline-flex min-h-11 min-w-[44px] items-center py-1.5 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:min-h-0 md:min-w-0"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
            <span className="inline-flex min-h-11 min-w-0 max-w-full items-center py-1.5 font-medium text-gray-600 md:min-h-0">Articles</span>
          </div>

          <div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 max-w-full">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 inline-flex min-h-9 max-w-full flex-wrap items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 md:mb-4"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden />
                <span className="min-w-0 text-sm font-semibold text-blue-700 [word-break:break-word]">Knowledge Base</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="min-w-0 max-w-full text-left text-[clamp(1.5rem,6vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900 [overflow-wrap:anywhere] md:text-3xl lg:text-4xl"
              >
                Articles & Guides
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 min-w-0 max-w-full leading-[1.6] text-gray-500 [font-size:clamp(0.9rem,3.5vw,1.1rem)] [overflow-wrap:anywhere] md:max-w-xl md:text-[calc(15px+3pt)]"
              >
                Expert articles on GST, company registration, trademark, tax filing, and business compliance — written by
                our specialists.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative w-full min-w-0 shrink-0 md:w-72"
            >
              <label htmlFor="articles-search" className="sr-only">
                Search articles
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                id="articles-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="h-11 w-full min-h-[44px] [box-sizing:border-box] rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-base text-gray-900 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 md:h-auto md:min-h-0 md:text-sm"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 min-w-0 max-w-full overflow-x-hidden md:mt-8"
          >
            <div
              className="flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] md:flex-wrap md:overflow-x-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Filter by category"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!activeCat}
                onClick={() => setActiveCat('')}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 min-h-9 md:px-4 ${
                  !activeCat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'border border-gray-200 bg-white text-gray-600 [@media(hover:hover)]:md:hover:border-blue-200 [@media(hover:hover)]:md:hover:text-blue-700'
                }`}
                style={{ minHeight: 36 }}
              >
                All ({allArticles.length})
              </button>
              {categories
                .filter((c) => allArticles.some((a) => a.category === c))
                .map((cat) => {
                  const count = allArticles.filter((a) => a.category === cat).length;
                  const selected = activeCat === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveCat(selected ? '' : cat)}
                      className={`max-w-[min(100%,20rem)] shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-left text-sm font-medium [overflow-wrap:anywhere] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 min-h-9 max-md:pr-2 md:max-w-none md:px-4 ${getArticleCategoryPillClasses(cat, selected)}`}
                      style={{ minHeight: 36 }}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </div>

      <section
        className="mx-auto w-full min-w-0 max-w-7xl [box-sizing:border-box] overflow-x-hidden px-4 pt-12 pb-24 min-[360px]:px-4 sm:px-6 max-md:pb-28 md:px-6 md:py-12 md:pb-12 lg:px-8"
        aria-label="Articles"
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center min-[400px]:py-16 sm:py-24">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden />
            <h3 className="text-base font-semibold text-gray-500">No articles found</h3>
            <p className="mt-1 text-sm text-gray-400 [word-break:break-word]">Try a different search or category filter.</p>
          </div>
        ) : (
          <>
            {featured && !search && !activeCat && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 w-full min-w-0 min-[500px]:mb-8 md:mb-10">
                <Link
                  to={`/articles/${featured.slug}`}
                  className="group/feat block w-full min-w-0 max-w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-sm [box-sizing:border-box] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:transition-all md:duration-300 [@media(hover:hover)]:md:hover:border-gray-300 [@media(hover:hover)]:md:hover:shadow-xl [@media(hover:hover)]:md:hover:shadow-gray-200/60"
                >
                  <div className="grid min-w-0 grid-cols-1 [box-sizing:border-box] lg:grid-cols-2">
                    <div
                      className={`relative w-full min-h-[200px] overflow-hidden max-md:aspect-[16/9] lg:min-h-0 ${
                        featured.coverImage ? '' : 'min-h-[200px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 md:min-h-[280px] lg:min-h-0'
                      }`}
                    >
                      {featured.coverImage ? (
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          width={800}
                          height={450}
                          loading="eager"
                          decoding="async"
                          className="h-full w-full min-h-[200px] object-cover object-center lg:aspect-auto lg:min-h-full [@media(hover:hover)]:md:group-hover/feat:scale-105 lg:transition-transform lg:duration-500"
                        />
                      ) : (
                        <div className="flex h-full min-h-[200px] items-center justify-center py-8 md:min-h-[280px]">
                          <BookOpen className="h-20 w-20 text-blue-300/60" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col justify-center [box-sizing:border-box] p-4 [word-break:break-word] [overflow-wrap:break-word] min-[500px]:p-6 md:p-8">
                      <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 md:mb-4">
                        <span className="inline-flex min-h-9 items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-600">
                          Featured
                        </span>
                        {featured.category && <CategoryBadge cat={featured.category} />}
                      </div>
                      <h2 className="min-w-0 text-xl font-bold leading-snug text-gray-900 [overflow-wrap:anywhere] min-[500px]:text-2xl [@media(hover:hover)]:md:group-hover/feat:text-blue-700 md:transition-colors">
                        {featured.title}
                      </h2>
                      <p className="mt-2 min-w-0 text-gray-500 [font-size:clamp(0.9rem,3.5vw,1rem)] [overflow-wrap:anywhere] md:mb-6 md:mt-0 md:text-[length:inherit]">
                        {featured.excerpt}
                      </p>
                      <div className="mt-4 flex min-w-0 flex-col gap-3 min-[500px]:mt-6 min-[500px]:flex-row min-[500px]:flex-wrap min-[500px]:items-center min-[500px]:justify-between">
                        <div className="flex min-w-0 flex-col gap-2 text-sm text-gray-400 [word-break:break-word] min-[500px]:flex-row min-[500px]:flex-wrap min-[500px]:gap-3 min-[500px]:text-[calc(12px+3pt)]">
                          <span className="inline-flex min-h-11 min-w-0 items-center gap-1.5 min-[500px]:min-h-0">
                            <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {featured.author}
                          </span>
                          <span className="inline-flex min-h-11 min-w-0 items-center gap-1.5 min-[500px]:min-h-0">
                            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {formatReadingTimeLabel(featured.content)}
                          </span>
                        </div>
                        <span className="inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-1.5 rounded-xl bg-gray-50 px-3 text-sm font-semibold text-blue-600 min-[500px]:min-h-11 min-[500px]:w-auto min-[500px]:justify-end min-[500px]:rounded-lg min-[500px]:bg-transparent min-[500px]:px-0 [@media(hover:hover)]:md:group-hover/feat:text-blue-800">
                          Read article
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            <ul
              role="list"
              className="grid w-full min-w-0 max-w-full list-none [box-sizing:border-box] grid-cols-1 content-start gap-6 [overflow-wrap:break-word] min-[769px]:grid-cols-2 lg:grid-cols-3"
            >
              {listArticles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
