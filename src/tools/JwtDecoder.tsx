import { useState } from 'react';
import { KeyRound, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  ToolWorkspace,
  ToolActions,
  ToolResult,
  ToolResultHeader,
  Field,
  TextArea,
  CopyButton,
  ClearButton,
  InfoRow,
} from '@/components/tool/ToolParts';
import { useToast } from '@/context/ToastContext';

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
}

interface JwtInfo {
  algorithm: string;
  tokenType: string;
  issuer?: string;
  subject?: string;
  expiry?: string;
  issuedAt?: string;
  expired: boolean;
  expiresIn?: string;
}

/**
 * Decode a Base64URL-encoded string with UTF-8 support.
 */
function decodeBase64Url(str: string): string {
  // Replace URL-safe characters
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

function formatTimestamp(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString();
}

function formatExpiresIn(exp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;
  if (diff < 0) return 'Expired';
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function JwtDecoder() {
  const { showToast } = useToast();
  const [token, setToken] = useState('');
  const [parts, setParts] = useState<JwtParts | null>(null);
  const [info, setInfo] = useState<JwtInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleDecode() {
    if (!token.trim()) {
      showToast('Please enter a JWT token', 'error');
      return;
    }

    const segments = token.trim().split('.');
    if (segments.length !== 3) {
      setError('Invalid JWT format — expected 3 dot-separated parts');
      setParts(null);
      setInfo(null);
      showToast('Invalid JWT format', 'error');
      return;
    }

    try {
      const headerStr = decodeBase64Url(segments[0]);
      const payloadStr = decodeBase64Url(segments[1]);
      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      setParts({
        header: formatJson(headerStr),
        payload: formatJson(payloadStr),
        signature: segments[2],
      });

      const now = Math.floor(Date.now() / 1000);
      const exp = payloadObj.exp as number | undefined;
      const iat = payloadObj.iat as number | undefined;

      setInfo({
        algorithm: headerObj.alg ?? 'unknown',
        tokenType: headerObj.typ ?? 'JWT',
        issuer: payloadObj.iss,
        subject: payloadObj.sub,
        expiry: exp ? formatTimestamp(exp) : undefined,
        issuedAt: iat ? formatTimestamp(iat) : undefined,
        expired: exp ? exp < now : false,
        expiresIn: exp ? formatExpiresIn(exp) : undefined,
      });

      setError(null);
      showToast('JWT decoded successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to decode JWT';
      setError(`Decode error: ${msg}`);
      setParts(null);
      setInfo(null);
      showToast('Failed to decode JWT', 'error');
    }
  }

  function handleClear() {
    setToken('');
    setParts(null);
    setInfo(null);
    setError(null);
  }

  return (
    <ToolWorkspace>
      <Field label="JWT Token" htmlFor="jwt-input">
        <TextArea
          id="jwt-input"
          value={token}
          onChange={setToken}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          rows={4}
          ariaLabel="JWT token input"
          mono
        />
      </Field>

      <ToolActions>
        <button onClick={handleDecode} className="btn-primary">
          <KeyRound className="h-4 w-4" /> Decode Token
        </button>
        <ClearButton onClick={handleClear} />
      </ToolActions>

      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 dark:bg-error-500/10">
          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-error-500" />
          <p className="text-sm text-error-700 dark:text-error-500">{error}</p>
        </div>
      )}

      <ToolResult visible={!!parts}>
        {parts && (
          <>
            <div className="space-y-4">
              <div>
                <ToolResultHeader label="Header">
                  <CopyButton text={parts.header} />
                </ToolResultHeader>
                <pre className="max-h-40 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 scrollbar-thin">
                  <code className="font-mono text-gray-800 dark:text-gray-200">
                    {parts.header}
                  </code>
                </pre>
              </div>

              <div>
                <ToolResultHeader label="Payload">
                  <CopyButton text={parts.payload} />
                </ToolResultHeader>
                <pre className="max-h-60 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 scrollbar-thin">
                  <code className="font-mono text-gray-800 dark:text-gray-200">
                    {parts.payload}
                  </code>
                </pre>
              </div>

              <div>
                <ToolResultHeader label="Signature">
                  <CopyButton text={parts.signature} />
                </ToolResultHeader>
                <pre className="overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 scrollbar-thin">
                  <code className="font-mono text-gray-800 dark:text-gray-200 break-all">
                    {parts.signature}
                  </code>
                </pre>
              </div>
            </div>

            {info && (
              <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4" /> Token Information
                </p>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  <InfoRow label="Algorithm" value={info.algorithm} mono />
                  <InfoRow label="Token type" value={info.tokenType} />
                  {info.issuer && <InfoRow label="Issuer" value={info.issuer} />}
                  {info.subject && <InfoRow label="Subject" value={info.subject} />}
                  {info.issuedAt && <InfoRow label="Issued at" value={info.issuedAt} />}
                  {info.expiry && (
                    <InfoRow
                      label="Expiry"
                      value={
                        <span className="flex flex-wrap items-center gap-1.5">
                          {info.expiry}
                          {info.expired ? (
                            <span className="badge-base bg-error-100 text-error-600 dark:bg-error-500/20 dark:text-error-500">
                              <XCircle className="h-3 w-3" /> Expired
                            </span>
                          ) : (
                            <span className="badge-base bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-500">
                              <CheckCircle className="h-3 w-3" /> Active
                              {info.expiresIn && ` · ${info.expiresIn}`}
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                </div>
              </div>
            )}

            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              Note: This tool decodes JWT header and payload only. Signature verification
              requires the secret/public key and is not performed.
            </p>
          </>
        )}
      </ToolResult>
    </ToolWorkspace>
  );
}