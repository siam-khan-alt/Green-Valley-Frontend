"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

const ToastContext = createContext<{
  toast: (options: ToastOptions) => void;
} | null>(null);

const toastStyles: Record<ToastVariant, { icon: string; accent: string }> = {
  success: { accent: "border-success/40", icon: "text-success" },
  error: { accent: "border-danger/40", icon: "text-danger" },
  warning: { accent: "border-warning/40", icon: "text-warning" },
  info: { accent: "border-info/40", icon: "text-info" },
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const color = toastStyles[variant].icon;
  return (
    <svg className={cn("size-5 shrink-0", color)} viewBox="0 0 24 24" fill="none" aria-hidden>
      {variant === "info" ? (
        <path d="M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info" }: ToastOptions) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2"
        role="region"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border-l-4 bg-surface px-4 py-3 shadow-lg",
              toastStyles[t.variant].accent,
            )}
          >
            <ToastIcon variant={t.variant} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-sm text-text-muted">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="cursor-pointer rounded-md p-1 text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx.toast;
}