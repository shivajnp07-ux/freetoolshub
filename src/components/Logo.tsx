import { Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-bold ${className}`} aria-label="FreeToolsHub home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
        <Wrench className="h-5 w-5" />
      </span>
      <span className="text-lg tracking-tight text-gray-900 dark:text-white">
        Free<span className="text-primary-600">Tools</span>Hub
      </span>
    </Link>
  );
}
