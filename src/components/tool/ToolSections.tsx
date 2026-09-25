import { ListChecks, Sparkles } from 'lucide-react';

export function HowToUse({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null;

  return (
    <section aria-labelledby="how-to-heading" className="mt-10">
      <h2 id="how-to-heading" className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <ListChecks className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        How to Use
      </h2>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
              {index + 1}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ToolFeatures({
  features,
}: {
  features: { title: string; description: string }[];
}) {
  if (features.length === 0) return null;

  return (
    <section aria-labelledby="features-heading" className="mt-10">
      <h2 id="features-heading" className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        Features
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
