import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ items, title = 'Frequently Asked Questions' }: { items: FaqItem[]; title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index}>
              <h3>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </h3>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
