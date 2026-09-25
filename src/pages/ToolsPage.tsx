import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { setSeo } from '@/utils/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolCard } from '@/components/ToolCard';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { EmptyState } from '@/components/States';
import { categories, tools, searchTools } from '@/data/toolConfig';
import type { CategoryId } from '@/data/toolConfig';

export function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');

  useEffect(() => {
    setSeo({
      title: 'All Tools',
      description: `Browse all free online tools on FreeToolsHub — ${tools.length} tools across PDF, image, developer, business, calculators and productivity categories.`,
      path: '/tools',
    });
  }, []);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const filteredTools = useMemo(() => {
    let result = tools;
    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (query.trim()) {
      const searchResults = searchTools(query);
      const resultIds = new Set(searchResults.map((t) => t.id));
      result = result.filter((t) => resultIds.has(t.id));
    }
    return result;
  }, [query, activeCategory]);

  function handleSearchChange(value: string) {
    setQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  function clearFilters() {
    setQuery('');
    setActiveCategory('all');
    setSearchParams({}, { replace: true });
  }

  const hasFilters = query.trim() || activeCategory !== 'all';

  return (
    <div className="container-base py-8">
      <Breadcrumbs items={[{ label: 'Tools' }]} />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Tools</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Browse our complete collection of {tools.length} free online tools.
      </p>

      {/* Search and filter bar */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="input-base pl-10"
          />
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary">
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Filter className="h-4 w-4" /> Filter:
        </span>
        <FilterPill active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
          All ({tools.length})
        </FilterPill>
        {categories.map((cat) => {
          const count = tools.filter((t) => t.category === cat.id).length;
          return (
            <FilterPill
              key={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name} ({count})
            </FilterPill>
          );
        })}
      </div>

      <AdPlaceholder className="mt-6" />

      {/* Tools grid */}
      <div className="mt-8">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tools found"
            message="Try adjusting your search or filter to find what you're looking for."
            actionLabel="Browse all tools"
            actionTo="/tools"
          />
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`badge-base cursor-pointer transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}
