import { useEffect, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import type { Crumb } from './Breadcrumbs';
import { AdPlaceholder } from './AdPlaceholder';
import { RelatedTools } from './RelatedTools';
import { FaqSection } from './FaqSection';
import { HowToUse, ToolFeatures } from './tool/ToolSections';
import {
  getRelatedTools,
  getCategory,
  getToolBySlug,
  type Tool,
} from '@/data/toolConfig';
import { getToolMetadata, type ToolMetadata } from '@/data/toolMetadata';
import { setSeo } from '@/utils/seo';
import { toolRegistry } from '@/tools/registry';

const PRIVACY_MESSAGE =
  'For many tools, files can be processed locally in your browser. Your files should not be uploaded unless a specific tool requires server-side processing.';

export function ToolPageLayout({
  tool,
  metadata,
  children,
}: {
  tool: Tool;
  metadata: ToolMetadata;
  children: ReactNode;
}) {
  useEffect(() => {
    setSeo({
      title: metadata.metaTitle,
      description: metadata.metaDescription,
      path: tool.route,
    });
  }, [tool, metadata]);

  const Icon = tool.icon;
  const category = getCategory(tool.category);
  const breadcrumbs: Crumb[] = [
    { label: 'Tools', to: '/tools' },
    { label: category?.name ?? tool.category, to: `/tools/${tool.category}` },
    { label: tool.name },
  ];

  const related = getRelatedTools(tool, 4);

  return (
    <div className="container-base py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{tool.name}</h1>
          <p className="mt-1 text-base text-gray-600 dark:text-gray-400">{tool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {/* Main tool workspace */}
          <div className="card-base p-6">{children}</div>

          <AdPlaceholder className="mt-6" />

          <PrivacyNotice />

          <HowToUse steps={metadata.howTo} />

          <AdPlaceholder className="mt-8" />

          <ToolFeatures features={metadata.features} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdPlaceholder format="square" />
        </aside>
      </div>

      <FaqSection items={metadata.faqs} />

      <RelatedTools tools={related} />
    </div>
  );
}

export function PrivacyNotice() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50/50 px-4 py-3 dark:border-primary-500/20 dark:bg-primary-500/5">
      <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{PRIVACY_MESSAGE}</p>
    </div>
  );
}

export function ToolNotFound() {
  return (
    <div className="container-base py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tool not found</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">The tool you're looking for doesn't exist.</p>
      <Link to="/tools" className="btn-primary mt-6">
        Browse all tools <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function ToolPageRenderer({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  const metadata = getToolMetadata(slug);

  if (!tool || !metadata) {
    return <ToolNotFound />;
  }

  const ToolComponent = toolRegistry[slug];
  if (!ToolComponent) {
    return <ToolNotFound />;
  }

  return (
    <ToolPageLayout tool={tool} metadata={metadata}>
      <ToolComponent />
    </ToolPageLayout>
  );
}

export function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ToolPageRenderer slug={slug ?? ''} />;
}
