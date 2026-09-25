import { useState, type ReactNode } from 'react';
import { Copy, Check, RotateCcw, Download, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function ToolWorkspace({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function ToolActions({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

export function ToolResult({
  children,
  visible,
  className = '',
}: {
  children: ReactNode;
  visible: boolean;
  className?: string;
}) {
  if (!visible) return null;
  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50 p-4 animate-fade-in dark:border-gray-800 dark:bg-gray-900/50 ${className}`}>
      {children}
    </div>
  );
}

export function ToolResultHeader({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </div>
  );
}

export function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`btn-secondary ${className}`}
      aria-label={label}
    >
      {copied ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

export function DownloadButton({
  onClick,
  label = 'Download',
  disabled = false,
  className = '',
}: {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn-primary ${className}`}>
      <Download className="h-4 w-4" /> {label}
    </button>
  );
}

export function ResetButton({
  onClick,
  label = 'Reset',
  className = '',
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`btn-secondary ${className}`}>
      <RotateCcw className="h-4 w-4" /> {label}
    </button>
  );
}

export function ClearButton({
  onClick,
  label = 'Clear',
  className = '',
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`btn-secondary ${className}`}>
      <X className="h-4 w-4" /> {label}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
  htmlFor,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  id,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-base cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  id,
  rows = 8,
  ariaLabel,
  mono = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  rows?: number;
  ariaLabel?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`input-base resize-y scrollbar-thin ${mono ? 'font-mono text-sm' : ''}`}
    />
  );
}

export function InfoRow({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
