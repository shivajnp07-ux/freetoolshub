import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import { setSeo } from '@/utils/seo';

export function NotFoundPage() {
  useEffect(() => {
    setSeo({
      title: 'Page Not Found',
      description: 'The page you are looking for could not be found on FreeToolsHub.',
      path: '/404',
    });
  }, []);

  return (
    <div className="container-base flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
      <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link to="/tools" className="btn-secondary">
          Browse all tools <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
