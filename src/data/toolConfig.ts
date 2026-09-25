import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Combine,
  Scissors,
  Image as ImageIcon,
  FileImage,
  Braces,
  BadgeCheck,
  Binary,
  Link2,
  KeyRound,
  Fingerprint,
  Hash,
  Receipt,
  Calculator,
  QrCode,
} from 'lucide-react';

export type CategoryId =
  | 'pdf'
  | 'image'
  | 'developer'
  | 'business'
  | 'calculators'
  | 'productivity';

export interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: CategoryId;
  icon: LucideIcon;
  keywords: string[];
  popular: boolean;
  route: string;
  recentlyAdded?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  longDescription: string;
}

export const categories: Category[] = [
  {
    id: 'pdf',
    name: 'PDF & Files',
    slug: 'pdf',
    description: 'Compress, merge, split and manage your PDF documents.',
    icon: FileText,
    longDescription:
      'Free PDF tools to compress, merge, and split documents right in your browser. No uploads, no signups — your files stay private.',
  },
  {
    id: 'image',
    name: 'Image Tools',
    slug: 'image',
    description: 'Optimize and convert images without losing quality.',
    icon: ImageIcon,
    longDescription:
      'Compress and convert images between formats with a simple interface. Perfect for web optimization and everyday use.',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    description: 'Format, validate, encode and generate for everyday dev work.',
    icon: Braces,
    longDescription:
      'A growing collection of developer utilities — formatters, validators, encoders, decoders and generators that speed up your workflow.',
  },
  {
    id: 'business',
    name: 'Business Tools',
    slug: 'business',
    description: 'Create invoices and handle everyday business tasks.',
    icon: Receipt,
    longDescription:
      'Practical business tools to help you generate invoices and manage documents without expensive software.',
  },
  {
    id: 'calculators',
    name: 'Calculators',
    slug: 'calculators',
    description: 'Quick calculators for everyday math and finance.',
    icon: Calculator,
    longDescription:
      'Simple, fast calculators for percentages, discounts, and other common calculations — no clutter, just answers.',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    slug: 'productivity',
    description: 'Generate QR codes and other handy everyday tools.',
    icon: QrCode,
    longDescription:
      'Handy productivity tools that help you get things done faster — generate QR codes, convert data, and more.',
  },
];

