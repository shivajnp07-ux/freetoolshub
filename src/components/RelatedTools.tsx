import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToolCard } from './ToolCard';
import type { Tool } from '@/data/toolConfig';

export function RelatedTools({ tools, limit = 4 }: { tools: Tool[]; limit?: number }) {
  const display = tools.slice(0, limit);
  if (display.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="related-tools-heading" className="text-xl font-bold text-gray-900 dark:text-white">
          Related Tools
        </h2>
        <Link
          to="/tools"
          className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Browse all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {display.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
