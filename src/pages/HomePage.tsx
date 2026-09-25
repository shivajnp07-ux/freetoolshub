import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, UserX, ArrowRight, Sparkles, Smartphone, FileText, QrCode, Calculator, Braces } from 'lucide-react';
import { setSeo, SITE_NAME, DEFAULT_DESCRIPTION } from '@/utils/seo';
import { ToolSearch } from '@/components/ToolSearch';
import { ToolCard } from '@/components/ToolCard';
import { PopularTools } from '@/components/PopularTools';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { FaqSection } from '@/components/FaqSection';
import type { FaqItem } from '@/components/FaqSection';
import {
  categories,
  getPopularTools,
  getRecentlyAddedTools,
  tools,
} from '@/data/toolConfig';

const homeFaqs: FaqItem[] = [
  {
    question: 'Are all tools on FreeToolsHub really free?',
    answer:
      'Yes. Every tool on FreeToolsHub is completely free to use with no hidden costs, no premium tiers, and no signup required.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. All tools work without registration. Just visit the tool page and start using it immediately.',
  },
  {
    question: 'Are my files uploaded to a server?',
    answer:
      'For many tools, files can be processed locally in your browser. Your files should not be uploaded unless a specific tool requires server-side processing.',
  },
  {
    question: 'What types of tools are available?',
    answer:
      'We offer PDF tools, image tools, developer utilities, business tools, calculators, and productivity tools — with more being added regularly.',
  },
  {
    question: 'Can I use these tools on mobile?',
    answer:
      'Yes. FreeToolsHub is fully responsive and works on phones, tablets, and desktops with a touch-friendly interface.',
  },
];

const whyFeatures = [
  {
    icon: Shield,
    title: 'Privacy-focused processing',
    description: 'Many tools process files right in your browser — nothing leaves your device.',
  },
  {
    icon: UserX,
    title: 'No unnecessary signup',
    description: 'Jump straight into any tool. No account, no email, no friction.',
  },
  {
    icon: Zap,
    title: 'Fast and easy to use',
    description: 'Clean interfaces that get out of your way and deliver results instantly.',
  },
];

export function HomePage() {
  useEffect(() => {
    setSeo({
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      path: '/',
    });
  }, []);

  const popularTools = useMemo(() => getPopularTools(), []);
  const recentlyAdded = useMemo(() => getRecentlyAddedTools(), []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-500/5" />
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12), transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <Braces className="pointer-events-none absolute top-20 left-10 hidden h-12 w-12 text-primary-200 animate-float sm:block dark:text-primary-500/20" style={{ animationDelay: '0s' }} />
        <FileText className="pointer-events-none absolute top-32 right-16 hidden h-12 w-12 text-primary-200 animate-float sm:block dark:text-primary-500/20" style={{ animationDelay: '2s' }} />
        <QrCode className="pointer-events-none absolute bottom-20 left-20 hidden h-12 w-12 text-primary-200 animate-float sm:block dark:text-primary-500/20" style={{ animationDelay: '4s' }} />
        <Calculator className="pointer-events-none absolute bottom-24 right-12 hidden h-12 w-12 text-primary-200 animate-float sm:block dark:text-primary-500/20" style={{ animationDelay: '1s' }} />

        <div className="container-base py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge-base bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
              <Sparkles className="h-3.5 w-3.5" /> 15+ free tools and growing
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl text-balance">
              Free Online Tools for <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">Everyone</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 sm:text-xl text-balance">
              Fast, simple and free tools for PDFs, images, developers, business and everyday tasks.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <ToolSearch />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Popular:</span>
              <Link to="/tools/json-formatter" className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:text-primary-400">JSON Formatter</Link>
              <Link to="/tools/pdf-compressor" className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:text-primary-400">PDF Compressor</Link>
              <Link to="/tools/qr-code-generator" className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:text-primary-400">QR Code</Link>
              <Link to="/tools/base64-encoder-decoder" className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:text-primary-400">Base64</Link>
              <Link to="/tools/invoice-generator" className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:text-primary-400">Invoice Generator</Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Privacy-first</span>
              <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Instant results</span>
              <span className="flex items-center gap-2"><UserX className="h-4 w-4" /> No signup</span>
              <span className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Works on mobile</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-base py-12">
        {/* Category cards */}
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const toolCount = tools.filter((t) => t.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  to={`/tools/${cat.slug}`}
                  className="card-base card-hover group flex items-start gap-4 p-5"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:group-hover:bg-primary-500/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {cat.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                      {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-primary-500 dark:text-gray-600" />
                </Link>
              );
            })}
          </div>
        </section>

        <AdPlaceholder className="mt-10" />

        {/* Popular tools */}
        <div className="mt-10">
          <PopularTools tools={popularTools} limit={6} />
        </div>

        {/* Recently added */}
        {recentlyAdded.length > 0 && (
          <section aria-labelledby="recently-added-heading" className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="recently-added-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
                Recently Added
              </h2>
              <Link
                to="/tools"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentlyAdded.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Why FreeToolsHub */}
        <section aria-labelledby="why-heading" className="mt-16">
          <div className="text-center">
            <h2 id="why-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Why FreeToolsHub?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-600 dark:text-gray-400">
              We believe online tools should be fast, private, and accessible to everyone.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {whyFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-base p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Privacy notice */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50/50 px-5 py-4 dark:border-primary-500/20 dark:bg-primary-500/5">
          <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For many tools, files can be processed locally in your browser. Your files should not be
            uploaded unless a specific tool requires server-side processing.
          </p>
        </div>

        {/* FAQ */}
        <FaqSection items={homeFaqs} />
      </div>
    </>
  );
}
