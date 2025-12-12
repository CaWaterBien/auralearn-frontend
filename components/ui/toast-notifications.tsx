'use client';

import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
              toast.type === 'error'
                ? 'bg-red-50 border-l-4 border-red-500'
                : toast.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-500'
                : toast.type === 'warning'
                ? 'bg-yellow-50 border-l-4 border-yellow-500'
                : 'bg-blue-50 border-l-4 border-blue-500'
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${
                toast.type === 'error'
                  ? 'text-red-800'
                  : toast.type === 'success'
                  ? 'text-green-800'
                  : toast.type === 'warning'
                  ? 'text-yellow-800'
                  : 'text-blue-800'
              }`}>
                {toast.title}
              </p>
              {toast.message && (
                <p className={`mt-1 text-sm ${
                  toast.type === 'error'
                    ? 'text-red-700'
                    : toast.type === 'success'
                    ? 'text-green-700'
                    : toast.type === 'warning'
                    ? 'text-yellow-700'
                    : 'text-blue-700'
                }`}>
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-4 inline-flex rounded-md p-1.5 hover:bg-opacity-20 ${
                toast.type === 'error'
                  ? 'text-red-500 hover:bg-red-500'
                  : toast.type === 'success'
                  ? 'text-green-500 hover:bg-green-500'
                  : toast.type === 'warning'
                  ? 'text-yellow-600 hover:bg-yellow-600'
                  : 'text-blue-500 hover:bg-blue-500'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
