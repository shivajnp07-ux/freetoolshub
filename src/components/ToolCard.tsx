import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/data/toolConfig';

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.route}
      className="card-base card-hover group flex flex-col p-5"
      aria-label={`${tool.name} — ${tool.description}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:group-hover:bg-primary-500/20">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {tool.popular ? (
          <span className="badge-base bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            Popular
          </span>
        ) : tool.recentlyAdded ? (
          <span className="badge-base bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500">
            New
          </span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1 text-sm font-medium text-primary-600 transition-transform group-hover:gap-2 dark:text-primary-400">
          Open <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
