import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { setSeo } from '@/utils/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useToast } from '@/context/ToastContext';

export function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSeo({
      title: 'Contact Us',
      description: 'Get in touch with the FreeToolsHub team. We welcome feedback, feature requests and questions about our free online tools.',
      path: '/contact',
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast('Thank you for your message! We will get back to you soon.', 'success');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className="container-base py-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a question, feedback, or a tool suggestion? We'd love to hear from you.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Email</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">support@freetoolshub.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Feedback</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use the form below to send us your thoughts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-base mt-1.5"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base mt-1.5"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="input-base mt-1.5 resize-none"
                placeholder="Tell us what you think..."
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
