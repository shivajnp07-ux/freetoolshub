import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; classes: string }> = {
  success: { icon: CheckCircle, classes: 'border-success-500/30 bg-success-50 dark:bg-success-500/10' },
  error: { icon: AlertCircle, classes: 'border-error-500/30 bg-error-50 dark:bg-error-500/10' },
  info: { icon: Info, classes: 'border-primary-500/30 bg-primary-50 dark:bg-primary-500/10' },
};

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card-hover animate-slide-up ${config.classes}`}
          >
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {toast.message}
            </p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 rounded-md p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
