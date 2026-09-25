import { useState, useEffect, useRef } from 'react';
import { QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  Select,
  ResetButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

const SIZE_OPTIONS = [
  { value: '256', label: 'Small (256px)' },
  { value: '512', label: 'Medium (512px)' },
  { value: '1024', label: 'Large (1024px)' },
];

const ERROR_CORRECTION = [
  { value: 'L', label: 'L — Low (7% recovery)' },
  { value: 'M', label: 'M — Medium (15% recovery)' },
  { value: 'Q', label: 'Q — Quartile (25% recovery)' },
  { value: 'H', label: 'H — High (30% recovery)' },
];

const FOREGROUND_COLORS = [
  { value: '#000000', label: 'Black (default)' },
  { value: '#1e3a8a', label: 'Blue' },
  { value: '#16a34a', label: 'Green' },
  { value: '#dc2626', label: 'Red' },
  { value: '#7c3aed', label: 'Purple' },
];

export function QrCodeGenerator() {
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [size, setSize] = useState('512');
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [color, setColor] = useState('#000000');
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-regenerate when settings change (if already generated)
  useEffect(() => {
    if (generated && text.trim() && canvasRef.current) {
      generateQr();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, errorCorrection, color, text]);

  async function generateQr() {
    if (!text.trim() || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: Number(size),
        margin: 2,
        errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H',
        color: {
          dark: color,
          light: '#ffffff',
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate QR code';
      showToast(msg, 'error');
    }
  }

  async function handleGenerate() {
    if (!text.trim()) {
      showToast('Please enter text or a URL to encode', 'error');
      return;
    }
    setGenerated(true);
    // Wait for canvas to mount
    setTimeout(() => generateQr(), 0);
    showToast('QR code generated', 'success');
  }

  function handleDownload() {
    if (!canvasRef.current || !generated) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qr-code-${Date.now()}.png`;
    a.click();
    showToast('QR code downloaded', 'success');
  }

  function handleReset() {
    setText('');
    setSize('512');
    setErrorCorrection('M');
    setColor('#000000');
    setGenerated(false);
  }

  return (
    <ToolWorkspace>
      <Field
        label="Text or URL"
        htmlFor="qr-input"
        hint="Encode URLs, plain text, email, phone, or WiFi credentials"
      >
        <textarea
          id="qr-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://freetoolshub.com"
          rows={3}
          className="input-base resize-none"
          aria-label="Text or URL to encode"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Size" htmlFor="qr-size">
          <Select id="qr-size" value={size} onChange={setSize} options={SIZE_OPTIONS} />
        </Field>
        <Field
          label="Error correction"
          htmlFor="qr-error"
          hint="Higher = more durable but denser"
        >
          <Select
            id="qr-error"
            value={errorCorrection}
            onChange={setErrorCorrection}
            options={ERROR_CORRECTION}
          />
        </Field>
        <Field label="Foreground color" htmlFor="qr-color">
          <Select
            id="qr-color"
            value={color}
            onChange={setColor}
            options={FOREGROUND_COLORS}
          />
        </Field>
      </div>

      <ToolActions>
        <button onClick={handleGenerate} className="btn-primary">
          <QrCode className="h-4 w-4" /> Generate QR Code
        </button>
        <ResetButton onClick={handleReset} />
      </ToolActions>

      <ToolResult visible={generated}>
        <ToolResultHeader
          label={`QR Code Preview — ${size}×${size}px · Error correction ${errorCorrection}`}
        >
          <button onClick={handleDownload} className="btn-primary">
            <Download className="h-4 w-4" /> Download PNG
          </button>
        </ToolResultHeader>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-3 dark:border-gray-700">
            <canvas
              ref={canvasRef}
              className="max-w-full"
              style={{ width: 'min(320px, 100%)', height: 'auto' }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Scannable QR code — scan with any phone camera
          </p>
        </div>
      </ToolResult>
    </ToolWorkspace>
  );
}