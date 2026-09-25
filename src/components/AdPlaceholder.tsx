export function AdPlaceholder({
  label = 'Advertisement',
  format = 'horizontal',
  className = '',
}: {
  label?: string;
  format?: 'horizontal' | 'square' | 'vertical';
  className?: string;
}) {
  const sizeClasses = {
    horizontal: 'h-24 sm:h-28',
    square: 'h-64 sm:h-72',
    vertical: 'h-96',
  };

  return (
    <aside
      className={`flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 ${sizeClasses[format]} ${className}`}
      aria-label="Advertisement placeholder"
    >
      <div className="text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </span>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
          Ad space — not connected to any ad network
        </p>
      </div>
    </aside>
  );
}
