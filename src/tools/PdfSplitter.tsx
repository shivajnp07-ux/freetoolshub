import { useState } from 'react';
import { FileText, Scissors, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { FileDropZone } from '@/components/tool/FileDropZone';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  InfoRow,
  ResetButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parsePageRange(range: string, totalPages: number): number[] {
  const indices: number[] = [];
  const parts = range.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        throw new Error(`Invalid range: ${part} (valid: 1-${totalPages})`);
      }
      for (let i = start; i <= end; i++) indices.push(i - 1);
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page) || page < 1 || page > totalPages) {
        throw new Error(`Invalid page: ${part} (valid: 1-${totalPages})`);
      }
      indices.push(page - 1);
    }
  }
  return indices;
}

export function PdfSplitter() {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; size: number; pages: number } | null>(
    null
  );

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f || f.type !== 'application/pdf') {
      showToast('Please upload a PDF file', 'error');
      return;
    }
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setFile(f);
      setPageCount(pdf.getPageCount());
      setResult(null);
      setPageRange('');
      showToast(`PDF loaded — ${pdf.getPageCount()} pages`, 'success');
    } catch {
      showToast('Could not read PDF file', 'error');
    }
  }

  async function handleSplit() {
    if (!file) return;
    if (!pageRange.trim()) {
      showToast('Please enter a page range', 'error');
      return;
    }

    setSplitting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const indices = parsePageRange(pageRange, pageCount);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });

      setResult({ blob, size: blob.size, pages: indices.length });
      showToast(`Extracted ${indices.length} pages`, 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Split failed';
      showToast(msg, 'error');
    } finally {
      setSplitting(false);
    }
  }

  function handleDownload() {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `split-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded split PDF', 'success');
  }

  function handleReset() {
    setFile(null);
    setPageCount(0);
    setPageRange('');
    setResult(null);
  }

  return (
    <ToolWorkspace>
      {!file ? (
        <FileDropZone
          onFiles={handleFiles}
          accept="application/pdf"
          label="Click to upload or drag and drop your PDF"
          hint="PDF files only · Max 200MB"
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                <FileText className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(file.size)} · {pageCount} pages
                </p>
              </div>
              <button onClick={handleReset} className="btn-ghost text-xs" type="button">
                Remove
              </button>
            </div>
          </div>

          <Field
            label="Pages to extract"
            htmlFor="page-range"
            hint={`Examples: 1-5, 3, 7-10 (total ${pageCount} pages)`}
          >
            <input
              id="page-range"
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="1-5, 8, 12-15"
              className="input-base"
            />
          </Field>

          <ToolActions>
            <button onClick={handleSplit} disabled={splitting} className="btn-primary">
              <Scissors className="h-4 w-4" />
              {splitting ? 'Splitting...' : 'Split PDF'}
            </button>
            <ResetButton onClick={handleReset} />
          </ToolActions>
        </div>
      )}

      {splitting && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-primary-700 dark:text-primary-400">Splitting PDF...</p>
        </div>
      )}

      <ToolResult visible={!!result}>
        {result && (
          <>
            <ToolResultHeader label="Split complete">
              <button onClick={handleDownload} className="btn-primary">
                <Download className="h-4 w-4" /> Download Split PDF
              </button>
            </ToolResultHeader>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <InfoRow label="Source pages" value={pageCount} />
              <InfoRow label="Extracted pages" value={result.pages} />
              <InfoRow label="Output size" value={formatBytes(result.size)} />
            </div>
          </>
        )}
      </ToolResult>
    </ToolWorkspace>
  );
}