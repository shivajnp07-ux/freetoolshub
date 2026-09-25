import { useState } from 'react';
import { BadgeCheck, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  TextArea,
  ClearButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

const SAMPLE_VALID = `{"name":"FreeToolsHub","tools":["JSON Formatter","JSON Validator"],"version":"1.0","active":true}`;

const SAMPLE_INVALID = `{"name":"FreeToolsHub", "tools": ["JSON Formatter",], "version": "1.0"`;

interface ValidationResult {
  valid: boolean;
  error?: string;
  keyCount?: number;
  arrayLength?: number;
  type: string;
}

export function JsonValidator() {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  function handleValidate() {
    if (!input.trim()) {
      showToast('Please enter JSON to validate', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      let keyCount: number | undefined;
      let arrayLength: number | undefined;
      let type = 'unknown';

      if (Array.isArray(parsed)) {
        arrayLength = parsed.length;
        type = 'array';
      } else if (typeof parsed === 'object' && parsed !== null) {
        keyCount = Object.keys(parsed).length;
        type = 'object';
      } else {
        type = typeof parsed;
      }

      setResult({ valid: true, keyCount, arrayLength, type });
      showToast('JSON is valid', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setResult({ valid: false, error: msg, type: 'invalid' });
      showToast('JSON is invalid', 'error');
    }
  }

  function handleLoadValid() {
    setInput(SAMPLE_VALID);
    setResult(null);
  }

  function handleLoadInvalid() {
    setInput(SAMPLE_INVALID);
    setResult(null);
  }

  function handleClear() {
    setInput('');
    setResult(null);
  }

  return (
    <ToolWorkspace>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="json-validate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          JSON to validate
        </label>
        <div className="flex gap-2">
          <button onClick={handleLoadValid} className="btn-ghost text-xs" type="button">
            <Sparkles className="h-3.5 w-3.5" /> Valid sample
          </button>
          <button onClick={handleLoadInvalid} className="btn-ghost text-xs" type="button">
            <XCircle className="h-3.5 w-3.5" /> Invalid sample
          </button>
        </div>
      </div>

      <TextArea
        id="json-validate"
        value={input}
        onChange={setInput}
        placeholder="Paste your JSON here..."
        rows={10}
        ariaLabel="JSON input"
        mono
      />

      <ToolActions>
        <button onClick={handleValidate} className="btn-primary">
          <BadgeCheck className="h-4 w-4" /> Validate JSON
        </button>
        <ClearButton onClick={handleClear} />
      </ToolActions>

      <ToolResult visible={!!result}>
        {result && (
          <>
            <ToolResultHeader label="Validation result" />
            {result.valid ? (
              <div className="flex items-start gap-3 rounded-lg bg-success-50 p-4 dark:bg-success-500/10">
                <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-success-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-success-700 dark:text-success-500">
                    Valid JSON
                  </p>
                  <div className="mt-1 space-y-0.5 text-xs text-success-600 dark:text-success-500/80">
                    <p>Type: {result.type}</p>
                    {result.keyCount !== undefined && (
                      <p>
                        {result.keyCount} top-level {result.keyCount === 1 ? 'key' : 'keys'} found
                      </p>
                    )}
                    {result.arrayLength !== undefined && (
                      <p>
                        Array with {result.arrayLength}{' '}
                        {result.arrayLength === 1 ? 'item' : 'items'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 dark:bg-error-500/10">
                <XCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-error-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-error-700 dark:text-error-500">
                    Invalid JSON
                  </p>
                  <p className="mt-1 break-words text-xs text-error-600 dark:text-error-500/80">
                    {result.error}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </ToolResult>
    </ToolWorkspace>
  );
}