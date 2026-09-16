"use client";

import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export type FieldError = string | string[] | undefined;

function resolveError(error: FieldError): string | undefined {
  if (!error) return undefined;
  return Array.isArray(error) ? error[0] : error;
}

function FieldLabel({
  id,
  label,
  required,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
}) {
  if (!label) return null;
  return (
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-text"
    >
      {label}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  );
}

function FieldHint({ message }: { message?: ReactNode }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-text-muted">{message}</p>;
}

function FieldErrorMessage({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-sm text-danger">
      <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {error}
    </p>
  );
}

export type InputProps = ComponentProps<"input"> & {
  label?: ReactNode;
  error?: FieldError;
  hint?: ReactNode;
  required?: boolean;
};

export function Input({
  id,
  label,
  error,
  hint,
  required,
  className,
  ...props
}: InputProps) {
  const autoId = useId();
  const errorMessage = resolveError(error);
  const fieldId = id ?? autoId;
  return (
    <div className="flex w-full flex-col">
      <FieldLabel id={fieldId} label={label} required={required} />
      <input
        id={fieldId}
        required={required}
        aria-invalid={!!errorMessage}
        className={cn(
          "h-10 w-full rounded-md border bg-surface px-3 text-sm text-text placeholder:text-text-muted",
          "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          errorMessage ? "border-danger" : "border-border hover:border-border/80",
          className,
        )}
        {...props}
      />
      <FieldErrorMessage error={errorMessage} />
      <FieldHint message={hint} />
    </div>
  );
}

export type TextareaProps = ComponentProps<"textarea"> & {
  label?: ReactNode;
  error?: FieldError;
  hint?: ReactNode;
  required?: boolean;
};

export function Textarea({
  id,
  label,
  error,
  hint,
  required,
  className,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const errorMessage = resolveError(error);
  const fieldId = id ?? autoId;
  return (
    <div className="flex w-full flex-col">
      <FieldLabel id={fieldId} label={label} required={required} />
      <textarea
        id={fieldId}
        required={required}
        aria-invalid={!!errorMessage}
        className={cn(
          "w-full min-h-[96px] rounded-md border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted",
          "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          errorMessage ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
      <FieldErrorMessage error={errorMessage} />
      <FieldHint message={hint} />
    </div>
  );
}

export type SelectProps = ComponentProps<"select"> & {
  label?: ReactNode;
  error?: FieldError;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
};

export function Select({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
  ...props
}: SelectProps) {
  const autoId = useId();
  const errorMessage = resolveError(error);
  const fieldId = id ?? autoId;
  return (
    <div className="flex w-full flex-col">
      <FieldLabel id={fieldId} label={label} required={required} />
      <div className="relative">
        <select
          id={fieldId}
          required={required}
          aria-invalid={!!errorMessage}
          className={cn(
            "h-10 w-full appearance-none rounded-md border bg-surface pl-3 pr-9 text-sm text-text",
            "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            errorMessage ? "border-danger" : "border-border",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="m19 9-7 7-7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <FieldErrorMessage error={errorMessage} />
      <FieldHint message={hint} />
    </div>
  );
}