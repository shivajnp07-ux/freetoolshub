import { useEffect } from 'react';
import { Shield, Zap, Globe, Heart } from 'lucide-react';
import { setSeo } from '@/utils/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdPlaceholder } from '@/components/AdPlaceholder';

const values = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Many of our tools process files directly in your browser. Your data stays yours.',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    description: 'No bloated interfaces. Just clean, purpose-built tools that deliver results instantly.',
  },
  {
    icon: Globe,
    title: 'Free for Everyone',
    description: 'No paywalls, no premium tiers, no hidden costs. All tools are free for everyone, everywhere.',
  },
  {
    icon: Heart,
    title: 'Made with Care',
    description: 'We build tools we want to use ourselves — and we keep them maintained and growing.',
  },
];

export function AboutPage() {
  useEffect(() => {
    setSeo({
      title: 'About FreeToolsHub',
      description: 'Learn about FreeToolsHub — our mission to provide fast, free and privacy-friendly online tools for developers, businesses, students and everyday users.',
      path: '/about',
    });
  }, []);

  return (
    <div className="container-base py-8">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">About FreeToolsHub</h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        FreeToolsHub is a worldwide free online tools platform built for developers, businesses,
        students and everyday users. Our mission is simple: make useful tools accessible to everyone,
        without paywalls, signups, or privacy compromises.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title} className="card-base p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{value.title}</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{value.description}</p>
            </div>
          );
        })}
      </div>

      <AdPlaceholder className="mt-10" />

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Story</h2>
        <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            FreeToolsHub started with a simple frustration: too many online tools are cluttered with
            ads, require signups, or upload your files to servers you've never heard of. We wanted
            something better.
          </p>
          <p>
            Today, we offer a growing collection of tools across PDF, image, developer, business,
            calculator and productivity categories — all free, all privacy-conscious, and all designed
            to get out of your way.
          </p>
          <p>
            We're constantly adding new tools and improving existing ones. If you have a suggestion or
            a tool you'd like to see, we'd love to hear from you.
          </p>
        </div>
      </section>
    </div>
  );
}
