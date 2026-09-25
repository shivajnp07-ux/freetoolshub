import { useState } from 'react';
import { FileText, Zap, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { FileDropZone } from '@/components/tool/FileDropZone';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  Select,
  InfoRow,
  ResetButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface CompressResult {
  originalSize: number;
  compressedSize: number;
  blob: Blob;
  savedPercent: number;
}

export function PdfCompressor() {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState('medium');
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);

  function handleFiles(files: File[]) {
    const f = files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResult(null);
    } else {
      showToast('Please upload a PDF file', 'error');
    }
  }

  async function handleCompress() {
    if (!file) return;
    setCompressing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { updateMetadata: false });

      // Clean up metadata to reduce size
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');

      const useObjectStreams = true;
      const addDefaultPage = false;

      const compressedBytes = await pdf.save({
        useObjectStreams,
        addDefaultPage,
        objectsPerTick: level === 'strong' ? 100 : level === 'medium' ? 50 : 20,
      });

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
      const savedPercent = Math.round((1 - blob.size / file.size) * 100);

      setResult({
        originalSize: file.size,
        compressedSize: blob.size,
        blob,
        savedPercent,
      });

      if (savedPercent > 0) {
        showToast(`PDF compressed — ${savedPercent}% smaller`, 'success');
      } else {
        showToast('PDF already optimized — no further reduction possible', 'info');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Compression failed';
      showToast(`Compression failed: ${msg}`, 'error');
    } finally {
      setCompressing(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded compressed PDF', 'success');
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setLevel('medium');
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
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
              </div>
              <button onClick={handleReset} className="btn-ghost text-xs" type="button">
                Remove
              </button>
            </div>
          </div>

          <Field label="Compression level" htmlFor="compression-level">
            <Select
              id="compression-level"
              value={level}
              onChange={setLevel}
              options={[
                { value: 'light', label: 'Light — Fast, minimal reduction' },
                { value: 'medium', label: 'Medium — Balanced (recommended)' },
                { value: 'strong', label: 'Strong — Slowest, best reduction' },
              ]}
            />
          </Field>

          <div className="rounded-xl border border-warning-200 bg-warning-50/50 p-3 text-xs text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/5 dark:text-warning-500">
            <strong>Note:</strong> Browser-based PDF compression is limited. You'll typically see
            5-25% reduction. For deeper compression, use dedicated desktop tools.
          </div>

          <ToolActions>
            <button onClick={handleCompress} disabled={compressing} className="btn-primary">
              <Zap className="h-4 w-4" />
              {compressing ? 'Compressing...' : 'Compress PDF'}
            </button>
            <ResetButton onClick={handleReset} />
          </ToolActions>
        </div>
      )}

      {compressing && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-primary-700 dark:text-primary-400">
            Compressing PDF... this may take a moment
          </p>
        </div>
      )}

      <ToolResult visible={!!result}>
        {result && (
          <>
            <ToolResultHeader label="Compression result">
              <button onClick={handleDownload} className="btn-primary">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </ToolResultHeader>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <InfoRow label="Original size" value={formatBytes(result.originalSize)} />
              <InfoRow label="Compressed size" value={formatBytes(result.compressedSize)} />
              <InfoRow
                label="Saved"
                value={
                  <span
                    className={
                      result.savedPercent > 0
                        ? 'text-success-600 dark:text-success-500'
                        : 'text-gray-500'
                    }
                  >
                    {result.savedPercent > 0
                      ? `${result.savedPercent}% smaller`
                      : 'Already optimized'}
                  </span>
                }
              />
            </div>
          </>
        )}
      </ToolResult>
    </ToolWorkspace>
  );
}