export const tools: Tool[] = [
  {
    id: 1,
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    description: 'Reduce PDF file size while keeping good quality.',
    category: 'pdf',
    icon: FileText,
    keywords: ['pdf', 'compress', 'reduce', 'shrink', 'optimize', 'file size'],
    popular: true,
    route: '/tools/pdf-compressor',
  },
  {
    id: 2,
    name: 'PDF Merger',
    slug: 'pdf-merger',
    description: 'Combine multiple PDF files into one document.',
    category: 'pdf',
    icon: Combine,
    keywords: ['pdf', 'merge', 'combine', 'join', 'concatenate'],
    popular: true,
    route: '/tools/pdf-merger',
  },
  {
    id: 3,
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    description: 'Split a PDF into individual pages or page ranges.',
    category: 'pdf',
    icon: Scissors,
    keywords: ['pdf', 'split', 'separate', 'extract', 'pages'],
    popular: false,
    route: '/tools/pdf-splitter',
  },
  {
    id: 4,
    name: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Compress JPG and PNG images without visible quality loss.',
    category: 'image',
    icon: ImageIcon,
    keywords: ['image', 'compress', 'optimize', 'jpg', 'png', 'reduce size'],
    popular: true,
    route: '/tools/image-compressor',
  },
  {
    id: 5,
    name: 'Image Converter',
    slug: 'image-converter',
    description: 'Convert images between JPG, PNG, WebP and more.',
    category: 'image',
    icon: FileImage,
    keywords: ['image', 'convert', 'jpg', 'png', 'webp', 'format'],
    popular: false,
    route: '/tools/image-converter',
  },
  {
    id: 6,
    name: 'JSON Formatter',
    slug: 'json-formatter',
    description: 'Beautify and format JSON with proper indentation.',
    category: 'developer',
    icon: Braces,
    keywords: ['json', 'format', 'beautify', 'pretty print', 'indent'],
    popular: true,
    route: '/tools/json-formatter',
  },
  {
    id: 7,
    name: 'JSON Validator',
    slug: 'json-validator',
    description: 'Validate JSON syntax and find errors instantly.',
    category: 'developer',
    icon: BadgeCheck,
    keywords: ['json', 'validate', 'check', 'syntax', 'error', 'lint'],
    popular: false,
    route: '/tools/json-validator',
  },
  {
    id: 8,
    name: 'Base64 Encoder/Decoder',
    slug: 'base64-encoder-decoder',
    description: 'Encode text to Base64 or decode Base64 back to text.',
    category: 'developer',
    icon: Binary,
    keywords: ['base64', 'encode', 'decode', 'convert', 'binary'],
    popular: true,
    route: '/tools/base64-encoder-decoder',
  },
  {
    id: 9,
    name: 'URL Encoder/Decoder',
    slug: 'url-encoder-decoder',
    description: 'Encode or decode URLs and query parameters.',
    category: 'developer',
    icon: Link2,
    keywords: ['url', 'encode', 'decode', 'uri', 'query', 'percent encoding'],
    popular: false,
    route: '/tools/url-encoder-decoder',
  },
  {
    id: 10,
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    description: 'Decode JSON Web Tokens and inspect header and payload.',
    category: 'developer',
    icon: KeyRound,
    keywords: ['jwt', 'decode', 'token', 'json web token', 'auth'],
    popular: true,
    route: '/tools/jwt-decoder',
  },
  {
    id: 11,
    name: 'UUID Generator',
    slug: 'uuid-generator',
    description: 'Generate random UUIDs (v4) in bulk.',
    category: 'developer',
    icon: Fingerprint,
    keywords: ['uuid', 'guid', 'generate', 'random', 'identifier', 'v4'],
    popular: false,
    recentlyAdded: true,
    route: '/tools/uuid-generator',
  },
  {
    id: 12,
    name: 'Hash Generator',
    slug: 'hash-generator',
    description: 'Generate MD5, SHA-1, SHA-256 and other hashes.',
    category: 'developer',
    icon: Hash,
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'digest', 'checksum'],
    popular: false,
    recentlyAdded: true,
    route: '/tools/hash-generator',
  },
  {
    id: 13,
    name: 'Invoice Generator',
    slug: 'invoice-generator',
    description: 'Create professional invoices and download as PDF.',
    category: 'business',
    icon: Receipt,
    keywords: ['invoice', 'receipt', 'billing', 'payment', 'business'],
    popular: true,
    route: '/tools/invoice-generator',
  },
  {
    id: 14,
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    description: 'Calculate percentages, discounts and increases quickly.',
    category: 'calculators',
    icon: Calculator,
    keywords: ['percentage', 'calculator', 'discount', 'increase', 'percent'],
    popular: true,
    route: '/tools/percentage-calculator',
  },
  {
    id: 15,
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    description: 'Generate QR codes for URLs, text, WiFi and more.',
    category: 'productivity',
    icon: QrCode,
    keywords: ['qr', 'qr code', 'generate', 'barcode', 'scan'],
    popular: true,
    recentlyAdded: true,
    route: '/tools/qr-code-generator',
  },
];

export function getCategory(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categoryId: CategoryId): Tool[] {
  return tools.filter((t) => t.category === categoryId);
}

export function getPopularTools(): Tool[] {
  return tools.filter((t) => t.popular);
}

export function getRecentlyAddedTools(): Tool[] {
  return tools.filter((t) => t.recentlyAdded);
}

export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  const sameCategory = tools.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  );
  const others = tools.filter(
    (t) => t.category !== tool.category && t.id !== tool.id
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools.filter((t) => {
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
