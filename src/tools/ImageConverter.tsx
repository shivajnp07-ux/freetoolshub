import { useState } from 'react';
import { Image as ImageIcon, RefreshCw, Download } from 'lucide-react';
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

function detectFormat(file: File): string {
  const type = file.type;
  if (type === 'image/jpeg') return 'JPG';
  if (type === 'image/png') return 'PNG';
  if (type === 'image/webp') return 'WebP';
  if (type === 'image/gif') return 'GIF';
  if (type === 'image/bmp') return 'BMP';
  if (type === 'image/svg+xml') return 'SVG';
  return type.split('/')[1]?.toUpperCase() ?? 'Unknown';
}

interface ConvertResult {
  inputFormat: string;
  outputFormat: string;
  inputSize: number;
  outputSize: number;
  blob: Blob;
  previewUrl: string;
  originalPreviewUrl: string;
}

export function ImageConverter() {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState('image/png');
  const [quality, setQuality] = useState(90);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);

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

  async function handleConvert() {
    if (!file) return;
    setConverting(true);

    try {
      // Pass through with minimal compression to convert format
      const convertedBlob = await imageCompression(file, {
        maxSizeMB: 100,
        maxWidthOrHeight: 8192,
        useWebWorker: true,
        initialQuality: quality / 100,
        fileType: outputFormat,
      });

      setResult({
        inputFormat: detectFormat(file),
        outputFormat: outputFormat.split('/')[1].toUpperCase(),
        inputSize: file.size,
        outputSize: convertedBlob.size,
        blob: convertedBlob,
        previewUrl: URL.createObjectURL(convertedBlob),
        originalPreviewUrl: originalPreview,
      });

      showToast('Image converted successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Conversion failed';
      showToast(msg, 'error');
    } finally {
      setConverting(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.previewUrl;
    const ext = outputFormat.split('/')[1].replace('jpeg', 'jpg');
    a.download = `converted-${Date.now()}.${ext}`;
    a.click();
    showToast('Downloaded converted image', 'success');
  }

  function handleReset() {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setFile(null);
    setResult(null);
    setOriginalPreview('');
    setOutputFormat('image/png');
    setQuality(90);
  }

  const isLossy = outputFormat === 'image/jpeg' || outputFormat === 'image/webp';

  return (
    <ToolWorkspace>
      {!file ? (
        <FileDropZone
          onFiles={handleFiles}
          accept="image/*"
          label="Click to upload or drag and drop your image"
          hint="JPG, PNG, WebP, GIF, BMP · Max 50MB"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Original ({detectFormat(file)} · {formatBytes(file.size)})
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
                  Converted ({result.outputFormat} · {formatBytes(result.outputSize)})
                </p>
                <img
                  src={result.previewUrl}
                  alt="Converted"
                  className="max-h-48 w-full rounded-lg object-contain"
                />
              </div>
            )}
          </div>

          <Field label="Output format" htmlFor="output-format">
            <Select
              id="output-format"
              value={outputFormat}
              onChange={setOutputFormat}
              options={[
                { value: 'image/png', label: 'PNG — Lossless with transparency' },
                { value: 'image/jpeg', label: 'JPG — Best for photos' },
                { value: 'image/webp', label: 'WebP — Smallest size, modern' },
              ]}
            />
          </Field>

          {isLossy && (
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
          )}

          {result && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                <InfoRow label="From" value={result.inputFormat} />
                <InfoRow label="To" value={result.outputFormat} />
                <InfoRow label="Original size" value={formatBytes(result.inputSize)} />
                <InfoRow
                  label="Converted size"
                  value={
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatBytes(result.outputSize)}
                    </span>
                  }
                />
              </div>
            </div>
          )}

          <ToolActions>
            <button
              onClick={handleConvert}
              disabled={converting}
              className="btn-primary"
            >
              <RefreshCw className="h-4 w-4" />
              {converting ? 'Converting...' : 'Convert Image'}
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

      {converting && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-primary-700 dark:text-primary-400">Converting image...</p>
        </div>
      )}
    </ToolWorkspace>
  );
}