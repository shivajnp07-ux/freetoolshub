import { useEffect, type ReactNode } from 'react';
import { setSeo } from '@/utils/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdPlaceholder } from '@/components/AdPlaceholder';

export function LegalPage({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}) {
  useEffect(() => {
    setSeo({ title, description, path });
  }, [title, description, path]);

  return (
    <div className="container-base py-8">
      <Breadcrumbs items={[{ label: title }]} />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last updated: September 22, 2026
      </p>

      <AdPlaceholder className="mt-6" />

      <div className="mt-8 max-w-3xl space-y-6 text-gray-600 dark:text-gray-400 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="FreeToolsHub Privacy Policy — how we handle your data, cookies, and file processing."
      path="/privacy"
    >
      <h2>Overview</h2>
      <p>
        At FreeToolsHub, your privacy is a top priority. This policy explains what information we
        collect, how we use it, and the choices you have.
      </p>

      <h2>File Processing</h2>
      <p>
        For many tools, files can be processed locally in your browser. Your files should not be
        uploaded unless a specific tool requires server-side processing. When server-side processing
        is required, files are processed temporarily and deleted immediately afterward.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We do not require you to create an account or provide personal information to use our tools.
        We may collect anonymous usage analytics (such as page views and tool usage counts) to
        improve our service.
      </p>

      <h2>Cookies</h2>
      <p>
        We use minimal cookies — primarily to remember your theme preference (light or dark mode).
        We do not use tracking cookies for advertising purposes at this time.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We may display advertisements from third-party networks in the future. These networks may use
        cookies to serve relevant ads. We will update this policy when that occurs.
      </p>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect any data that is processed through our services.
        However, no method of transmission over the internet is 100% secure.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at support@freetoolshub.com.
      </p>
    </LegalPage>
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="FreeToolsHub Terms of Service — the terms and conditions for using our free online tools."
      path="/terms"
    >
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing and using FreeToolsHub, you accept and agree to be bound by these Terms of
        Service. If you do not agree, please do not use our service.
      </p>

      <h2>Use of Tools</h2>
      <p>
        Our tools are provided free of charge for personal and commercial use. You agree to use them
        responsibly and not for any illegal or unauthorized purpose.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The FreeToolsHub name, logo, and website design are our intellectual property. The tools
        themselves are provided for your use, but the underlying brand and design remain ours.
      </p>

      <h2>Disclaimer of Warranty</h2>
      <p>
        Our tools are provided "as is" without warranties of any kind. We do not guarantee that the
        tools will be error-free, secure, or available at all times.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        FreeToolsHub shall not be liable for any direct, indirect, incidental, or consequential
        damages resulting from the use of our tools.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to update these terms at any time. Continued use of the service after
        changes constitutes acceptance of the new terms.
      </p>
    </LegalPage>
  );
}

export function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="FreeToolsHub Disclaimer — important information about the use of our free online tools."
      path="/disclaimer"
    >
      <h2>General Disclaimer</h2>
      <p>
        The tools and information on FreeToolsHub are provided for general informational and
        utility purposes only. We make no representations about the accuracy or completeness of
        any tool's output.
      </p>

      <h2>Professional Advice</h2>
      <p>
        Tools such as calculators and invoice generators are provided for convenience and should not
        replace professional advice. Always consult a qualified professional for important financial,
        legal, or business decisions.
      </p>

      <h2>File Processing</h2>
      <p>
        While many tools process files locally in your browser, we recommend keeping backups of
        important files before using any online tool. We are not responsible for data loss.
      </p>

      <h2>External Links</h2>
      <p>
        Our website may contain links to external sites. We are not responsible for the content or
        practices of third-party websites.
      </p>

      <h2>No Guarantee of Results</h2>
      <p>
        Tool outputs (such as compressed file sizes or formatted code) may vary based on input. We
        do not guarantee specific results from any tool.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this disclaimer can be sent to support@freetoolshub.com.
      </p>
    </LegalPage>
  );
}
