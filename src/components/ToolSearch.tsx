import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { searchTools, categories } from '@/data/toolConfig';
import type { Tool } from '@/data/toolConfig';

export function ToolSearch({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length >= 1) {
      setResults(searchTools(query));
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        navigate(`/tools?q=${encodeURIComponent(query.trim())}`);
        setQuery('');
        setIsOpen(false);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        navigate(results[activeIndex].route);
        setQuery('');
        setIsOpen(false);
      } else if (results.length > 0) {
        navigate(results[0].route);
        setQuery('');
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function getCategoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId;
  }

  function handleResultClick(route: string) {
    navigate(route);
    setQuery('');
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search tools..."
          aria-label="Search tools"
          className="input-base pl-10 pr-9"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-card-hover animate-slide-down dark:border-gray-800 dark:bg-gray-900 scrollbar-thin">
          <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          {results.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleResultClick(tool.route)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  activeIndex === index
                    ? 'bg-primary-50 dark:bg-primary-500/10'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {tool.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                    {getCategoryName(tool.category)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white px-4 py-6 text-center shadow-card-hover animate-slide-down dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tools found for &ldquo;{query}&rdquo;
          </p>
          <Link
            to="/tools"
            onClick={() => setIsOpen(false)}
            className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Browse all tools
          </Link>
        </div>
      )}
    </div>
  );
}
