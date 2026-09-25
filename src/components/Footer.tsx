import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Logo } from './Logo';
import { categories, tools } from '@/data/toolConfig';

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/disclaimer', label: 'Disclaimer' },
];

export function Footer() {
  const popularTools = tools.filter((t) => t.popular).slice(0, 6);

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container-base py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              Free online tools for everyone. Fast, simple and privacy-friendly.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h3>
            <ul className="mt-3 space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/tools/${cat.slug}`}
                    className="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Popular Tools</h3>
            <ul className="mt-3 space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={tool.route}
                    className="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} FreeToolsHub. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            Built with <Heart className="h-4 w-4 fill-error-500 text-error-500" /> for everyone
          </p>
        </div>
      </div>
    </footer>
  );
}
