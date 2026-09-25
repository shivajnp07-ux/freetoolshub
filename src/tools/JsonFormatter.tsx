import { useState } from 'react';
import { Braces, Minimize2, FileDown } from 'lucide-react';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  Select,
  TextArea,
  CopyButton,
  ClearButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

const SAMPLE = `{"name":"FreeToolsHub","tools":[{"id":1,"name":"PDF Compressor","popular":true},{"id":2,"name":"JSON Formatter","popular":true}],"version":"1.0","active":true}`;

export function JsonFormatter() {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState('2');

  function handleFormat() {
    if (!input.trim()) {
      showToast('Please enter JSON to format', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const spaces = indent === 'tab' ? '\t' : Number(indent);
      setOutput(JSON.stringify(parsed, null, spaces));
      showToast('JSON formatted successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setOutput('');
      showToast(`Invalid JSON: ${msg}`, 'error');
    }
  }

  function handleMinify() {
    if (!input.trim()) {
      showToast('Please enter JSON to minify', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      showToast('JSON minified successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setOutput('');
      showToast(`Invalid JSON: ${msg}`, 'error');
    }
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded formatted.json', 'success');
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  return (
    <ToolWorkspace>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="json-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Input JSON
            </label>
            <button
              onClick={() => setInput(SAMPLE)}
              className="btn-ghost text-xs"
              type="button"
            >
              Load sample
            </button>
          </div>
        </div>
        <div className="sm:w-44">
          <Field label="Indentation" htmlFor="indent-select">
            <Select
              id="indent-select"
              value={indent}
              onChange={setIndent}
              options={[
                { value: '2', label: '2 spaces' },
                { value: '4', label: '4 spaces' },
                { value: 'tab', label: 'Tab' },
              ]}
            />
          </Field>
        </div>
      </div>

      <TextArea
        id="json-input"
        value={input}
        onChange={setInput}
        placeholder='{"key": "value"}'
        rows={10}
        ariaLabel="Input JSON"
        mono
      />

      <ToolActions>
        <button onClick={handleFormat} className="btn-primary">
          <Braces className="h-4 w-4" /> Format
        </button>
        <button onClick={handleMinify} className="btn-secondary">
          <Minimize2 className="h-4 w-4" /> Minify
        </button>
        <ClearButton onClick={handleClear} />
      </ToolActions>

      <ToolResult visible={!!output}>
        <ToolResultHeader label="Formatted output">
          <div className="flex gap-2">
            <CopyButton text={output} />
            <button onClick={handleDownload} className="btn-secondary">
              <FileDown className="h-4 w-4" /> Download
            </button>
          </div>
        </ToolResultHeader>
        <pre className="max-h-80 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 scrollbar-thin">
          <code className="font-mono text-gray-800 dark:text-gray-200">{output}</code>
        </pre>
      </ToolResult>
    </ToolWorkspace>
  );
}