import { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';
import { md5 } from 'js-md5';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  Select,
  TextArea,
  ClearButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

const ALGORITHMS = [
  { value: 'sha-256', label: 'SHA-256 (recommended)' },
  { value: 'sha-512', label: 'SHA-512' },
  { value: 'sha-1', label: 'SHA-1 (legacy)' },
  { value: 'md5', label: 'MD5 (not for security)' },
];

async function computeHash(text: string, algorithm: string): Promise<string> {
  if (algorithm === 'md5') {
    // js-md5 is synchronous
    return md5(text);
  }

  // Web Crypto API for SHA family
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function HashGenerator() {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('sha-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!input) {
      showToast('Please enter text to hash', 'error');
      return;
    }
    try {
      const result = await computeHash(input, algorithm);
      setHash(result);
      showToast(
        `${ALGORITHMS.find((a) => a.value === algorithm)?.label} hash generated`,
        'success'
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate hash';
      showToast(msg, 'error');
    }
  }

  async function handleCopy() {
    if (!hash) return;
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    showToast('Hash copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClear() {
    setInput('');
    setHash('');
  }

  return (
    <ToolWorkspace>
      <Field label="Algorithm" htmlFor="hash-algorithm">
        <Select
          id="hash-algorithm"
          value={algorithm}
          onChange={setAlgorithm}
          options={ALGORITHMS}
        />
      </Field>

      <label
        htmlFor="hash-input"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Input text
      </label>
      <TextArea
        id="hash-input"
        value={input}
        onChange={setInput}
        placeholder="Enter text to hash..."
        rows={5}
        ariaLabel="Text to hash"
        mono
      />

      <ToolActions>
        <button onClick={handleGenerate} className="btn-primary">
          <Hash className="h-4 w-4" /> Generate Hash
        </button>
        <ClearButton onClick={handleClear} />
      </ToolActions>

      <ToolResult visible={!!hash}>
        <ToolResultHeader
          label={`${ALGORITHMS.find((a) => a.value === algorithm)?.label} hash`}
        >
          <button onClick={handleCopy} className="btn-secondary">
            {copied ? (
              <Check className="h-4 w-4 text-success-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </ToolResultHeader>
        <pre className="overflow-auto rounded-lg bg-white p-3 dark:bg-gray-900 scrollbar-thin">
          <code className="font-mono text-sm break-all text-gray-800 dark:text-gray-200">
            {hash}
          </code>
        </pre>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {hash.length} characters · {hash.length * 4} bits
        </p>
      </ToolResult>
    </ToolWorkspace>
  );
}