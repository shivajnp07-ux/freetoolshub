import { useState } from 'react';
import { Calculator, Copy, Check } from 'lucide-react';
import { ToolWorkspace, ToolActions, ResetButton } from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

type Mode = 'percentOf' | 'whatPercent' | 'increaseDecrease';

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: 'percentOf', label: 'X% of Y', description: 'What is X% of Y?' },
  { id: 'whatPercent', label: 'X is what % of Y', description: 'X is what percentage of Y?' },
  {
    id: 'increaseDecrease',
    label: '% Increase / Decrease',
    description: 'Percentage change from X to Y',
  },
];

function formatNumber(n: number): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return '—';
  if (n % 1 === 0) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function PercentageCalculator() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>('percentOf');
  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');
  const [copied, setCopied] = useState(false);

  const a = parseFloat(valueA);
  const b = parseFloat(valueB);
  const hasA = valueA.trim() !== '' && !Number.isNaN(a);
  const hasB = valueB.trim() !== '' && !Number.isNaN(b);

  let result = 0;
  let explanation = '';
  let hasError = false;

  if (mode === 'percentOf') {
    if (hasA && hasB) {
      result = (a / 100) * b;
      explanation = `${formatNumber(a)}% of ${formatNumber(b)} = ${formatNumber(result)}`;
    }
  } else if (mode === 'whatPercent') {
    if (hasA && hasB) {
      if (b === 0) {
        hasError = true;
        explanation = 'Cannot divide by zero';
      } else {
        result = (a / b) * 100;
        explanation = `${formatNumber(a)} is ${formatNumber(result)}% of ${formatNumber(b)}`;
      }
    }
  } else {
    if (hasA && hasB) {
      if (a === 0) {
        hasError = true;
        explanation = 'Cannot calculate percentage change from zero';
      } else {
        result = ((b - a) / Math.abs(a)) * 100;
        const direction = result >= 0 ? 'increase' : 'decrease';
        explanation = `From ${formatNumber(a)} to ${formatNumber(b)}: ${formatNumber(
          Math.abs(result)
        )}% ${direction}`;
      }
    }
  }

  const showResult = hasA && hasB && !hasError;

  async function handleCopyResult() {
    if (!showResult) return;
    await navigator.clipboard.writeText(explanation);
    setCopied(true);
    showToast('Result copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setValueA('');
    setValueB('');
    setMode('percentOf');
  }

  const labels = {
    percentOf: { a: 'Percentage (%)', b: 'Value' },
    whatPercent: { a: 'Value', b: 'Total' },
    increaseDecrease: { a: 'Original value', b: 'New value' },
  };

  return (
    <ToolWorkspace>
      <div role="tablist" aria-label="Calculation mode" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === m.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {MODES.find((m) => m.id === mode)?.description}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="calc-a"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {labels[mode].a}
          </label>
          <input
            id="calc-a"
            type="number"
            value={valueA}
            onChange={(e) => setValueA(e.target.value)}
            placeholder="0"
            className="input-base mt-1.5"
          />
        </div>
        <div>
          <label
            htmlFor="calc-b"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {labels[mode].b}
          </label>
          <input
            id="calc-b"
            type="number"
            value={valueB}
            onChange={(e) => setValueB(e.target.value)}
            placeholder="0"
            className="input-base mt-1.5"
          />
        </div>
      </div>

      <div
        className={`rounded-xl border p-5 text-center ${
          hasError
            ? 'border-error-200 bg-error-50/50 dark:border-error-500/20 dark:bg-error-500/5'
            : 'border-primary-200 bg-primary-50/50 dark:border-primary-500/20 dark:bg-primary-500/5'
        }`}
      >
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Result</p>
        <p
          className={`mt-1 text-3xl font-bold ${
            hasError
              ? 'text-error-600 dark:text-error-500'
              : 'text-primary-600 dark:text-primary-400'
          }`}
        >
          {hasError ? '—' : showResult ? formatNumber(result) : '—'}
          {!hasError && showResult && mode === 'whatPercent' ? '%' : ''}
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {hasError
            ? explanation
            : showResult
              ? explanation
              : 'Enter both values to see the result'}
        </p>
        {showResult && (
          <button
            onClick={handleCopyResult}
            className="btn-secondary mt-3 !px-3 !py-1.5 text-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy result'}
          </button>
        )}
      </div>

      <ToolActions>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calculator className="h-4 w-4" />
          Results update automatically
        </div>
        <ResetButton onClick={handleReset} />
      </ToolActions>
    </ToolWorkspace>
  );
}