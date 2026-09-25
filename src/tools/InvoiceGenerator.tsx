import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Printer, Eye, Download, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';
import jsPDF from 'jspdf';
import {
  ToolWorkspace,
  ToolActions,
  Field,
  Select,
  ResetButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const CURRENCY_CONFIG = {
  USD: { label: 'USD — US Dollar ($)', symbol: '$ ', locale: 'en-US', decimals: 2, major: 'Dollars', minor: 'Cents', useIndian: false, taxId: 'EIN' },
  EUR: { label: 'EUR — Euro (€)', symbol: '€ ', locale: 'de-DE', decimals: 2, major: 'Euros', minor: 'Cents', useIndian: false, taxId: 'VAT Reg. No.' },
  GBP: { label: 'GBP — British Pound (£)', symbol: '£ ', locale: 'en-GB', decimals: 2, major: 'Pounds', minor: 'Pence', useIndian: false, taxId: 'VAT Reg. No.' },
  INR: { label: 'INR — Indian Rupee (₹)', symbol: '₹ ', locale: 'en-IN', decimals: 2, major: 'Rupees', minor: 'Paise', useIndian: true, taxId: 'GSTIN' },
  JPY: { label: 'JPY — Japanese Yen (¥)', symbol: '¥ ', locale: 'ja-JP', decimals: 0, major: 'Yen', minor: 'Sen', useIndian: false, taxId: 'Tax ID' },
  CAD: { label: 'CAD — Canadian Dollar (C$)', symbol: 'C$ ', locale: 'en-CA', decimals: 2, major: 'Canadian Dollars', minor: 'Cents', useIndian: false, taxId: 'GST/HST No.' },
  AUD: { label: 'AUD — Australian Dollar (A$)', symbol: 'A$ ', locale: 'en-AU', decimals: 2, major: 'Australian Dollars', minor: 'Cents', useIndian: false, taxId: 'ABN' },
  CNY: { label: 'CNY — Chinese Yuan (¥)', symbol: '¥ ', locale: 'zh-CN', decimals: 2, major: 'Yuan', minor: 'Fen', useIndian: false, taxId: 'Tax ID' },
  BRL: { label: 'BRL — Brazilian Real (R$)', symbol: 'R$ ', locale: 'pt-BR', decimals: 2, major: 'Reais', minor: 'Centavos', useIndian: false, taxId: 'CNPJ' },
  CHF: { label: 'CHF — Swiss Franc (CHF)', symbol: 'CHF ', locale: 'de-CH', decimals: 2, major: 'Francs', minor: 'Rappen', useIndian: false, taxId: 'VAT Reg. No.' },
  AED: { label: 'AED — UAE Dirham (AED)', symbol: 'AED ', locale: 'en-AE', decimals: 2, major: 'Dirhams', minor: 'Fils', useIndian: false, taxId: 'TRN' },
  SGD: { label: 'SGD — Singapore Dollar (S$)', symbol: 'S$ ', locale: 'en-SG', decimals: 2, major: 'Singapore Dollars', minor: 'Cents', useIndian: false, taxId: 'UEN' },
  NZD: { label: 'NZD — New Zealand Dollar (NZ$)', symbol: 'NZ$ ', locale: 'en-NZ', decimals: 2, major: 'New Zealand Dollars', minor: 'Cents', useIndian: false, taxId: 'NZBN' },
  HKD: { label: 'HKD — Hong Kong Dollar (HK$)', symbol: 'HK$ ', locale: 'en-HK', decimals: 2, major: 'Hong Kong Dollars', minor: 'Cents', useIndian: false, taxId: 'BR No.' },
  SEK: { label: 'SEK — Swedish Krona (kr)', symbol: 'kr ', locale: 'sv-SE', decimals: 2, major: 'Kronor', minor: 'Ore', useIndian: false, taxId: 'VAT Reg. No.' },
  NOK: { label: 'NOK — Norwegian Krone (kr)', symbol: 'kr ', locale: 'nb-NO', decimals: 2, major: 'Kroner', minor: 'Ore', useIndian: false, taxId: 'Org. No.' },
  DKK: { label: 'DKK — Danish Krone (kr)', symbol: 'kr ', locale: 'da-DK', decimals: 2, major: 'Kroner', minor: 'Ore', useIndian: false, taxId: 'CVR' },
  PLN: { label: 'PLN — Polish Zloty (zł)', symbol: 'zł ', locale: 'pl-PL', decimals: 2, major: 'Zloty', minor: 'Groszy', useIndian: false, taxId: 'NIP' },
  CZK: { label: 'CZK — Czech Koruna (Kč)', symbol: 'Kč ', locale: 'cs-CZ', decimals: 2, major: 'Koruny', minor: 'Haléře', useIndian: false, taxId: 'DIČ' },
  HUF: { label: 'HUF — Hungarian Forint (Ft)', symbol: 'Ft ', locale: 'hu-HU', decimals: 2, major: 'Forints', minor: 'Filler', useIndian: false, taxId: 'Tax No.' },
  ZAR: { label: 'ZAR — South African Rand (R)', symbol: 'R ', locale: 'en-ZA', decimals: 2, major: 'Rand', minor: 'Cents', useIndian: false, taxId: 'VAT No.' },
  SAR: { label: 'SAR — Saudi Riyal (﷼)', symbol: 'SAR ', locale: 'en-SA', decimals: 2, major: 'Riyals', minor: 'Halalas', useIndian: false, taxId: 'VAT No.' },
  QAR: { label: 'QAR — Qatari Riyal (QR)', symbol: 'QAR ', locale: 'en-QA', decimals: 2, major: 'Riyals', minor: 'Dirhams', useIndian: false, taxId: 'Tax ID' },
  MYR: { label: 'MYR — Malaysian Ringgit (RM)', symbol: 'RM ', locale: 'ms-MY', decimals: 2, major: 'Ringgit', minor: 'Sen', useIndian: false, taxId: 'SSM No.' },
  THB: { label: 'THB — Thai Baht (฿)', symbol: '฿ ', locale: 'th-TH', decimals: 2, major: 'Baht', minor: 'Satang', useIndian: false, taxId: 'Tax ID' },
  IDR: { label: 'IDR — Indonesian Rupiah (Rp)', symbol: 'Rp ', locale: 'id-ID', decimals: 0, major: 'Rupiah', minor: 'Sen', useIndian: false, taxId: 'NPWP' },
  PHP: { label: 'PHP — Philippine Peso (₱)', symbol: '₱ ', locale: 'en-PH', decimals: 2, major: 'Pesos', minor: 'Centavos', useIndian: false, taxId: 'TIN' },
  MXN: { label: 'MXN — Mexican Peso (MX$)', symbol: 'MX$ ', locale: 'es-MX', decimals: 2, major: 'Pesos', minor: 'Centavos', useIndian: false, taxId: 'RFC' },
  TRY: { label: 'TRY — Turkish Lira (₺)', symbol: '₺ ', locale: 'tr-TR', decimals: 2, major: 'Lira', minor: 'Kurus', useIndian: false, taxId: 'VKN' },
  KRW: { label: 'KRW — South Korean Won (₩)', symbol: '₩ ', locale: 'ko-KR', decimals: 0, major: 'Won', minor: 'Jeon', useIndian: false, taxId: 'Business No.' },
  VND: { label: 'VND — Vietnamese Dong (₫)', symbol: '₫ ', locale: 'vi-VN', decimals: 0, major: 'Dong', minor: 'Hao', useIndian: false, taxId: 'Tax ID' },
  TWD: { label: 'TWD — New Taiwan Dollar (NT$)', symbol: 'NT$ ', locale: 'zh-TW', decimals: 0, major: 'Dollars', minor: 'Cents', useIndian: false, taxId: 'VAT No.' },
  ILS: { label: 'ILS — Israeli New Shekel (₪)', symbol: '₪ ', locale: 'he-IL', decimals: 2, major: 'Shekels', minor: 'Agorot', useIndian: false, taxId: 'VAT No.' },
} as const;

type CurrencyCode = keyof typeof CURRENCY_CONFIG;

const CURRENCIES = Object.entries(CURRENCY_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
}));

const CURRENCY_SYMBOLS: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([code, config]) => [code, config.symbol])
);

const CURRENCY_LOCALES: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([code, config]) => [code, config.locale])
);

const CURRENCY_WORDS: Record<string, { major: string; minor: string; useIndian: boolean }> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([code, config]) => [
    code,
    { major: config.major, minor: config.minor, useIndian: config.useIndian },
  ])
);

const CURRENCY_DEFAULT_TAX_ID: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([code, config]) => [code, config.taxId])
);

type LogoSize = 'small' | 'medium' | 'large' | 'xlarge';

const LOGO_SIZES: Record<LogoSize, { w: number; h: number; label: string }> = {
  small: { w: 45, h: 20, label: 'Small' },
  medium: { w: 60, h: 30, label: 'Medium' },
  large: { w: 75, h: 40, label: 'Large' },
  xlarge: { w: 95, h: 50, label: 'Extra large' },
};

const TAX_PRESETS = ['GST', 'CGST+SGST', 'IGST', 'VAT', 'Sales Tax', 'HST', 'Service Tax', 'Tax'];

const TAX_ID_PRESETS = [
  'GSTIN', 'CIN', 'PAN', 'TIN', 'VAT Reg. No.', 'Company No.',
  'EIN', 'Sales Tax ID', 'TRN', 'Trade License No.', 'ABN', 'ACN',
  'BN', 'GST/HST No.', 'UEN', 'GST Reg. No.', 'Tax ID', 'NTN', 'STRN',
];

function decimalsFor(currency: string): number {
  return CURRENCY_CONFIG[currency as CurrencyCode]?.decimals ?? 2;
}

function roundMoney(n: number, currency: string): number {
  const f = 10 ** decimalsFor(currency);
  return Math.round((n + Number.EPSILON) * f) / f;
}

// Characters the built-in PDF font (Helvetica / WinAnsi) can draw. Anything else comes out garbled.
const UNSUPPORTED_PDF_CHARS =
  /[^\u0000-\u00FF\u20B9\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]/;

// Replace ₹ with "Rs." so the built-in Helvetica font never sees a glyph it can't draw.
function sanitizePdfText(s: string): string {
  return s.replace(/\u20B9/g, 'Rs.');
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '';
  const locale = CURRENCY_LOCALES[currency] ?? 'en-US';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const decimals = decimalsFor(currency);
  const formatted = absAmount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  });
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

/**
 * PDF-only currency formatter for the non-INR path.
 * Uses the currency's own locale for digit grouping so the PDF matches the preview.
 * Uses ISO codes for currencies whose native glyph is not WinAnsi-safe.
 * INR never reaches this function — writePdfCurrency() handles it via glyph images.
 */
function formatPdfCurrency(amount: number, currency: string): string {
  const code = String(currency || 'USD').toUpperCase();
  const decimals = decimalsFor(code);
  const locale = CURRENCY_LOCALES[code] ?? 'en-US';
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  });

  const pdfSymbols: Record<string, string> = {
    // WinAnsi-safe symbols
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
    CHF: 'CHF', CAD: 'C$', AUD: 'A$', BRL: 'R$', SGD: 'S$',
    AED: 'AED', NZD: 'NZ$', HKD: 'HK$', SEK: 'kr', NOK: 'kr',
    DKK: 'kr', HUF: 'Ft', MYR: 'RM', IDR: 'Rp',
    MXN: 'MX$', TWD: 'NT$', ZAR: 'R',
    // Native glyph is not WinAnsi-safe — fall back to the ISO code
    PLN: 'PLN',
    CZK: 'CZK',
    THB: 'THB',
    PHP: 'PHP',
    VND: 'VND',
    KRW: 'KRW',
    ILS: 'ILS',
    TRY: 'TRY',
    SAR: 'SAR',
  };
  const prefix = pdfSymbols[code] ?? code;
  return amount < 0 ? `-${prefix} ${formatted}` : `${prefix} ${formatted}`;
}

