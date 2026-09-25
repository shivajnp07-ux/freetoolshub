import { useState } from 'react';
import { ArrowDownUp, ArrowUp, ArrowDown } from 'lucide-react';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  TextArea,
  CopyButton,
  ClearButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

/**
 * Encode a string to Base64 with full UTF-8 support.
 * Handles large inputs by chunking to avoid stack overflow.
 */
function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  // Chunk in 8192-byte blocks to avoid "Maximum call stack size exceeded"
  const CHUNK_SIZE = 8192;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

/**
 * Decode a Base64 string back to UTF-8 text.
 */
function decodeBase64(input: string): string {
  // Remove whitespace (people often paste with line breaks)
  const cleaned = input.replace(/\s/g, '');
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function Base64EncoderDecoder() {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function handleEncode() {
    if (!input) {
      showToast('Please enter text to encode', 'error');
      return;
    }
    try {
      setOutput(encodeBase64(input));
      showToast('Encoded to Base64', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to encode';
      showToast(msg, 'error');
    }
  }

  function handleDecode() {
    if (!input) {
      showToast('Please enter Base64 to decode', 'error');
      return;
    }
    try {
      const decoded = decodeBase64(input.trim());
      setOutput(decoded);
      showToast('Decoded from Base64', 'success');
    } catch {
      showToast('Invalid Base64 input — check the string', 'error');
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  return (
    <ToolWorkspace>
      <label
        htmlFor="base64-input"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Input
      </label>
      <TextArea
        id="base64-input"
        value={input}
        onChange={setInput}
        placeholder="Enter text to encode or Base64 to decode..."
        rows={6}
        ariaLabel="Base64 input"
        mono
      />

      <ToolActions>
        <button onClick={handleEncode} className="btn-primary">
          <ArrowUp className="h-4 w-4" /> Encode to Base64
        </button>
        <button onClick={handleDecode} className="btn-secondary">
          <ArrowDown className="h-4 w-4" /> Decode from Base64
        </button>
        <ClearButton onClick={handleClear} />
      </ToolActions>

      {output && (
        <div className="flex items-center justify-center">
          <ArrowDownUp className="h-5 w-5 text-gray-400" />
        </div>
      )}

      <ToolResult visible={!!output}>
        <ToolResultHeader label="Output">
          <CopyButton text={output} />
        </ToolResultHeader>
        <pre className="max-h-60 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 scrollbar-thin">
          <code className="font-mono text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap">
            {output}
          </code>
        </pre>
      </ToolResult>
    </ToolWorkspace>
  );
}