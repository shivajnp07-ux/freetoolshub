import { useState } from 'react';
import { Image as ImageIcon, Zap, Download } from 'lucide-react';
import imageCompression from 'browser-image-compression';
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

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
  previewUrl: string;
  originalPreviewUrl: string;
}

export function ImageCompressor() {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [quality, setQuality] = useState(70);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [format, setFormat] = useState('image/jpeg');
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);

  function handleFiles(files: File[]) {
    const f = files[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setResult(null);
      setOriginalPreview(URL.createObjectURL(f));
    } else {
      showToast('Please upload an image file', 'error');
    }
  }

  async function handleCompress() {
    if (!file) return;
    setCompressing(true);

    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 5,
        maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: quality / 100,
        fileType: format,
      });

      setResult({
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressedBlob,
        previewUrl: URL.createObjectURL(compressedBlob),
        originalPreviewUrl: originalPreview,
      });

      const savedPercent = Math.round((1 - compressedBlob.size / file.size) * 100);
      showToast(
        savedPercent > 0
          ? `Image compressed — ${savedPercent}% smaller`
          : 'Image compressed (best possible result)',
        'success'
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Compression failed';
      showToast(msg, 'error');
    } finally {
      setCompressing(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.previewUrl;
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    a.download = `compressed-${Date.now()}.${ext}`;
    a.click();
    showToast('Downloaded compressed image', 'success');
  }

  function handleReset() {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setFile(null);
    setResult(null);
    setOriginalPreview('');
    setQuality(70);
    setMaxWidthOrHeight(1920);
    setFormat('image/jpeg');
  }

  return (
    <ToolWorkspace>
      {!file ? (
        <FileDropZone
          onFiles={handleFiles}
          accept="image/*"
          label="Click to upload or drag and drop your image"
          hint="JPG, PNG, WebP · Max 50MB"
        />
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Original ({formatBytes(file.size)})
              </p>
              <img
                src={originalPreview}
                alt="Original"
                className="max-h-48 w-full rounded-lg object-contain"
              />
            </div>
            {result && (
              <div className="rounded-xl border border-primary-200 bg-primary-50/30 p-3 dark:border-primary-500/30 dark:bg-primary-500/5">
                <p className="mb-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                  Compressed ({formatBytes(result.compressedSize)})
                </p>
                <img
                  src={result.previewUrl}
                  alt="Compressed"
                  className="max-h-48 w-full rounded-lg object-contain"
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <Field label="Quality" htmlFor="quality-slider" hint={`${quality}% quality`}>
            <input
              id="quality-slider"
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Max dimensions"
              htmlFor="max-size"
              hint="Larger images will be resized"
            >
              <Select
                id="max-size"
                value={String(maxWidthOrHeight)}
                onChange={(v) => setMaxWidthOrHeight(Number(v))}
                options={[
                  { value: '800', label: '800px (thumbnail)' },
                  { value: '1280', label: '1280px (web)' },
                  { value: '1920', label: '1920px (Full HD)' },
                  { value: '2560', label: '2560px (2K)' },
                  { value: '4096', label: '4096px (4K)' },
                ]}
              />
            </Field>

            <Field label="Output format" htmlFor="output-format">
              <Select
                id="output-format"
                value={format}
                onChange={setFormat}
                options={[
                  { value: 'image/jpeg', label: 'JPG — Best for photos' },
                  { value: 'image/png', label: 'PNG — Lossless' },
                  { value: 'image/webp', label: 'WebP — Smallest size' },
                ]}
              />
            </Field>
          </div>

          {/* Size comparison */}
          {result && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                <InfoRow label="Original size" value={formatBytes(result.originalSize)} />
                <InfoRow
                  label="Compressed size"
                  value={
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatBytes(result.compressedSize)}
                    </span>
                  }
                />
                <InfoRow
                  label="Saved"
                  value={
                    <span
                      className={
                        result.compressedSize < result.originalSize
                          ? 'text-success-600 dark:text-success-500'
                          : 'text-gray-500'
                      }
                    >
                      {result.compressedSize < result.originalSize
                        ? `${Math.round((1 - result.compressedSize / result.originalSize) * 100)}% smaller`
                        : 'Best possible — try different settings'}
                    </span>
                  }
                />
              </div>
            </div>
          )}

          <ToolActions>
            <button
              onClick={handleCompress}
              disabled={compressing}
              className="btn-primary"
            >
              <Zap className="h-4 w-4" />
              {compressing ? 'Compressing...' : result ? 'Re-compress' : 'Compress Image'}
            </button>
            {result && (
              <button onClick={handleDownload} className="btn-secondary">
                <Download className="h-4 w-4" /> Download
              </button>
            )}
            <ResetButton onClick={handleReset} />
          </ToolActions>
        </div>
      )}

      {compressing && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-primary-700 dark:text-primary-400">
            Compressing image... please wait
          </p>
        </div>
      )}
    </ToolWorkspace>
  );
}