// jsPDF's built-in fonts do not contain U+20B9 (₹). We render the rupee sign as a tiny
// transparent image and keep the numeric amount as normal selectable PDF text.
const RUPEE_GLYPH = {
  regularBlack: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAABFCAYAAAASJFVGAAADUUlEQVR42u2bTWxNQRTHf08aSiOqKsSCERIyIpL66CiJBVGkJRGJIMLCgh1WTZqoEp9padggERFCiIW2CyIhNmKIj4gYC8SE+FgIXVR8lNbi3UUjOu++cu+7Hfds58yd95v/mTfnzJ2b6enp4X+0QfynloKn4Cl4Cp6C+2RF/ekkpFLAogRxdAPN1uhvkYIDLUBlgsCvWKP3RhrqQqp5CYMGaI5jjW9PGPQja/T1SNe4kKocmAQ8CeFeCpQDQ/IY4jvwLE+GPf2ZrUzURYqQaiJQDawD5ofostYafT7qMMnEWZ0JqWqBE8BYh9tXoMIa/dSbfdwa3R6o/tLhVgwc8UrxXspPB+4Bgx1uVdbo215lbtbox0BDDrdNvqasLUCHo73WS3Br9FfgnMNltJBqSqLWuJCqHtjyD8YfBox0tH8AwuTfn4BZkebqQqqhwDZgVAyBUR7S72w+0P0N9Q0xQYe1LuBopGtcSJUBtiYsV79gjX4TdT1eBhyLoLLqS4CbQGuO/u0DJoHpFUFjgPcOlzpr9AHf9nEAmaP9tY8JTJgk5Y5XuXoQ5iOAF44d4pU1eoKPiu/PsS2e8i5lFVLVAZsdLp3A8Sh/Q1HMwJOBw0BNDtfd1uh3iQMXUoXpV0L23G08MIfs8dMiIBNiX26KWoT+5OoKiOqA4AbZM7fuqMGT8grpJ3AIqLZGd8YxYFGBgbuANmCHNdrEOXAhwT8Ca6zR1woxeCFDvQy4KqQ6EdT4sVremVtwQnrG9UxgeHCyUhrysXeD9d2RWPA8J2kcoIDVwMocS+s2sNAa/WXAg/82CVOBk0CVw+2sNXq9V+ABfDFwMUdVttEafdor8AC+BLgFzOjDpQOYZo1+69W/ujX6M7CK7MvBP1kpcNDL7cwa/RxodLisE1LN9XUfb8J9CWCfl+DW6B9AvcNlgZBqsa9FyiXgvqO90Utwa3RPDjglpFriZVka3JJwqb7T53rcpXqlkGqpl+CB6g/iVD1Jl3hdqs8RUi3zEtwa3Ran6km7tu1SfbaQqsZL8BCqN/iqOMAuR9us4Hakf+DW6FbgYdSqJ/XTDJfqM4VUy70Et0Zfjlr1JH+M41K9Qki14m8enkk/qk3BU/AUPAVPwVPwAWu/AGzL+89vVIkbAAAAAElFTkSuQmCC',
  regularRed: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAABFCAYAAAASJFVGAAADRklEQVR42u2bX2iPURjHPz8txpJhIhekox6R1IzNKBeWf22UlFjiwgV3uFqtzMjf/FncsJJERC5suyBFbrTInyT0xEmRPxdiF5MxNhd7L5bs/N7feN+9O3uf2/Oc9/w+5/uc33me8543093dzVC0YQxRS8FT8BQ8BU/BfbK8/nSyImVARYI4uoCjRvV7pOBAA1CaIPDrRnV/pKFuRRYmDBrgaBxrfGfCoJ8Y1VuRrnErUgQY4FkI90KgCBiRwxA/gJc5Muzrz2xloi5SrMg0YBlQDSwK0WWDUb0UdZhk4qzOrEgV0AhMcrh1AMVG9YU3+7hRbQlUf+1wywdOeKV4L+VnAw+A4Q63cqPa6lXmZlSfAnVZ3Lb4mrI2AG2O9iovwY1qB3DR4TLBikii1rgVqQW2/YfxRwFjHe2fgDD59xegJNJc3YqMBHYA42MIjKKQfhdyge5vqG+KCTqsdQInI13jViQDbE9Yrn7ZqL6Luh4fB5yKoLLqS4A7QFOW/i2DJoHpFUETgY8Olxqjesi3fRxgZpb2tz4mMGGSlHte5epBmI8BrGOHeGNUp/qo+MEs2+JZ71JWK1IDbHW4tAOno/wNeTEDTweOA5VZXPca1Q+JA7ciYfoV0HPuNgWYT8/xUwWQCbEvH4lahP7k6mVAVAcEt+k5c+uKGjwpr5B+AceAZUa1PY4B8wYYuBNoBnYZ1edxDjyQ4J+B9Ub15kAMPpChPg64YUUagxo/Vss5cwtOSM+7ngmMDk5WCkM+9n6wvtsSC57jJE0GyoB1wJosS6sVWGJUvw168D8mYQZwBih3uF0wqhu9Ag/g84ErWaqyzUb1nFfgAXwBcBeY04dLGzDLqL736l/dqH4F1tLzcvBvVggc9nI7M6qvgHqHS7UVWeDrPn4E9yWAA16CG9WfQK3DZbEVWeprkXIVeOhor/cS3Kh2Z4ErsyLLvSxLg1sSLtV3+1yPu1QvtSIrvAQPVH8Up+pJusTrUn2+FVnpJbhRbY5T9aRd23apPs+KVHoJHkL1Ol8VB9jjaCsJbkf6B25Um4DHUaue1E8zXKrPtSKrvAQ3qteiVj3JH+O4VC+2Iqv/5eGZ9KPaFDwFT8FT8BQ8BR+09hu/N/p9eSIxQAAAAABJRU5ErkJggg==',
  boldBlack: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABFCAYAAAD+UTBQAAADY0lEQVR42u2bW4hNURjHf4czhcZQGDVSKy+0yExiWkJoyCQzaTLlVRnxgEIuNaTkZTwQRUq8eWAyCiXNCA+sSImxlDSWJFKuuU0ux8PZ8zIPOnsde5919tnf8/r2/s7v/Nf6LnvvTC6XIzUYkSJIQaQgUhApiBRECiKsZV0dhVQNwCqPf9t1a/TtyEEAXcByTyHkgHORbw0h1WyPIQBcsUY/jeOM2OH5lj8c1iETttcQUtUBFqjyFMJDa3R9HFljq8cQAI5Enj6FVNXABo8hvAXOxpE+xwGbC1hXA0wE5gGLgbHFpEHgTIFrB6zRgy43yUQ9jxBS1QDbgE5gpMMl3gFTrdHfy7qytEZ/tkbvB9qD/B7WJgBrE1NiW6N7gOOO7suijs95awipskB1SLc64KHDFnkFzArpMxhmOxVTYh8EdsYkqCnAh5A+7UB31CW272n0BdATxxmxHhjvMYhj1ujfkYIQUo0Mqktf7QtwKo6ssQYQHoM4Y43+FAeI7R5D+AMcjbzEFlJND+DdLyJYCYwO6fMNeFLAurvW6GdeltjDQE4GXjp0ryet0RsTUVkGttuxhe+OOrARMaqhGdji4DoA3Ig6vmwMALJAB/nxmdPhbI3+5WWvIaSqBab9Y8lYYBKggJYi0u1la3RLHIp1VUQbcCLi2O7G0X6X6rAsWAnACmv010oF8ZH8NKvVGv0xzhtnPQHwlvxcsssa/b4UAfgAog/osEY/L2UQPmyNJuCpkOq0kGpSJYMYUuY6oF9ItaCSQQxZLdArpGqqdBAAo4ALQioZ501dK8ua4N8bbmPIP4eYDbQCS4GMY2yPgEZr9A9vQYQANjdIi7McL9Fljd5V9iACGOOAa0Cjg/tPoMEabcr+jAjmh6uBNw7uVcChxByW1ujXwCZH95VCqoWJyRrW6ItBM+ViB5KWPveQnzSHtSVCqkWJAWGN7gfOO7rvS1pBdQC39ySWCanmJwaENfoxIR/QxqGKUpXYrodfs5BqXmJAWKMfAJd8UkUpmy5XVawSUs1JDAhr9D3gqi+qKHUb7qqKViFVfWJABN9T9Lk0i8DeJCmiGFW0CalmJgaENfomcKvUqvBlVOeqinYh1YzEgLBG9wJ3HOPv/B8xZNKP5P3aGimIFEQKIgWRgkhBlJH9BWZe61o+6ONFAAAAAElFTkSuQmCC',
  boldRed: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABFCAYAAAD+UTBQAAADWElEQVR42u2bX2hOYRzHP+/2KmSj2BQpeS5+Ym1LiBDaZGlbkpVbhbhAIX8KqeVmLogiJbtzwUKhpE24oEiJoZ88QxKtMPI3f+biPbtxoZ3ndc777Lznd/38zvm9n/f7PL8/55xMf38/qUFJiiAFkYJIQaQgUhApiLCWdXW0IrVAo8e/7apRvRk5CKANWOIphH7gdORbw4pUewwB4JJRfRLHGbHN8y1/MKxDJmyvYUUmAM+BYZ5CuG9Ua+LIGps9hgBwKPL0aUVGAes8htALnIojfY4GNg5iXTkwDpgFLATK8kmDQPsg1/YY1e8uN8lEPY+wIuXAFmA3UOpwibfAJKP6dUhXlkb1o1HdB7QE+T2sjQVWJabENqrngKOO7vVRx+e8NaxIFhgV0m0CcN9hi7wCqkL6fA+znfIpsfcD22MS1ETgfUifFqAj6hLb9zT6AjgXxxmxBhjjMYgjRvVXpCCsSGlQXfpqn4ATcWSNlcBkj0G0G9UPcYDY6jGE38DhyEtsKyIBvLt5BDsNGBHS5wvweBDrbhvVp16W2H+BHA+8dOhejxvV9YmoLAPb6djCd0QdWEmMamgANjm49gDXoo4vGwOALLCW3PjM6XA2qj+97DWsSCUw5R9LyoAKYA7QlEe6vWhUm+JQrKsiVgDHIo7tdhztd6EOy0ErAVhqVD8XK4g+ctOsZqPaF+eNs54A6CU3l2wzqu8KEYAPILqAtUb1WSGD8GFr1AFPrMhJK1JRzCAGlLka6LYi84oZxIBVAp1WpK7YQQAMB85akWlx3tS1siwP/r2/bSS55xDVQDOwGMg4xvYAmG1Uv3kLIgSwmUFarHK8RJtR3THkQQQwRgNXgNkO7j+AWqP6aMifEcH8cDnwxsF9GHAgMYelUX0NbHB0X2ZF5icmaxjV80Ez5WKtSUufu8hNmsPaIiuyIDEgjGo3cMbRfW/SCqpW3N6TqLcicxMDwqg+JOQD2jhUUagS2/Xwa7AisxIDwqjeAy74pIpCNl2uqmi0IjMSA8Ko3gEu+6KKQrfhrqpotiI1iQERfE/R5dIsAnuSpIh8VLHCikxPDAijeh24UWhV+DKqc1VFixWZmhgQRrUTuOUY/+7/EUMm/Ujer62RgkhBpCBSECmIFMQQsj8BBulfPyZwRgAAAABJRU5ErkJggg==',
} as const;

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(date: string, days: number): string {
  if (!date) return '';
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return '';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function numberToWords(num: number, currency: string = 'INR'): string {
  const config = CURRENCY_WORDS[currency] ?? CURRENCY_WORDS.INR;
  const { major, minor, useIndian } = config;

  if (num < 0) {
    return `Minus ${numberToWords(Math.abs(num), currency)}`;
  }
  if (num === 0) {
    return `Zero ${major} Only`;
  }

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function twoDigits(n: number): string {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 ? ' ' + ones[n % 10] : ''}`;
  }

  function threeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return `${h ? ones[h] + ' Hundred' : ''}${h && r ? ' ' : ''}${r ? twoDigits(r) : ''}`;
  }

  function toWordsIndian(n: number): string {
    if (n === 0) return 'Zero';
    let result = '';
    const crore = Math.floor(n / 10000000);
    n = n % 10000000;
    const lakh = Math.floor(n / 100000);
    n = n % 100000;
    const thousand = Math.floor(n / 1000);
    n = n % 1000;

    if (crore) result += `${toWordsIndian(crore)} Crore `;
    if (lakh) result += `${twoDigits(lakh)} Lakh `;
    if (thousand) result += `${twoDigits(thousand)} Thousand `;
    if (n) result += threeDigits(n);

    return result.trim();
  }

  function toWordsWestern(n: number): string {
    if (n === 0) return 'Zero';
    let result = '';
    const billion = Math.floor(n / 1000000000);
    n = n % 1000000000;
    const million = Math.floor(n / 1000000);
    n = n % 1000000;
    const thousand = Math.floor(n / 1000);
    n = n % 1000;

    if (billion) result += `${threeDigits(billion)} Billion `;
    if (million) result += `${threeDigits(million)} Million `;
    if (thousand) result += `${threeDigits(thousand)} Thousand `;
    if (n) result += threeDigits(n);

    return result.trim();
  }

  const toWords = useIndian ? toWordsIndian : toWordsWestern;

  const decimals = decimalsFor(currency);
  const minorBase = 10 ** decimals;
  const minorUnits = Math.round(num * minorBase);
  const majorUnits = Math.floor(minorUnits / minorBase);
  const minorUnitsValue = decimals > 0 ? minorUnits % minorBase : 0;

  let words = `${toWords(majorUnits)} ${major}`;
  if (minorUnitsValue > 0) words += ` and ${twoDigits(minorUnitsValue)} ${minor}`;
  words += ' Only';
  return words;
}

function safeNumber(n: unknown): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

const MAX_IMAGE_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TEXT_LENGTH = 5000;
const MAX_ADDRESS_LENGTH = 2000;
const MAX_ITEM_DESCRIPTION_LENGTH = 1000;
const MAX_LINE_ITEMS = 200;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

function clampNumber(value: unknown, min: number, max: number): number {
  return Math.min(max, Math.max(min, safeNumber(value)));
}

function cleanText(value: string, maxLength = MAX_TEXT_LENGTH): string {
  return value.replace(/[\u0000\u200B-\u200D\uFEFF]/g, '').slice(0, maxLength);
}

function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Please upload a PNG, JPEG, WebP, GIF, or SVG image.';
  }
  if (file.size > MAX_IMAGE_FILE_BYTES) {
    return 'Image must be 5 MB or smaller.';
  }
  return null;
}

interface BgRemovalOptions {
  maxSaturation?: number;
  tolerance?: number;
  maxSpread?: number;
}

const SIGNATURE_BG_OPTIONS: BgRemovalOptions = { maxSaturation: 60, tolerance: 60, maxSpread: 50 };

async function removeLogoBackground(dataUrl: string, opts: BgRemovalOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) {
          resolve(dataUrl);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const total = w * h;

        const border: number[] = [];
        for (let x = 0; x < w; x++) {
          border.push(x);
          if (h > 1) border.push((h - 1) * w + x);
        }
        for (let y = 1; y < h - 1; y++) {
          border.push(y * w);
          if (w > 1) border.push(y * w + (w - 1));
        }

        const opaque = border.filter((p) => data[p * 4 + 3] >= 250);
        if (opaque.length < border.length * 0.6) {
          resolve(dataUrl);
          return;
        }

        const meanOf = (pixels: number[]) => {
          let r = 0, g = 0, b = 0;
          pixels.forEach((p) => {
            r += data[p * 4];
            g += data[p * 4 + 1];
            b += data[p * 4 + 2];
          });
          const n = Math.max(1, pixels.length);
          return { r: r / n, g: g / n, b: b / n };
        };
        const near = (p: number, c: { r: number; g: number; b: number }, limit: number) =>
          Math.abs(data[p * 4] - c.r) <= limit &&
          Math.abs(data[p * 4 + 1] - c.g) <= limit &&
          Math.abs(data[p * 4 + 2] - c.b) <= limit;

        const spread = opts.maxSpread ?? 30;
        const rough = meanOf(opaque);
        const agreeing = opaque.filter((p) => near(p, rough, spread));
        if (agreeing.length < opaque.length * 0.85) {
          resolve(dataUrl);
          return;
        }
        const bg = meanOf(agreeing);
        const bgR = Math.round(bg.r);
        const bgG = Math.round(bg.g);
        const bgB = Math.round(bg.b);

        if (Math.max(bgR, bgG, bgB) - Math.min(bgR, bgG, bgB) >= (opts.maxSaturation ?? 25)) {
          resolve(dataUrl);
          return;
        }

        const TOLERANCE = opts.tolerance ?? 50;
        const visited = new Uint8Array(total);
        const stack = new Int32Array(total);
        let sp = 0;

        const matchesBg = (p: number) => {
          const i = p * 4;
          return (
            data[i + 3] < 128 ||
            (Math.abs(data[i] - bgR) < TOLERANCE &&
              Math.abs(data[i + 1] - bgG) < TOLERANCE &&
              Math.abs(data[i + 2] - bgB) < TOLERANCE)
          );
        };
        const tryPush = (p: number) => {
          if (visited[p] || !matchesBg(p)) return;
          visited[p] = 1;
          stack[sp++] = p;
        };
        const neighbors = (p: number, fn: (q: number) => void) => {
          const x = p % w;
          const y = (p - x) / w;
          if (x > 0) fn(p - 1);
          if (x < w - 1) fn(p + 1);
          if (y > 0) fn(p - w);
          if (y < h - 1) fn(p + w);
        };

        border.forEach(tryPush);

        let removed = 0;
        while (sp > 0) {
          const p = stack[--sp];
          data[p * 4 + 3] = 0;
          removed++;
          neighbors(p, tryPush);
        }

        if (Math.max(bgR, bgG, bgB) < 100) {
          for (let p = 0; p < total; p++) {
            if (!visited[p] && matchesBg(p)) {
              visited[p] = 1;
              data[p * 4 + 3] = 0;
              removed++;
            }
          }
        }

        if (removed / total > 0.995) {
          resolve(dataUrl);
          return;
        }

        const inBand = new Uint8Array(total);
        const ring1: number[] = [];
        const ring2: number[] = [];
        for (let p = 0; p < total; p++) {
          if (!visited[p]) continue;
          neighbors(p, (q) => {
            if (!visited[q] && !inBand[q]) {
              inBand[q] = 1;
              ring1.push(q);
            }
          });
        }
        ring1.forEach((p) =>
          neighbors(p, (q) => {
            if (!visited[q] && !inBand[q]) {
              inBand[q] = 1;
              ring2.push(q);
            }
          })
        );
        const bgChannels = [bgR, bgG, bgB];
        const feather = (p: number) => {
          const i = p * 4;
          let a = 0;
          for (let c = 0; c < 3; c++) {
            const range = Math.max(bgChannels[c], 255 - bgChannels[c], 1);
            a = Math.max(a, Math.abs(data[i + c] - bgChannels[c]) / range);
          }
          a = Math.min(1, a);
          if (a < 0.04) {
            data[i + 3] = 0;
            return;
          }
          for (let c = 0; c < 3; c++) {
            const restored = bgChannels[c] + (data[i + c] - bgChannels[c]) / a;
            data[i + c] = Math.max(0, Math.min(255, Math.round(restored)));
          }
          data[i + 3] = Math.round(a * (data[i + 3] / 255) * 255);
        };
        ring1.forEach(feather);
        ring2.forEach(feather);

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

function trimTransparent(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) {
          resolve(dataUrl);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, w, h).data;

        let minX = w, minY = h, maxX = -1, maxY = -1;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (data[(y * w + x) * 4 + 3] > 32) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < 0) {
          resolve(dataUrl);
          return;
        }

        const pad = Math.max(2, Math.round(Math.max(maxX - minX, maxY - minY) * 0.03));
        const x0 = Math.max(0, minX - pad);
        const y0 = Math.max(0, minY - pad);
        const x1 = Math.min(w - 1, maxX + pad);
        const y1 = Math.min(h - 1, maxY + pad);
        const cw = x1 - x0 + 1;
        const ch = y1 - y0 + 1;
        if (cw >= w && ch >= h) {
          resolve(dataUrl);
          return;
        }

        const out = document.createElement('canvas');
        out.width = cw;
        out.height = ch;
        out.getContext('2d')?.drawImage(canvas, x0, y0, cw, ch, 0, 0, cw, ch);
        resolve(out.toDataURL('image/png'));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function fitDims(width: number, height: number, maxW: number, maxH: number) {
  const scale = Math.min(maxW / width, maxH / height);
  return { w: width * scale, h: height * scale };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function normalizeImage(dataUrl: string, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const natW = img.naturalWidth || 300;
        const natH = img.naturalHeight || 150;
        const scale = Math.min(1, maxDim / Math.max(natW, natH));
        const w = Math.max(1, Math.round(natW * scale));
        const h = Math.max(1, Math.round(natH * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('Image load timeout'));
      }
    }, 5000);

    img.onload = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error('Failed to load image'));
    };
    img.src = dataUrl;
  });
}

interface NumericInputProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  integer?: boolean;
  className?: string;
  ariaLabel: string;
}

function NumericInput({ value, onChange, min = 0, max, integer, className, ariaLabel }: NumericInputProps) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(integer ? /[^\d]/g : /[^\d.]/g, '');
    if (!integer) {
      const firstDot = raw.indexOf('.');
      if (firstDot !== -1) {
        raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '');
      }
    }
    raw = raw.replace(/^0+(?=\d)/, '');
    let n = raw === '' || raw === '.' ? 0 : parseFloat(raw);
    if (!Number.isFinite(n)) n = 0;
    if (n < min) {
      n = min;
      raw = String(min);
    }
    if (max !== undefined && n > max) {
      n = max;
      raw = String(max);
    }
    setText(raw);
    onChange(n);
  }

  return (
    <input
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      value={text}
      onChange={handleChange}
      onFocus={(e) => {
        focused.current = true;
        e.target.select();
      }}
      onBlur={() => {
        focused.current = false;
        setText(String(value));
      }}
      className={className}
      aria-label={ariaLabel}
    />
  );
}

export function InvoiceGenerator() {
  const { showToast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const [originalLogoDataUrl, setOriginalLogoDataUrl] = useState<string>('');
  const [removeLogoBg, setRemoveLogoBg] = useState(true);
  const [logoSize, setLogoSize] = useState<LogoSize>('medium');
  const [logoDims, setLogoDims] = useState<{ width: number; height: number } | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
  const [stampDataUrl, setStampDataUrl] = useState<string>('');
  const [signatureOriginalDataUrl, setSignatureOriginalDataUrl] = useState<string>('');
  const [stampOriginalDataUrl, setStampOriginalDataUrl] = useState<string>('');
  const [removeSigBg, setRemoveSigBg] = useState(true);
  const [removeStampBg, setRemoveStampBg] = useState(true);

  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessTaxIdLabel, setBusinessTaxIdLabel] = useState('GSTIN');
  const [businessTaxIdValue, setBusinessTaxIdValue] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');

  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [bankAddress, setBankAddress] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerTaxIdLabel, setCustomerTaxIdLabel] = useState('GSTIN');
  const [customerTaxIdValue, setCustomerTaxIdValue] = useState('');

  const [shipToName, setShipToName] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');

  const [signatoryName, setSignatoryName] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [paymentTerms, setPaymentTerms] = useState(30);
  const [poNumber, setPoNumber] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [taxRate, setTaxRate] = useState(0);
  const [taxLabel, setTaxLabel] = useState('Tax');
  const [discountRate, setDiscountRate] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [showAmountInWords, setShowAmountInWords] = useState(true);

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 },
  ]);

  const dueDate = addDays(invoiceDate, paymentTerms);

  const DRAFT_STORAGE_KEY = 'freetoolshub:invoice-draft:v2';
  const draftHydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Record<string, unknown>;
        const applyString = (key: string, setter: (v: string) => void, max = MAX_TEXT_LENGTH) => {
          if (typeof draft[key] === 'string') setter(cleanText(draft[key] as string, max));
        };
        applyString('businessName', setBusinessName, 250);
        applyString('businessAddress', setBusinessAddress, MAX_ADDRESS_LENGTH);
        applyString('businessTaxIdLabel', setBusinessTaxIdLabel, 100);
        applyString('businessTaxIdValue', setBusinessTaxIdValue, 100);
        applyString('businessEmail', setBusinessEmail, 320);
        applyString('bankName', setBankName, 250);
        applyString('accountName', setAccountName, 250);
        applyString('accountNumber', setAccountNumber, 100);
        applyString('ifscCode', setIfscCode, 50);
        applyString('swiftCode', setSwiftCode, 50);
        applyString('bankAddress', setBankAddress, MAX_ADDRESS_LENGTH);
        applyString('customerName', setCustomerName, 250);
        applyString('customerAddress', setCustomerAddress, MAX_ADDRESS_LENGTH);
        applyString('customerTaxIdLabel', setCustomerTaxIdLabel, 100);
        applyString('customerTaxIdValue', setCustomerTaxIdValue, 100);
        applyString('shipToName', setShipToName, 250);
        applyString('shipToAddress', setShipToAddress, MAX_ADDRESS_LENGTH);
        applyString('signatoryName', setSignatoryName, 250);
        applyString('invoiceNumber', setInvoiceNumber, 100);
        applyString('invoiceDate', setInvoiceDate, 20);
        applyString('poNumber', setPoNumber, 100);
        if (typeof draft.currency === 'string' && draft.currency in CURRENCY_CONFIG) {
          setCurrency(draft.currency as CurrencyCode);
        }
        applyString('taxLabel', setTaxLabel, 100);
        applyString('notes', setNotes, MAX_TEXT_LENGTH);
        applyString('terms', setTerms, MAX_TEXT_LENGTH);

        if (typeof draft.paymentTerms === 'number') setPaymentTerms(clampNumber(draft.paymentTerms, 0, 3650));
        if (typeof draft.taxRate === 'number') setTaxRate(clampNumber(draft.taxRate, 0, 100));
        if (typeof draft.discountRate === 'number') setDiscountRate(clampNumber(draft.discountRate, 0, 100));
        if (typeof draft.shipping === 'number') setShipping(clampNumber(draft.shipping, 0, 1000000000));
        if (typeof draft.amountPaid === 'number') setAmountPaid(clampNumber(draft.amountPaid, 0, 1000000000));
        if (typeof draft.showAmountInWords === 'boolean') setShowAmountInWords(draft.showAmountInWords);

        if (Array.isArray(draft.items)) {
          const safeItems = draft.items.slice(0, MAX_LINE_ITEMS).map((rawItem, index) => {
            const item = rawItem as Record<string, unknown>;
            return {
              id: typeof item.id === 'string' ? item.id : String(index + 1),
              description: typeof item.description === 'string' ? cleanText(item.description, MAX_ITEM_DESCRIPTION_LENGTH) : '',
              quantity: clampNumber(item.quantity, 0, 1000000),
              unitPrice: clampNumber(item.unitPrice, 0, 1000000000),
            };
          });
          if (safeItems.length) setItems(safeItems);
        }
      }
    } catch {
      // Corrupt or unavailable local storage should never break the invoice tool.
    } finally {
      draftHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!draftHydratedRef.current) return;
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        businessName, businessAddress, businessTaxIdLabel, businessTaxIdValue, businessEmail,
        bankName, accountName, accountNumber, ifscCode, swiftCode, bankAddress,
        customerName, customerAddress, customerTaxIdLabel, customerTaxIdValue,
        shipToName, shipToAddress, signatoryName, invoiceNumber, invoiceDate,
        paymentTerms, poNumber, currency, taxRate, taxLabel, discountRate,
        shipping, amountPaid, notes, terms, showAmountInWords, items,
      }));
    } catch {
      // Storage can be full/blocked; the invoice remains fully usable in memory.
    }
  }, [
    businessName, businessAddress, businessTaxIdLabel, businessTaxIdValue, businessEmail,
    bankName, accountName, accountNumber, ifscCode, swiftCode, bankAddress,
    customerName, customerAddress, customerTaxIdLabel, customerTaxIdValue,
    shipToName, shipToAddress, signatoryName, invoiceNumber, invoiceDate,
    paymentTerms, poNumber, currency, taxRate, taxLabel, discountRate,
    shipping, amountPaid, notes, terms, showAmountInWords, items,
  ]);

  const prevCurrencyRef = useRef(currency);
  useEffect(() => {
    const prev = prevCurrencyRef.current;
    if (prev === currency) return;
    prevCurrencyRef.current = currency;
    const oldDefault = CURRENCY_DEFAULT_TAX_ID[prev] ?? 'Tax ID';
    const newDefault = CURRENCY_DEFAULT_TAX_ID[currency] ?? 'Tax ID';
    setBusinessTaxIdLabel((l) => (l === oldDefault ? newDefault : l));
    setCustomerTaxIdLabel((l) => (l === oldDefault ? newDefault : l));
  }, [currency]);

  useEffect(() => {
    if (!logoDataUrl) {
      setLogoDims(null);
      return;
    }
    let cancelled = false;
    getImageDimensions(logoDataUrl)
      .then((d) => { if (!cancelled) setLogoDims(d); })
      .catch(() => { if (!cancelled) setLogoDims(null); });
    return () => { cancelled = true; };
  }, [logoDataUrl]);

  useEffect(() => {
    if (printReady && showPreview) {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          window.print();
          setPrintReady(false);
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
  }, [printReady, showPreview]);

  async function cleanLogoImage(source: string): Promise<string> {
    return trimTransparent(await removeLogoBackground(source));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileError = validateImageFile(file);
    if (fileError) { showToast(fileError, 'error'); return; }

    try {
      const normalized = await normalizeImage(await readFileAsDataUrl(file), 800);
      setOriginalLogoDataUrl(normalized);

      if (removeLogoBg) {
        try {
          const cleaned = await cleanLogoImage(normalized);
          setLogoDataUrl(cleaned);
          showToast(
            cleaned !== normalized ? 'Logo uploaded — background removed' : 'Logo uploaded',
            'success'
          );
        } catch (err) {
          console.error('Background removal failed:', err);
          setLogoDataUrl(normalized);
          showToast('Logo uploaded (background not removed)', 'info');
        }
      } else {
        setLogoDataUrl(normalized);
        showToast('Logo uploaded', 'success');
      }
    } catch (err) {
      console.error('Logo processing failed:', err);
      showToast('Logo upload failed', 'error');
    }
  }

  async function toggleLogoBgRemoval(checked: boolean) {
    setRemoveLogoBg(checked);
    if (!originalLogoDataUrl) return;
    if (checked) {
      try {
        const cleaned = await cleanLogoImage(originalLogoDataUrl);
        setLogoDataUrl(cleaned);
      } catch {
        setLogoDataUrl(originalLogoDataUrl);
      }
    } else {
      setLogoDataUrl(originalLogoDataUrl);
    }
  }

  async function cleanSignatureImage(original: string, remove: boolean): Promise<string> {
    if (!remove) return original;
    try {
      return await trimTransparent(await removeLogoBackground(original, SIGNATURE_BG_OPTIONS));
    } catch {
      return original;
    }
  }

  async function loadSignatureImage(
    e: React.ChangeEvent<HTMLInputElement>,
    setOriginal: (dataUrl: string) => void,
    setDisplay: (dataUrl: string) => void,
    removeBg: boolean
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileError = validateImageFile(file);
    if (fileError) { showToast(fileError, 'error'); return; }
    try {
      const normalized = await normalizeImage(await readFileAsDataUrl(file), 600);
      setOriginal(normalized);
      setDisplay(await cleanSignatureImage(normalized, removeBg));
    } catch (err) {
      console.error('Image processing failed:', err);
      showToast('Failed to read image', 'error');
    }
  }

  function handleSignatureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    void loadSignatureImage(e, setSignatureOriginalDataUrl, setSignatureDataUrl, removeSigBg);
  }

  function handleStampUpload(e: React.ChangeEvent<HTMLInputElement>) {
    void loadSignatureImage(e, setStampOriginalDataUrl, setStampDataUrl, removeStampBg);
  }

  async function toggleSigBgRemoval(checked: boolean) {
    setRemoveSigBg(checked);
    if (signatureOriginalDataUrl) setSignatureDataUrl(await cleanSignatureImage(signatureOriginalDataUrl, checked));
  }

  async function toggleStampBgRemoval(checked: boolean) {
    setRemoveStampBg(checked);
    if (stampOriginalDataUrl) setStampDataUrl(await cleanSignatureImage(stampOriginalDataUrl, checked));
  }

  function removeLogo() {
    setLogoDataUrl('');
    setOriginalLogoDataUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  function removeSignature() { setSignatureDataUrl(''); setSignatureOriginalDataUrl(''); if (signatureInputRef.current) signatureInputRef.current.value = ''; }
  function removeStamp() { setStampDataUrl(''); setStampOriginalDataUrl(''); if (stampInputRef.current) stampInputRef.current.value = ''; }

  function addItem() {
    setItems((prev) => {
      if (prev.length >= MAX_LINE_ITEMS) {
        showToast(`You can add up to ${MAX_LINE_ITEMS} line items.`, 'info');
        return prev;
      }
      return [...prev, {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
      }];
    });
  }

  function removeItem(id: string) { setItems((prev) => prev.filter((item) => item.id !== id)); }

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'description'
                  ? cleanText(String(value), MAX_ITEM_DESCRIPTION_LENGTH)
                  : field === 'quantity'
                    ? clampNumber(value, 0, 1_000_000)
                    : clampNumber(value, 0, 1_000_000_000),
            }
          : item
      )
    );
  }

  const lineAmount = (item: LineItem) =>
    roundMoney(safeNumber(item.quantity) * safeNumber(item.unitPrice), currency);
  const subtotal = roundMoney(items.reduce((sum, item) => sum + lineAmount(item), 0), currency);
  const normalizedDiscountRate = clampNumber(discountRate, 0, 100);
  const normalizedTaxRate = clampNumber(taxRate, 0, 100);
  const normalizedShipping = clampNumber(shipping, 0, 1_000_000_000);
  const normalizedAmountPaid = clampNumber(amountPaid, 0, 1_000_000_000);

  const discount = roundMoney(subtotal * (normalizedDiscountRate / 100), currency);
  const afterDiscount = Math.max(0, roundMoney(subtotal - discount, currency));
  const tax = roundMoney(afterDiscount * (normalizedTaxRate / 100), currency);
  const total = Math.max(0, roundMoney(afterDiscount + tax + normalizedShipping, currency));
  const safeAmountPaid = Math.min(normalizedAmountPaid, total);
  const balanceDue = roundMoney(Math.max(0, total - safeAmountPaid), currency);

  function handleDueDateChange(value: string) {
    if (!value || !invoiceDate) return;
    const [dy, dm, dd] = value.split('-').map(Number);
    const [iy, im, id] = invoiceDate.split('-').map(Number);
    if (!dy || !dm || !dd || !iy || !im || !id) return;
    const days = Math.round((Date.UTC(dy, dm - 1, dd) - Date.UTC(iy, im - 1, id)) / 86400000);
    if (days < 0) {
      showToast('Due date cannot be before the invoice date', 'info');
      return;
    }
    setPaymentTerms(days);
  }

  async function handleDownloadPdf() {
    setExporting(true);
    try {
      const pdfTextFields = [
        businessName, businessAddress, businessTaxIdValue, businessEmail,
        bankName, accountName, accountNumber, ifscCode, swiftCode, bankAddress,
        customerName, customerAddress, customerTaxIdValue, shipToName, shipToAddress,
        signatoryName, invoiceNumber, poNumber, taxLabel, notes, terms,
        ...items.map((i) => i.description),
      ];
      if (pdfTextFields.some((t) => UNSUPPORTED_PDF_CHARS.test(t))) {
        showToast(
          "This PDF renderer currently supports Latin/WinAnsi text only. Use Print → Save as PDF for Hindi, Chinese, Arabic, or other Unicode scripts instead of downloading a garbled PDF.",
          'error'
        );
        return;
      }

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let y = margin;

      const darkGray: [number, number, number] = [31, 41, 55];
      const medGray: [number, number, number] = [107, 114, 128];
      const lightGray: [number, number, number] = [156, 163, 175];
      const darkNavy: [number, number, number] = [15, 23, 42];
      const dividerGray: [number, number, number] = [200, 200, 200];

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 20) {
          pdf.addPage();
          y = margin;
        }
      };

      const drawText = (
        text: string,
        x: number,
        textY: number,
        opts?: Parameters<typeof pdf.text>[3]
      ) => {
        pdf.text(sanitizePdfText(text), x, textY, opts);
      };

      const writePdfCurrency = (
        value: number,
        x: number,
        textY: number,
        options: { align?: 'left' | 'center' | 'right'; bold?: boolean } = {}
      ) => {
        const align = options.align ?? 'right';
        const bold = !!options.bold;
        const code = String(currency || 'USD').toUpperCase();

        if (code === 'INR') {
          const decimals = decimalsFor(code);
          const numberText = Math.abs(value).toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: true,
          });

          pdf.setFont('helvetica', bold ? 'bold' : 'normal');
          pdf.setFontSize(bold ? 10 : 9);

          const minusText = value < 0 ? '-' : '';
          const minusW = minusText ? pdf.getTextWidth(minusText) : 0;
          const numberW = pdf.getTextWidth(numberText);

          const glyphH = bold ? 3.5 : 3.2;
          const glyphW = bold ? 3.5 : 3.2;
          const gap = 1.0;
          const totalW = minusW + glyphW + gap + numberW;

          let startX = x;
          if (align === 'right') startX = x - totalW;
          else if (align === 'center') startX = x - totalW / 2;

          if (minusText) {
            pdf.text(minusText, startX, textY);
            startX += minusW;
          }

          const glyphKey =
            bold
              ? (value < 0 ? 'boldRed' : 'boldBlack')
              : (value < 0 ? 'regularRed' : 'regularBlack');

          const baselineOffset = bold ? 0.9 : 0.8;
          try {
            pdf.addImage(
              RUPEE_GLYPH[glyphKey],
              'PNG',
              startX,
              textY - glyphH + baselineOffset,
              glyphW,
              glyphH
            );
            startX += glyphW + gap;
          } catch {
            pdf.text('Rs.', startX, textY);
            startX += pdf.getTextWidth('Rs.') + gap;
          }

          pdf.text(numberText, startX, textY);
          return;
        }

        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.setFontSize(bold ? 10 : 9);
        pdf.text(formatPdfCurrency(value, currency), x, textY, { align });
      };

      const fitInBox = async (dataUrl: string, maxW: number, maxH: number) => {
        try {
          const { width, height } = await getImageDimensions(dataUrl);
          const scale = Math.min(maxW / width, maxH / height);
          return { w: width * scale, h: height * scale };
        } catch {
          return { w: maxW, h: maxH };
        }
      };

      // ===== HEADER =====
      const headerTop = y;
      let logoHeightMm = 0;

      if (logoDataUrl) {
        const box = LOGO_SIZES[logoSize];
        const { w: mmW, h: mmH } = await fitInBox(logoDataUrl, box.w, box.h);
        try {
          pdf.addImage(logoDataUrl, 'PNG', margin, headerTop, mmW, mmH);
          logoHeightMm = mmH;
        } catch (logoErr) {
          console.error('Could not add logo to PDF:', logoErr);
        }
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(30);
      pdf.setTextColor(...darkNavy);
      pdf.text('INVOICE', pageWidth - margin, headerTop + 12, { align: 'right' });

      const boxWidth = 55;
      const boxX = pageWidth - margin - boxWidth;
      const boxY = headerTop + 17;
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(boxX, boxY, boxWidth, 8, 1, 1, 'S');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...medGray);
      pdf.text('#', boxX + 2, boxY + 5.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...darkGray);
      drawText(invoiceNumber, boxX + boxWidth - 2, boxY + 5.5, { align: 'right' });

      y = headerTop + Math.max(logoHeightMm + 6, 17 + 8 + 6);

      // ===== FROM + META =====
      const metaStartY = y;
      const leftColWidth = pageWidth * 0.55;
      const maxAddrWidth = leftColWidth - margin - 5;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...medGray);
      pdf.text('FROM:', margin, y);
      y += 4;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(...darkGray);
      drawText(businessName || 'Your Business', margin, y);
      y += 4;

      pdf.setFontSize(9);
      pdf.setTextColor(...medGray);
      if (businessAddress) {
        const lines = pdf.splitTextToSize(sanitizePdfText(businessAddress), maxAddrWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 3.5;
      }
      if (businessTaxIdLabel && businessTaxIdValue) {
        drawText(`${businessTaxIdLabel}: ${businessTaxIdValue}`, margin, y);
        y += 3.5;
      }
      if (businessEmail) { drawText(`E-Mail: ${businessEmail}`, margin, y); y += 3.5; }

      let metaY = metaStartY;
      const metaLabelX = pageWidth - margin - 45;
      const metaValueX = pageWidth - margin;

      const metaFields = [
        { label: 'Date', value: formatDate(invoiceDate) },
        { label: 'Payment Terms', value: `${paymentTerms} days` },
        { label: 'Due Date', value: formatDate(dueDate) },
      ];
      if (poNumber) metaFields.push({ label: 'PO Number', value: poNumber });

      metaFields.forEach((field) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        pdf.text(field.label, metaLabelX, metaY);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...darkGray);
        drawText(field.value, metaValueX, metaY, { align: 'right' });
        metaY += 5.5;
      });

      y = Math.max(y, metaY) + 5;

      // ===== BILL TO + SHIP TO =====
      const billToStartY = y;
      const colWidth = (pageWidth - 2 * margin) / 2 - 8;
      const shipToX = margin + colWidth + 16;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...medGray);
      pdf.text('BILL TO:', margin, y);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(...darkGray);
      drawText(customerName || 'Customer Name', margin, y + 4);

      let billY = y + 8;
      pdf.setFontSize(9);
      pdf.setTextColor(...medGray);
      if (customerAddress) {
        const lines = pdf.splitTextToSize(sanitizePdfText(customerAddress), colWidth);
        pdf.text(lines, margin, billY);
        billY += lines.length * 3.5;
      }
      if (customerTaxIdLabel && customerTaxIdValue) {
        drawText(`${customerTaxIdLabel}: ${customerTaxIdValue}`, margin, billY);
        billY += 3.5;
      }

      let shipY = billToStartY;
      if (shipToName || shipToAddress) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        pdf.text('SHIP TO:', shipToX, shipY);
        shipY += 4;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...darkGray);
        drawText(shipToName || '—', shipToX, shipY);
        shipY += 4;

        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        if (shipToAddress) {
          const lines = pdf.splitTextToSize(sanitizePdfText(shipToAddress), colWidth);
          pdf.text(lines, shipToX, shipY);
          shipY += lines.length * 3.5;
        }
      }

      y = Math.max(billY, shipY) + 6;

      // ===== ITEMS TABLE =====
      const tableHeaderHeight = 9;
      pdf.setFillColor(...darkNavy);
      pdf.rect(margin, y, pageWidth - 2 * margin, tableHeaderHeight, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);

      const itemColStartX = margin + 3;
      const colQtyX = pageWidth - margin - 78;
      const colRateX = pageWidth - margin - 40;
      const colAmountX = pageWidth - margin - 3;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const widestQty = Math.max(
        12,
        ...items.map((it) => pdf.getTextWidth(String(safeNumber(it.quantity))))
      );
      const itemColMaxWidth = Math.max(40, colQtyX - widestQty - 6 - itemColStartX);
      const lineH = pdf.getFontSize() * pdf.getLineHeightFactor() * 0.3528;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);

      pdf.text('Item', itemColStartX, y + 6);
      pdf.text('Quantity', colQtyX, y + 6, { align: 'right' });
      pdf.text('Rate', colRateX, y + 6, { align: 'right' });
      pdf.text('Amount', colAmountX, y + 6, { align: 'right' });

      y += tableHeaderHeight;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...darkGray);
      pdf.setFontSize(9);

      items.forEach((item) => {
        const qty = safeNumber(item.quantity);
        const rate = safeNumber(item.unitPrice);
        const amount = lineAmount(item);

        const descText = item.description || '—';
        const descLines = pdf.splitTextToSize(sanitizePdfText(descText), itemColMaxWidth);
        const rowHeight = Math.max(8, 5 + (descLines.length - 1) * lineH + 3.5);

        if (y + rowHeight > pageHeight - 30) {
          pdf.addPage();
          y = margin;
          pdf.setFillColor(...darkNavy);
          pdf.rect(margin, y, pageWidth - 2 * margin, tableHeaderHeight, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.setTextColor(255, 255, 255);
          pdf.text('Item', itemColStartX, y + 6);
          pdf.text('Quantity', colQtyX, y + 6, { align: 'right' });
          pdf.text('Rate', colRateX, y + 6, { align: 'right' });
          pdf.text('Amount', colAmountX, y + 6, { align: 'right' });
          y += tableHeaderHeight;
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...darkGray);
          pdf.setFontSize(9);
        }

        pdf.text(descLines, itemColStartX, y + 5);
        pdf.text(String(qty), colQtyX, y + 5, { align: 'right' });
        writePdfCurrency(rate, colRateX, y + 5);
        writePdfCurrency(amount, colAmountX, y + 5);

        y += rowHeight;

        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.2);
        pdf.line(margin, y, pageWidth - margin, y);
      });

      y += 6;

      // ===== AMOUNT IN WORDS + TOTALS =====
      const totalsX = pageWidth - margin - 75;
      const totalsValueX = pageWidth - margin;
      const leftColMaxWidth = totalsX - margin - 5;

      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9);
      const wordsLines: string[] = showAmountInWords
        ? pdf.splitTextToSize(numberToWords(total, currency), leftColMaxWidth)
        : [];
      const wordsHeight = showAmountInWords ? 4 + wordsLines.length * 3.5 : 0;
      const totalsHeight =
        5 + (normalizedDiscountRate > 0 ? 5 : 0) + (normalizedTaxRate > 0 ? 5 : 0) + (shipping > 0 ? 5 : 0) +
        2.5 + 5 + (safeAmountPaid > 0 ? 5 : 0) + 2.5 + 5;
      ensureSpace(Math.max(wordsHeight, totalsHeight) + 4);

      const sectionStartY = y;
      let leftY = sectionStartY;

      if (showAmountInWords) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        pdf.text('Amount in Words:', margin, leftY);
        leftY += 4;
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(...darkGray);
        pdf.text(wordsLines, margin, leftY);
        leftY += wordsLines.length * 3.5;
      }

      let rightY = sectionStartY;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...medGray);
      pdf.text('Subtotal:', totalsX, rightY);
      pdf.setTextColor(...darkGray);
      writePdfCurrency(subtotal, totalsValueX, rightY);
      rightY += 5;

      if (normalizedDiscountRate > 0) {
        pdf.setTextColor(...medGray);
        pdf.text(`Discount (${normalizedDiscountRate}%):`, totalsX, rightY);
        pdf.setTextColor(220, 38, 38);
        writePdfCurrency(-discount, totalsValueX, rightY);
        rightY += 5;
      }

      if (normalizedTaxRate > 0) {
        pdf.setTextColor(...medGray);
        drawText(`${taxLabel || 'Tax'} (${normalizedTaxRate}%):`, totalsX, rightY);
        pdf.setTextColor(...darkGray);
        writePdfCurrency(tax, totalsValueX, rightY);
        rightY += 5;
      }

      if (shipping > 0) {
        pdf.setTextColor(...medGray);
        pdf.text('Shipping:', totalsX, rightY);
        pdf.setTextColor(...darkGray);
        writePdfCurrency(shipping, totalsValueX, rightY);
        rightY += 5;
      }

      pdf.setDrawColor(...dividerGray);
      pdf.setLineWidth(0.3);
      pdf.line(totalsX, rightY - 1.5, pageWidth - margin, rightY - 1.5);
      rightY += 2.5;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(...darkGray);
      pdf.text('Total:', totalsX, rightY);
      writePdfCurrency(total, totalsValueX, rightY, { bold: true });
      rightY += 5;

      if (safeAmountPaid > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        pdf.text('Amount Paid:', totalsX, rightY);
        pdf.setTextColor(...darkGray);
        writePdfCurrency(safeAmountPaid, totalsValueX, rightY);
        rightY += 5;
      }

      pdf.setDrawColor(...dividerGray);
      pdf.line(totalsX, rightY - 1.5, pageWidth - margin, rightY - 1.5);
      rightY += 2.5;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(...darkNavy);
      pdf.text('Balance Due:', totalsX, rightY);
      writePdfCurrency(balanceDue, totalsValueX, rightY, { bold: true });

      y = Math.max(leftY, rightY) + 8;

      // ===== BANK DETAILS + NOTES/TERMS + SIGNATURE =====
      const hasBankDetails = !!(bankName || accountName || accountNumber || ifscCode || swiftCode || bankAddress);
      const hasSignatureBlock = !!(signatoryName || signatureDataUrl || stampDataUrl);

      const bankRows: { label: string; value: string }[] = [];
      if (bankName) bankRows.push({ label: 'Bank Name', value: bankName });
      if (accountName) bankRows.push({ label: 'Account Name', value: accountName });
      if (accountNumber) bankRows.push({ label: 'Account Number', value: accountNumber });
      if (ifscCode) bankRows.push({ label: 'IFSC Code', value: ifscCode });
      if (swiftCode) bankRows.push({ label: 'SWIFT Code', value: swiftCode });
      if (bankAddress) bankRows.push({ label: 'Bank Address', value: bankAddress });

      const footerContentW = pageWidth - 2 * margin;
      const footerLeftW = footerContentW * 0.58;
      const footerGap = 8;
      const footerRightX = margin + footerLeftW + footerGap;
      const footerRightW = Math.max(30, pageWidth - margin - footerRightX);
      const footerLeftX = margin;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      const bankValueX =
        footerLeftX +
        (bankRows.length ? Math.max(...bankRows.map((r) => pdf.getTextWidth(r.label))) : 35) +
        5;
      const bankValueMaxW = Math.max(20, footerLeftW - (bankValueX - footerLeftX));
      const bankRowHeights = bankRows.map(
        (row) => Math.max(3.5, pdf.splitTextToSize(sanitizePdfText(row.value), bankValueMaxW).length * 3.5)
      );
      const bankHeight = hasBankDetails
        ? 3.5 + 3.5 + bankRowHeights.reduce((a, b) => a + b, 0) + 3
        : 0;

      const sigImg = signatureDataUrl ? await fitInBox(signatureDataUrl, 42, 16) : null;
      const stampImg = stampDataUrl ? await fitInBox(stampDataUrl, 30, 30) : null;

      const forLines: string[] = pdf.splitTextToSize(
        sanitizePdfText(`For ${businessName || 'Your Business'}`),
        footerRightW
      );
      const hasSignatoryName = !!signatoryName.trim();
      const nameLines: string[] = hasSignatoryName
        ? pdf.splitTextToSize(sanitizePdfText(signatoryName.trim()), footerRightW)
        : [];

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      const forWidth = Math.max(...forLines.map((l) => pdf.getTextWidth(l)));

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      const nameWidth = hasSignatoryName
        ? Math.max(...nameLines.map((l) => pdf.getTextWidth(l)))
        : 0;

      const sigBlockW = Math.min(
        footerRightW,
        Math.max(46, forWidth + 4, hasSignatoryName ? nameWidth + 4 : 46)
      );

      const sigAreaH = sigImg ? sigImg.h : 0;
      const signatureGap = sigImg ? 1.5 : 0;

      const NAME_GAP = 3;

      const signatoryLineAndNameH = hasSignatoryName
        ? NAME_GAP + (nameLines.length - 1) * 3.5 + NAME_GAP
        : 0;

      const preStampGap = stampImg && !hasSignatoryName ? NAME_GAP : 0;

      const sigHeight = hasSignatureBlock
        ? forLines.length * 3.7 +
          1.5 +
          sigAreaH +
          signatureGap +
          signatoryLineAndNameH +
          preStampGap +
          (stampImg ? stampImg.h + 2 : 0)
        : 0;

      const sigVisualHeight = hasSignatureBlock
        ? forLines.length * 3.7 +
          1.5 +
          sigAreaH +
          signatureGap +
          signatoryLineAndNameH +
          preStampGap +
          (stampImg ? stampImg.h : 0)
        : 0;

      const notesLines: string[] = notes ? pdf.splitTextToSize(sanitizePdfText(notes), footerLeftW) : [];
      const termsLines: string[] = terms ? pdf.splitTextToSize(sanitizePdfText(terms), footerLeftW) : [];
      const notesTermsHeight =
        (notes ? 4 + notesLines.length * 3.5 + 2.5 : 0) +
        (terms ? 4 + termsLines.length * 3.5 + 2.5 : 0);

      const leftFooterHeight = (hasBankDetails ? bankHeight : 0) + notesTermsHeight;
      const requiredFooterHeight = Math.max(leftFooterHeight, hasSignatureBlock ? sigHeight : 0) + 4;

      ensureSpace(requiredFooterHeight);

      const footerY = y;
      let leftFooterY = footerY;
      let rightFooterY = footerY;

      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.2);
      pdf.line(margin, footerY, pageWidth - margin, footerY);
      leftFooterY += 3.5;
      rightFooterY += 3.5;

      // ===== BANK DETAILS (LEFT) =====
      if (hasBankDetails) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        pdf.text('BANK DETAILS', footerLeftX, leftFooterY);
        leftFooterY += 3.5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        bankRows.forEach((row, i) => {
          const lines = pdf.splitTextToSize(sanitizePdfText(row.value), bankValueMaxW);
          const rowH = bankRowHeights[i];
          pdf.setTextColor(...medGray);
          pdf.text(row.label, footerLeftX, leftFooterY);
          pdf.setTextColor(...darkGray);
          pdf.text(lines, bankValueX, leftFooterY);
          leftFooterY += rowH;
        });
        leftFooterY += 3;
      }

      // ===== NOTES / TERMS (LEFT, BELOW BANK DETAILS) =====
      const writeFooterSection = (label: string, text: string) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(...medGray);
        pdf.text(label, footerLeftX, leftFooterY);
        leftFooterY += 4;

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...darkGray);
        const lines: string[] = pdf.splitTextToSize(sanitizePdfText(text), footerLeftW);
        lines.forEach((line) => {
          pdf.text(line, footerLeftX, leftFooterY);
          leftFooterY += 3.5;
        });
        leftFooterY += 2.5;
      };

      if (notes) writeFooterSection('NOTES:', notes);
      if (terms) writeFooterSection('TERMS:', terms);

      // ===== SIGNATURE (RIGHT) =====
      if (hasSignatureBlock) {
        const sigBlockX = footerRightX + (footerRightW - sigBlockW) / 2;
        const sigBlockCenterX = sigBlockX + sigBlockW / 2;

        const leftColumnBottom = leftFooterY;
        const sigTopY = Math.max(footerY, leftColumnBottom - sigVisualHeight);

        let sigY = sigTopY;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(...darkGray);
        pdf.text(forLines, sigBlockCenterX, sigY, { align: 'center' });
        sigY += forLines.length * 3.7 + 1.5;

        if (signatureDataUrl && sigImg) {
          try {
            pdf.addImage(signatureDataUrl, 'PNG', sigBlockCenterX - sigImg.w / 2, sigY, sigImg.w, sigImg.h);
          } catch { /* ignore */ }
        }

        sigY += sigAreaH + signatureGap;

        if (hasSignatoryName) {
          pdf.setDrawColor(107, 114, 128);
          pdf.setLineWidth(0.3);
          pdf.line(sigBlockX, sigY, sigBlockX + sigBlockW, sigY);
          sigY += NAME_GAP;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8.5);
          pdf.setTextColor(...darkGray);
          pdf.text(nameLines, sigBlockCenterX, sigY, { align: 'center' });
          sigY += (nameLines.length - 1) * 3.5 + NAME_GAP;
        } else if (stampDataUrl && stampImg) {
          sigY += NAME_GAP;
        }

        if (stampDataUrl && stampImg) {
          try {
            pdf.addImage(stampDataUrl, 'PNG', sigBlockCenterX - stampImg.w / 2, sigY, stampImg.w, stampImg.h);
          } catch { /* ignore */ }
          sigY += stampImg.h + 2;
        }

        rightFooterY = sigY;
      }

      y = Math.max(leftFooterY, rightFooterY) + 2;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...lightGray);
      pdf.text('Generated with FreeToolsHub', pageWidth / 2, pageHeight - 8, { align: 'center' });

      const safeInvoiceNo = invoiceNumber.replace(/[\\/:*?"<>|\s]+/g, '-').replace(/^-+|-+$/g, '') || 'invoice';
      pdf.save(`invoice-${safeInvoiceNo}-${Date.now()}.pdf`);
      showToast('Invoice downloaded as PDF', 'success');
    } catch (e) {
      console.error('PDF export failed:', e);
      const msg = e instanceof Error ? e.message : 'PDF export failed';
      showToast(msg, 'error');
    } finally {
      setExporting(false);
    }
  }

  function handlePrint() {
    setShowPreview(true);
    setPrintReady(true);
  }

  function handleReset() {
    setLogoDataUrl('');
    setOriginalLogoDataUrl('');
    setRemoveLogoBg(true);
    setLogoSize('medium');
    setSignatureDataUrl('');
    setStampDataUrl('');
    setSignatureOriginalDataUrl('');
    setStampOriginalDataUrl('');
    setRemoveSigBg(true);
    setRemoveStampBg(true);
    setBusinessName('');
    setBusinessAddress('');
    setBusinessTaxIdLabel('GSTIN');
    setBusinessTaxIdValue('');
    setBusinessEmail('');
    setBankName('');
    setAccountName('');
    setAccountNumber('');
    setIfscCode('');
    setSwiftCode('');
    setBankAddress('');
    setCustomerName('');
    setCustomerAddress('');
    setCustomerTaxIdLabel('GSTIN');
    setCustomerTaxIdValue('');
    setShipToName('');
    setShipToAddress('');
    setSignatoryName('');
    setInvoiceNumber('INV-001');
    setInvoiceDate(todayISO());
    setPaymentTerms(30);
    setPoNumber('');
    setCurrency('INR');
    setTaxRate(0);
    setTaxLabel('Tax');
    setDiscountRate(0);
    setShipping(0);
    setAmountPaid(0);
    setNotes('');
    setTerms('');
    setShowAmountInWords(true);
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0 }]);
    setShowPreview(false);
    try { window.localStorage.removeItem(DRAFT_STORAGE_KEY); } catch {}
    setShowAdvanced(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (signatureInputRef.current) signatureInputRef.current.value = '';
    if (stampInputRef.current) stampInputRef.current.value = '';
  }

  return (
    <ToolWorkspace>
      {/* TOP ROW */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {logoDataUrl ? (
            <div className="relative inline-block">
              <img
                src={logoDataUrl}
                alt="Logo"
                className="max-h-[120px] max-w-[240px] rounded-lg border border-gray-200 object-contain dark:border-gray-800"
              />
              <button type="button" onClick={removeLogo} className="absolute -right-2 -top-2 rounded-full bg-error-500 p-1 text-white hover:bg-error-600" aria-label="Remove logo">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-20 w-40 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-gray-700">
              <Upload className="h-4 w-4" /> Add Your Logo
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={handleLogoUpload} className="hidden" aria-label="Upload logo" />
          {logoDataUrl && (
            <>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={removeLogoBg}
                onChange={(e) => toggleLogoBgRemoval(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Remove background
            </label>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Logo size</span>
              <select value={logoSize} onChange={(e) => setLogoSize(e.target.value as LogoSize)} className="input-base !w-auto !py-1 text-xs" aria-label="Logo size">
                {(Object.keys(LOGO_SIZES) as LogoSize[]).map((k) => (
                  <option key={k} value={k}>{LOGO_SIZES[k].label}</option>
                ))}
              </select>
            </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">INVOICE</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">#</span>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="input-base !w-40 text-right" aria-label="Invoice number" />
          </div>
        </div>
      </div>

      {/* FROM + DATE */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Who is this from?</label>
          <input type="text" value={businessName} onChange={(e) => setBusinessName(cleanText(e.target.value, 250))} placeholder="Your business name" className="input-base" aria-label="Business name" />
          <textarea value={businessAddress} onChange={(e) => setBusinessAddress(cleanText(e.target.value, MAX_ADDRESS_LENGTH))} placeholder="Business address (one line each)" rows={2} className="input-base mt-2 resize-none" aria-label="Business address" />
          <div className="mt-2 grid grid-cols-[140px_1fr] gap-2">
            <input type="text" value={businessTaxIdLabel} onChange={(e) => setBusinessTaxIdLabel(e.target.value)} placeholder="Tax ID label" list="tax-id-presets" className="input-base" aria-label="Business Tax ID label" />
            <input type="text" value={businessTaxIdValue} onChange={(e) => setBusinessTaxIdValue(cleanText(e.target.value, 100))} placeholder="Tax ID value" className="input-base" aria-label="Business Tax ID value" />
          </div>
          <datalist id="tax-id-presets">
            {TAX_ID_PRESETS.map((p) => <option key={p} value={p} />)}
          </datalist>
          <input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(cleanText(e.target.value, 320))} placeholder="email@business.com" className="input-base mt-2" aria-label="Business email" />
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[130px_1fr] items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Date</label>
            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="input-base" aria-label="Invoice date" />
          </div>
          <div className="grid grid-cols-[130px_1fr] items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Terms (days)</label>
            <NumericInput integer max={3650} value={paymentTerms} onChange={setPaymentTerms} className="input-base" ariaLabel="Payment terms in days" />
          </div>
          <div className="grid grid-cols-[130px_1fr] items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => handleDueDateChange(e.target.value)} className="input-base" aria-label="Due date" />
          </div>
          <div className="grid grid-cols-[130px_1fr] items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">PO Number</label>
            <input type="text" value={poNumber} onChange={(e) => setPoNumber(cleanText(e.target.value, 100))} placeholder="(optional)" className="input-base" aria-label="PO number" />
          </div>
        </div>
      </div>

      {/* BILL TO + SHIP TO */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Bill To</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(cleanText(e.target.value, 250))} placeholder="Who is this to?" className="input-base" aria-label="Customer name" />
          <textarea value={customerAddress} onChange={(e) => setCustomerAddress(cleanText(e.target.value, MAX_ADDRESS_LENGTH))} placeholder="Customer address (one line each)" rows={2} className="input-base mt-2 resize-none" aria-label="Customer address" />
          <div className="mt-2 grid grid-cols-[140px_1fr] gap-2">
            <input type="text" value={customerTaxIdLabel} onChange={(e) => setCustomerTaxIdLabel(e.target.value)} placeholder="Tax ID label" list="tax-id-presets" className="input-base" aria-label="Customer Tax ID label" />
            <input type="text" value={customerTaxIdValue} onChange={(e) => setCustomerTaxIdValue(cleanText(e.target.value, 100))} placeholder="Tax ID value" className="input-base" aria-label="Customer Tax ID value" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Ship To (optional)</label>
          <input type="text" value={shipToName} onChange={(e) => setShipToName(cleanText(e.target.value, 250))} placeholder="Ship to name" className="input-base" aria-label="Ship to name" />
          <textarea value={shipToAddress} onChange={(e) => setShipToAddress(cleanText(e.target.value, MAX_ADDRESS_LENGTH))} placeholder="Ship to address (one line each)" rows={2} className="input-base mt-2 resize-none" aria-label="Ship to address" />
          <div className="mt-2">
            <Select
              id="currency-select"
              value={currency}
              onChange={setCurrency}
              options={CURRENCIES}
            />
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-[1fr_90px_130px_160px_40px] items-center gap-0 bg-gray-900 text-xs font-semibold text-white">
            <div className="px-3 py-2.5">Item</div>
            <div className="px-3 py-2.5 text-right">Quantity</div>
            <div className="px-3 py-2.5 text-right">Rate</div>
            <div className="px-3 py-2.5 pr-4 text-right">Amount</div>
            <div />
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_90px_130px_160px_40px] items-center gap-0 border-b border-gray-200 dark:border-gray-800">
              <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Description of item/service..." className="input-base !rounded-none !border-0 !px-3 !shadow-none focus:!ring-0" aria-label="Item description" />
              <NumericInput value={item.quantity} onChange={(n) => updateItem(item.id, 'quantity', n)} min={0} max={1000000} className="input-base !rounded-none !border-0 !border-l !px-3 !shadow-none text-right focus:!ring-0 dark:!border-gray-800" ariaLabel="Quantity" />
              <NumericInput value={item.unitPrice} onChange={(n) => updateItem(item.id, 'unitPrice', n)} min={0} max={1000000000} className="input-base !rounded-none !border-0 !border-l !px-3 !shadow-none text-right focus:!ring-0 dark:!border-gray-800" ariaLabel="Rate" />
              <div className="whitespace-nowrap px-3 py-2.5 pr-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(lineAmount(item), currency)}
              </div>
              <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="flex h-full items-center justify-center text-gray-400 hover:bg-error-50 hover:text-error-600 disabled:opacity-30 dark:hover:bg-error-500/10" aria-label="Remove item">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button onClick={addItem} type="button" className="flex w-full items-center justify-center gap-2 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <Plus className="h-4 w-4" /> Line Item
          </button>
        </div>
      </div>

      {/* NOTES + TOTALS */}
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(cleanText(e.target.value, MAX_TEXT_LENGTH))} placeholder="Notes - any relevant information not already covered" rows={3} className="input-base resize-none" aria-label="Notes" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Terms</label>
            <textarea value={terms} onChange={(e) => setTerms(cleanText(e.target.value, MAX_TEXT_LENGTH))} placeholder="Terms and conditions - late fees, payment methods, delivery schedule" rows={3} className="input-base resize-none" aria-label="Terms" />
          </div>
        </div>

        <div className="ml-auto w-full max-w-[280px] space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="ml-auto whitespace-nowrap font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal, currency)}</span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <input type="text" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} placeholder="Tax" list="tax-presets-inline" className="input-base !w-20 !py-1 text-xs" aria-label="Tax label" />
            <datalist id="tax-presets-inline">
              {TAX_PRESETS.map((p) => <option key={p} value={p} />)}
            </datalist>
            <div className="flex flex-1 items-center justify-end gap-1">
              <NumericInput value={taxRate} onChange={setTaxRate} max={100} className="input-base !w-16 !py-1 text-right text-xs" ariaLabel="Tax rate" />
              <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-2">
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Discount</span>
              <NumericInput value={discountRate} onChange={setDiscountRate} max={100} className="input-base !w-14 !py-1 text-right text-xs" ariaLabel="Discount rate" />
              <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
            </div>
            <span className="ml-auto whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {normalizedDiscountRate > 0 ? `-${formatCurrency(discount, currency)}` : formatCurrency(0, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Shipping</span>
            </div>
            <NumericInput value={shipping} onChange={setShipping} min={0} max={1000000000} className="input-base !w-20 !py-1 text-right text-xs" ariaLabel="Shipping" />
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-1.5 dark:border-gray-800">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
            <span className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(total, currency)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
            <NumericInput value={amountPaid} onChange={setAmountPaid} max={total} className="input-base !w-20 !py-1 text-right text-xs" ariaLabel="Amount paid" />
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-1.5 dark:border-gray-800">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Balance Due</span>
            <span className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(balanceDue, currency)}</span>
          </div>

          <label className="flex cursor-pointer items-center gap-2 pt-1.5 text-xs text-gray-600 dark:text-gray-400">
            <input type="checkbox" checked={showAmountInWords} onChange={(e) => setShowAmountInWords(e.target.checked)} className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Show "Amount in Words" in invoice
          </label>
        </div>
      </div>

      {/* ADVANCED FIELDS (Currency moved to Ship To column) */}
      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <button type="button" onClick={() => setShowAdvanced((s) => !s)} className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showAdvanced ? 'Hide' : 'Show'} advanced fields (Bank Details, Signature)
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-4 border-t border-gray-200 pt-3 dark:border-gray-800">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Bank Details</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" className="input-base" aria-label="Bank name" />
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account holder name" className="input-base" aria-label="Account name" />
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" className="input-base" aria-label="Account number" />
                <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="IFSC code" className="input-base" aria-label="IFSC code" />
                <input type="text" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} placeholder="SWIFT code (optional)" className="input-base" aria-label="SWIFT code" />
                <input type="text" value={bankAddress} onChange={(e) => setBankAddress(e.target.value)} placeholder="Bank address (optional)" className="input-base" aria-label="Bank address" />
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Signature & Stamp</h4>
              <div className="space-y-3">
                <input type="text" value={signatoryName} onChange={(e) => setSignatoryName(cleanText(e.target.value, 250))} placeholder="Authorized signatory name (optional)" className="input-base" aria-label="Signatory name" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Signature image (optional)</p>
                    {signatureDataUrl ? (
                      <div className="relative inline-block">
                        <img src={signatureDataUrl} alt="Signature" className="h-16 max-w-[180px] rounded border border-gray-200 bg-white object-contain dark:border-gray-800" />
                        <button type="button" onClick={removeSignature} className="absolute -right-2 -top-2 rounded-full bg-error-500 p-1 text-white hover:bg-error-600" aria-label="Remove signature">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => signatureInputRef.current?.click()} className="flex h-16 w-44 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-gray-700">
                        <Upload className="h-3.5 w-3.5" /> Upload signature
                      </button>
                    )}
                    <input ref={signatureInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={handleSignatureUpload} className="hidden" aria-label="Upload signature" />
                    {signatureDataUrl && (
                      <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={removeSigBg}
                          onChange={(e) => toggleSigBgRemoval(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        Remove signature background
                      </label>
                    )}
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Stamp image (optional)</p>
                    {stampDataUrl ? (
                      <div className="relative inline-block">
                        <img src={stampDataUrl} alt="Stamp" className="h-16 max-w-[180px] rounded border border-gray-200 bg-white object-contain dark:border-gray-800" />
                        <button type="button" onClick={removeStamp} className="absolute -right-2 -top-2 rounded-full bg-error-500 p-1 text-white hover:bg-error-600" aria-label="Remove stamp">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => stampInputRef.current?.click()} className="flex h-16 w-44 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-gray-700">
                        <Upload className="h-3.5 w-3.5" /> Upload stamp
                      </button>
                    )}
                    <input ref={stampInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={handleStampUpload} className="hidden" aria-label="Upload stamp" />
                    {stampDataUrl && (
                      <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={removeStampBg}
                          onChange={(e) => toggleStampBgRemoval(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        Remove stamp background
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <ToolActions>
        <button type="button" onClick={() => setShowPreview((p) => !p)} className="btn-secondary" aria-expanded={showPreview} aria-controls="invoice-preview">
          <Eye className="h-4 w-4" /> {showPreview ? 'Hide preview' : 'Preview'}
        </button>
        <button type="button" onClick={handlePrint} className="btn-secondary">
          <Printer className="h-4 w-4" /> Print
        </button>
        <button type="button" onClick={handleDownloadPdf} disabled={exporting} className="btn-primary">
          <Download className="h-4 w-4" />
          {exporting ? 'Exporting...' : 'Download PDF'}
        </button>
        <ResetButton onClick={handleReset} />
      </ToolActions>

      {exporting && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-3 dark:bg-primary-500/10">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-primary-700 dark:text-primary-400">Generating PDF...</p>
        </div>
      )}

      {/* ===== PREVIEW ===== */}
      {showPreview && (
        <div id="invoice-preview" role="region" aria-label="Invoice preview" className="print-invoice rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {logoDataUrl && (
                <img
                  src={logoDataUrl}
                  alt="Logo"
                  className="object-contain"
                  style={(() => {
                    const box = LOGO_SIZES[logoSize];
                    if (!logoDims) return { maxWidth: `${box.w}mm`, maxHeight: `${box.h}mm` };
                    const fit = fitDims(logoDims.width, logoDims.height, box.w, box.h);
                    return { width: `${fit.w}mm`, height: `${fit.h}mm`, maxWidth: '100%' };
                  })()}
                />
              )}
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">INVOICE</h1>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded border border-gray-200 px-2.5 py-0.5">
                <span className="text-[10px] text-gray-500">#</span>
                <span className="text-xs font-medium text-gray-900">{invoiceNumber}</span>
              </div>
            </div>
          </div>

          {/* FROM + META */}
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1">
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">From:</p>
              <p className="text-sm font-semibold text-gray-900">{businessName || 'Your Business'}</p>
              {businessAddress && (
                <p className="whitespace-pre-line text-xs leading-snug text-gray-500">{businessAddress}</p>
              )}
              {businessTaxIdLabel && businessTaxIdValue && (
                <p className="text-xs text-gray-500">{businessTaxIdLabel}: {businessTaxIdValue}</p>
              )}
              {businessEmail && <p className="text-xs text-gray-500">{businessEmail}</p>}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">{formatDate(invoiceDate)}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-gray-500">Payment Terms:</span>
                <span className="font-medium text-gray-900">{paymentTerms} days</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium text-gray-900">{formatDate(dueDate)}</span>
              </div>
              {poNumber && (
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">PO Number:</span>
                  <span className="font-medium text-gray-900">{poNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* BILL TO + SHIP TO */}
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1">
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Bill To:</p>
              <p className="text-sm font-medium text-gray-900">{customerName || 'Customer Name'}</p>
              {customerAddress && (
                <p className="whitespace-pre-line text-xs leading-snug text-gray-500">{customerAddress}</p>
              )}
              {customerTaxIdLabel && customerTaxIdValue && (
                <p className="text-xs text-gray-500">{customerTaxIdLabel}: {customerTaxIdValue}</p>
              )}
            </div>

            {(shipToName || shipToAddress) && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Ship To:</p>
                <p className="text-sm font-medium text-gray-900">{shipToName || '—'}</p>
                {shipToAddress && (
                  <p className="whitespace-pre-line text-xs leading-snug text-gray-500">{shipToAddress}</p>
                )}
              </div>
            )}
          </div>

          {/* ITEMS TABLE */}
          <table className="mt-4 w-full table-fixed text-xs">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="w-[48%] py-2 pl-3 text-left text-sm font-semibold">Item</th>
                <th className="w-[14%] py-2 pr-4 text-right text-sm font-semibold">Quantity</th>
                <th className="w-[18%] py-2 pr-4 text-right text-sm font-semibold">Rate</th>
                <th className="w-[20%] py-2 pr-4 text-right text-sm font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="break-all py-1.5 pl-3 pr-2 align-top text-gray-700">{item.description || '—'}</td>
                  <td className="py-1.5 pr-4 text-right align-top text-gray-700">{safeNumber(item.quantity)}</td>
                  <td className="py-1.5 pr-4 text-right align-top text-gray-700">
                    {formatCurrency(safeNumber(item.unitPrice), currency)}
                  </td>
                  <td className="py-1.5 pr-4 text-right align-top font-medium text-gray-900">
                    {formatCurrency(lineAmount(item), currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* AMOUNT IN WORDS + TOTALS */}
          <div className="mt-4 grid grid-cols-[1.5fr_1fr] items-start gap-x-6 gap-y-1">
            <div className="space-y-0.5">
              {showAmountInWords && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Amount in Words:</p>
                  <p className="text-xs italic leading-snug text-gray-600">{numberToWords(total, currency)}</p>
                </>
              )}
            </div>

            <div className="ml-auto w-full max-w-[260px] space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span className="whitespace-nowrap text-gray-900">{formatCurrency(subtotal, currency)}</span>
              </div>
              {normalizedDiscountRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount ({normalizedDiscountRate}%):</span>
                  <span className="whitespace-nowrap text-red-600">-{formatCurrency(discount, currency)}</span>
                </div>
              )}
              {normalizedTaxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{taxLabel || 'Tax'} ({normalizedTaxRate}%):</span>
                  <span className="whitespace-nowrap text-gray-900">{formatCurrency(tax, currency)}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping:</span>
                  <span className="whitespace-nowrap text-gray-900">{formatCurrency(shipping, currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-300 pt-1">
                <span className="text-sm font-bold text-gray-900">Total:</span>
                <span className="whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(total, currency)}</span>
              </div>
              {safeAmountPaid > 0 && (
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="whitespace-nowrap text-gray-900">{formatCurrency(safeAmountPaid, currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-300 pt-1">
                <span className="text-sm font-bold text-gray-900">Balance Due:</span>
                <span className="whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(balanceDue, currency)}</span>
              </div>
            </div>
          </div>

          {/* BANK DETAILS */}
          {(bankName || accountName || accountNumber || ifscCode || swiftCode || bankAddress) && (
            <div className="mt-3 border-t border-gray-200 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">BANK DETAILS</p>
              <div className="mt-0.5 grid grid-cols-[max-content_1fr] gap-x-3 text-xs leading-tight">
                {bankName && (
                  <div className="contents">
                    <span className="text-gray-500">Bank Name</span>
                    <span className="text-gray-900">{bankName}</span>
                  </div>
                )}
                {accountName && (
                  <div className="contents">
                    <span className="text-gray-500">Account Name</span>
                    <span className="text-gray-900">{accountName}</span>
                  </div>
                )}
                {accountNumber && (
                  <div className="contents">
                    <span className="text-gray-500">Account Number</span>
                    <span className="text-gray-900">{accountNumber}</span>
                  </div>
                )}
                {ifscCode && (
                  <div className="contents">
                    <span className="text-gray-500">IFSC Code</span>
                    <span className="text-gray-900">{ifscCode}</span>
                  </div>
                )}
                {swiftCode && (
                  <div className="contents">
                    <span className="text-gray-500">SWIFT Code</span>
                    <span className="text-gray-900">{swiftCode}</span>
                  </div>
                )}
                {bankAddress && (
                  <div className="contents">
                    <span className="text-gray-500">Bank Address</span>
                    <span className="text-gray-900">{bankAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NOTES/TERMS + SIGNATURE */}
          <div className="mt-4 grid grid-cols-[1.4fr_1fr] items-start gap-x-6 gap-y-1">
            <div className="space-y-2">
              {notes && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">NOTES:</p>
                  <p className="mt-0.5 whitespace-pre-line text-xs leading-snug text-gray-600">{notes}</p>
                </div>
              )}
              {terms && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">TERMS:</p>
                  <p className="mt-0.5 whitespace-pre-line text-xs leading-snug text-gray-600">{terms}</p>
                </div>
              )}
            </div>

            {(signatoryName || signatureDataUrl || stampDataUrl) && (
              <div className="ml-auto w-40 space-y-1 text-center">
                <p className="text-[10px] font-semibold text-gray-900">
                  For {businessName || 'Your Business'}
                </p>
                {signatureDataUrl && (
                  <img
                    src={signatureDataUrl}
                    alt="Signature"
                    className="mx-auto h-12 w-32 object-contain"
                  />
                )}
                {signatoryName.trim() && (
                  <div className="mx-auto w-32 border-t border-gray-500 pt-1">
                    <p className="text-[10px] font-medium text-gray-700">
                      {signatoryName.trim()}
                    </p>
                  </div>
                )}
                {stampDataUrl && (
                  <img
                    src={stampDataUrl}
                    alt="Stamp"
                    className="mx-auto mt-3 h-16 w-28 object-contain"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}