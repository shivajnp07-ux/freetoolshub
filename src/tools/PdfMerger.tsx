import { useState } from 'react';
import { FileText, GripVertical, Trash2, Combine, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { FileDropZone } from '@/components/tool/FileDropZone';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  ResetButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

interface PdfFile {
  id: string;
  file: File;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfMerger() {
  const { showToast } = useToast();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; size: number; pageCount: number } | null>(
    null
  );

  function handleFiles(newFiles: File[]) {
    const pdfFiles = newFiles.filter((f) => f.type === 'application/pdf');
    if (pdfFiles.length !== newFiles.length) {
      showToast('Only PDF files are supported', 'error');
    }
    if (pdfFiles.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...pdfFiles.map((f) => ({ id: `${Date.now()}-${Math.random()}`, file: f })),
      ]);
      setResult(null);
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResult(null);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  async function handleMerge() {
    if (files.length < 2) {
      showToast('Please add at least 2 PDF files to merge', 'error');
      return;
    }

    setMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      // Create a fresh Uint8Array to ensure clean Blob
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });

      setResult({
        blob,
        size: blob.size,
        pageCount: mergedPdf.getPageCount(),
      });

      showToast(`Merged ${files.length} PDFs into ${mergedPdf.getPageCount()} pages`, 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Merge failed';
      showToast(`Merge failed: ${msg}`, 'error');
    } finally {
      setMerging(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded merged PDF', 'success');
  }

  function handleReset() {
    setFiles([]);
    setResult(null);
  }

  return (
    <ToolWorkspace>
      <FileDropZone
        onFiles={handleFiles}
        accept="application/pdf"
        multiple
        label="Click to upload or drag and drop PDF files"
        hint="Add 2 or more PDF files to merge · PDF only"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {files.length} {files.length === 1 ? 'file' : 'files'} — drag to reorder
          </p>
          {files.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={() => setDragIndex(null)}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
            >
              <GripVertical className="h-5 w-5 flex-shrink-0 cursor-grab text-gray-400" />
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                <FileText className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {item.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(item.file.size)}
                </p>
              </div>
              <span className="badge-base bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                #{index + 1}
              </span>
              <button
                onClick={() => removeFile(item.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                aria-label={`Remove ${item.file.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <ToolActions>
          <button onClick={handleMerge} disabled={merging} className="btn-primary">
            <Combine className="h-4 w-4" />
            {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
          </button>
          <ResetButton onClick={handleReset} />
        </ToolActions>
      )}

      {merging && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-primary-700 dark:text-primary-400">
            Merging PDFs... please wait
          </p>
        </div>
      )}

      <ToolResult visible={!!result}>
        {result && (
          <>
            <ToolResultHeader label="Merge complete">
              <button onClick={handleDownload} className="btn-primary">
                <Download className="h-4 w-4" /> Download Merged PDF
              </button>
            </ToolResultHeader>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                ✅ Your {files.length} PDF files merged successfully
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Total pages: <span className="font-medium">{result.pageCount}</span>
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                File size: <span className="font-medium">{formatBytes(result.size)}</span>
              </p>
            </div>
          </>
        )}
      </ToolResult>
    </ToolWorkspace>
  );
}