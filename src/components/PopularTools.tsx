import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToolCard } from './ToolCard';
import type { Tool } from '@/data/toolConfig';

export function PopularTools({ tools, limit }: { tools: Tool[]; limit?: number }) {
  const display = limit ? tools.slice(0, limit) : tools;
  return (
    <section aria-labelledby="popular-tools-heading">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="popular-tools-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
          Popular Tools
        </h2>
        <Link
          to="/tools"
          className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
