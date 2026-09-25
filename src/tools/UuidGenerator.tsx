import { useState } from 'react';
import { Fingerprint, FileDown, Copy, Check } from 'lucide-react';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  Select,
  CopyButton,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

/**
 * Generate a proper UUID v4 using crypto.getRandomValues (RFC 4122).
 */
function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Set version (4) and variant (RFC 4122)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return (
    hex.slice(0, 4).join('') +
    '-' +
    hex.slice(4, 6).join('') +
    '-' +
    hex.slice(6, 8).join('') +
    '-' +
    hex.slice(8, 10).join('') +
    '-' +
    hex.slice(10, 16).join('')
  );
}

/**
 * Generate a proper UUID v1 (timestamp-based, RFC 4122).
 * 60-bit timestamp in 100-ns intervals since 1582-10-15.
 */
function generateUuidV1(): string {
  // Gregorian epoch offset: 100-ns intervals between 1582-10-15 and 1970-01-01
  const GREGORIAN_OFFSET = 122192928000000000n;
  const now = BigInt(Date.now()) * 10000n + GREGORIAN_OFFSET;

  // time_low (32 bits)
  const timeLow = Number(now & 0xffffffffn);
  // time_mid (16 bits)
  const timeMid = Number((now >> 32n) & 0xffffn);
  // time_hi_and_version (16 bits) with version 1
  const timeHi = Number((now >> 48n) & 0x0fffn) | 0x1000;

  // clock_seq (14 bits, random)
  const clockSeqBytes = new Uint8Array(2);
  crypto.getRandomValues(clockSeqBytes);
  const clockSeq = ((clockSeqBytes[0] << 8) | clockSeqBytes[1]) & 0x3fff;

  // node (48 bits, random, with multicast bit set to 0)
  const nodeBytes = new Uint8Array(6);
  crypto.getRandomValues(nodeBytes);
  nodeBytes[0] = (nodeBytes[0] & 0xfe) | 0x01; // set multicast bit
  const node = Array.from(nodeBytes, (b) => b.toString(16).padStart(2, '0')).join('');

  const pad = (n: number, len: number) => n.toString(16).padStart(len, '0');

  return `${pad(timeLow, 8)}-${pad(timeMid, 4)}-${pad(timeHi, 4)}-${pad(
    clockSeq,
    4
  )}-${node}`;
}

export function UuidGenerator() {
  const { showToast } = useToast();
  const [version, setVersion] = useState('v4');
  const [quantity, setQuantity] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  function handleGenerate() {
    const gen = version === 'v4' ? generateUuidV4 : generateUuidV1;
    const count = Math.min(Math.max(quantity, 1), 100);
    setUuids(Array.from({ length: count }, () => gen()));
    showToast(`Generated ${count} UUID${count > 1 ? 's' : ''}`, 'success');
  }

  async function handleCopyAll() {
    if (uuids.length === 0) return;
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    showToast('All UUIDs copied', 'success');
    setTimeout(() => setCopiedAll(false), 2000);
  }

  function handleDownload() {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uuids.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded uuids.txt', 'success');
  }

  return (
    <ToolWorkspace>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="UUID version" htmlFor="uuid-version">
          <Select
            id="uuid-version"
            value={version}
            onChange={setVersion}
            options={[
              { value: 'v4', label: 'UUID v4 — Random' },
              { value: 'v1', label: 'UUID v1 — Timestamp-based' },
            ]}
          />
        </Field>
        <Field label="Quantity" htmlFor="uuid-quantity" hint="1-100">
          <input
            id="uuid-quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input-base"
          />
        </Field>
      </div>

      <ToolActions>
        <button onClick={handleGenerate} className="btn-primary">
          <Fingerprint className="h-4 w-4" /> Generate UUIDs
        </button>
      </ToolActions>

      <ToolResult visible={uuids.length > 0}>
        <ToolResultHeader label={`${uuids.length} UUID${uuids.length > 1 ? 's' : ''} generated`}>
          <div className="flex gap-2">
            <button onClick={handleCopyAll} className="btn-secondary">
              {copiedAll ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
              {copiedAll ? 'Copied!' : 'Copy all'}
            </button>
            <button onClick={handleDownload} className="btn-secondary">
              <FileDown className="h-4 w-4" /> Download
            </button>
          </div>
        </ToolResultHeader>
        <div className="max-h-72 space-y-1 overflow-y-auto scrollbar-thin">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-gray-900"
            >
              <code className="font-mono text-sm text-gray-800 dark:text-gray-200">{uuid}</code>
              <CopyButton text={uuid} label="" className="!px-2 !py-1.5" />
            </div>
          ))}
        </div>
      </ToolResult>
    </ToolWorkspace>
  );
}