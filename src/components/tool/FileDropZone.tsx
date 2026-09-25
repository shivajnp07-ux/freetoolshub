import { useCallback, useRef, useState, type ReactNode } from 'react';
import { UploadCloud } from 'lucide-react';

export interface UploadedFile {
  id: string;
  file: File;
}

export function FileDropZone({
  onFiles,
  accept = '*',
  multiple = false,
  label = 'Click to upload or drag and drop',
  hint,
  children,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  children?: ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFiles(multiple ? files : [files[0]]);
      }
    },
    [onFiles, multiple]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={label}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
          : 'border-gray-300 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-600'
      }`}
    >
      <UploadCloud className="h-10 w-10 text-gray-400" />
      <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      {children}
    </div>
  );
}
