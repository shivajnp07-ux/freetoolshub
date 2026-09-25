import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { ToolSearch } from './ToolSearch';
import { categories } from '@/data/toolConfig';

const navLinks = [
  { to: '/tools', label: 'Tools' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();
  const navLinkClass = (to: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === to
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container-base">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <Link to="/tools" className={navLinkClass('/tools')}>
              Tools
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className={navLinkClass('/tools')} aria-expanded={categoriesOpen}>
                Categories
              </button>
              {categoriesOpen && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-card-hover animate-slide-down dark:border-gray-800 dark:bg-gray-900">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          to={`/tools/${cat.slug}`}
                          className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                          <span>
                            <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                              {cat.name}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {cat.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden flex-1 max-w-xs lg:block">
            <ToolSearch />
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="btn-ghost lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 lg:hidden dark:border-gray-800">
            <div className="mb-4">
              <ToolSearch />
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Categories
              </p>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    to={`/tools/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    {cat.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


