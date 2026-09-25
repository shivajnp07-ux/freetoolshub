import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { setSeo } from '@/utils/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolCard } from '@/components/ToolCard';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { EmptyState } from '@/components/States';
import {
  categories,
  getCategoryBySlug,
  getToolsByCategory,
  searchTools,
} from '@/data/toolConfig';

export function CategoryPage() {
  const location = useLocation();
  const categorySlug = location.pathname.split('/').filter(Boolean).pop() ?? '';
  const [query, setQuery] = useState('');

  const category = useMemo(() => getCategoryBySlug(categorySlug ?? ''), [categorySlug]);

  const categoryTools = useMemo(() => {
    if (!category) return [];
    return getToolsByCategory(category.id);
  }, [category]);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return categoryTools;
    const searchResults = searchTools(query);
    const resultIds = new Set(searchResults.map((t) => t.id));
    return categoryTools.filter((t) => resultIds.has(t.id));
  }, [query, categoryTools]);

  useEffect(() => {
    if (category) {
      setSeo({
        title: `${category.name} — Free Online Tools`,
        description: category.longDescription,
        path: `/tools/${category.slug}`,
      });
    }
  }, [category]);

  if (!category) {
    return (
      <div className="container-base py-16">
        <EmptyState
          title="Category not found"
          message="The category you're looking for doesn't exist."
          actionLabel="Browse all tools"
          actionTo="/tools"
        />
      </div>
    );
  }

  const Icon = category.icon;
  const relatedCategories = categories.filter((c) => c.id !== category.id);

  return (
    <div className="container-base py-8">
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: category.name }]} />

      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          <p className="mt-1 max-w-2xl text-gray-600 dark:text-gray-400">
            {category.longDescription}
          </p>
        </div>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${category.name.toLowerCase()}...`}
          aria-label={`Search ${category.name}`}
          className="input-base pl-10"
        />
      </div>

      <AdPlaceholder className="mt-6" />

      <div className="mt-8">
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} available
        </p>
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tools found"
            message="Try a different search term or browse other categories."
          />
        )}
      </div>

      {/* Related categories */}
      <section aria-labelledby="related-categories-heading" className="mt-12">
        <h2 id="related-categories-heading" className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Related Categories
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedCategories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/tools/${cat.slug}`}
                className="card-base card-hover group flex items-center gap-4 p-4"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  <CatIcon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-primary-500 dark:text-gray-600" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
