import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowDownUp } from 'lucide-react';
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

type EncodeMode = 'component' | 'uri';

export function UrlEncoderDecoder() {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<EncodeMode>('component');

  function handleEncode() {
    if (!input) {
      showToast('Please enter text to encode', 'error');
      return;
    }
    try {
      const result =
        mode === 'component' ? encodeURIComponent(input) : encodeURI(input);
      setOutput(result);
      showToast('URL encoded', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to encode';
      showToast(msg, 'error');
    }
  }

  function handleDecode() {
    if (!input) {
      showToast('Please enter a URL to decode', 'error');
      return;
    }
    try {
      const result =
        mode === 'component' ? decodeURIComponent(input) : decodeURI(input);
      setOutput(result);
      showToast('URL decoded', 'success');
    } catch {
      showToast('Invalid URL encoding — check the string', 'error');
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  return (
    <ToolWorkspace>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="url-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Input
        </label>
        <div className="flex gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-gray-800">
          <button
            onClick={() => setMode('component')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'component'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            type="button"
          >
            Component
          </button>
          <button
            onClick={() => setMode('uri')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'uri'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            type="button"
          >
            Full URI
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {mode === 'component'
          ? 'Component mode: encodes all special characters including : / ? # & ='
          : 'Full URI mode: preserves : / ? # & = for complete URLs'}
      </p>

      <TextArea
        id="url-input"
        value={input}
        onChange={setInput}
        placeholder={
          mode === 'component'
            ? 'hello world & special=characters'
            : 'https://example.com/path?query=hello world'
        }
        rows={5}
        ariaLabel="URL input"
        mono
      />

      <ToolActions>
        <button onClick={handleEncode} className="btn-primary">
          <ArrowUp className="h-4 w-4" /> Encode URL
        </button>
        <button onClick={handleDecode} className="btn-secondary">
          <ArrowDown className="h-4 w-4" /> Decode URL
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