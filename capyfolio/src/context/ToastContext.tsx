import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ToastContextType = {
  toastMessage: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3600);
  };

  const clearToast = () => setToastMessage(null);

  const value = useMemo<ToastContextType>(
    () => ({ toastMessage, showToast, clearToast }),
    [toastMessage],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
