import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ToolsPage } from '@/pages/ToolsPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ToolPage } from '@/pages/ToolPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { PrivacyPage, TermsPage, DisclaimerPage } from '@/pages/LegalPages';
import { NotFoundPage } from '@/pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/pdf" element={<CategoryPage />} />
            <Route path="/tools/image" element={<CategoryPage />} />
            <Route path="/tools/developer" element={<CategoryPage />} />
            <Route path="/tools/business" element={<CategoryPage />} />
            <Route path="/tools/calculators" element={<CategoryPage />} />
            <Route path="/tools/productivity" element={<CategoryPage />} />
            <Route path="/tools/:slug" element={<ToolPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}
