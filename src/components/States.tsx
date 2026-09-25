export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  message,
  actionLabel,
  actionTo,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</p>}
      {actionLabel && actionTo && (
        <a href={actionTo} className="btn-primary mt-5">
          {actionLabel}
        </a>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-error-200 bg-error-50 py-16 text-center dark:border-error-500/20 dark:bg-error-500/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/20">
        <svg className="h-6 w-6 text-error-600 dark:text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Oops!</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-5">
          Try again
        </button>
      )}
    </div>
  );
}
