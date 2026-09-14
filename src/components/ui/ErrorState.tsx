import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ErrorState({
  title = "Something went wrong",
  description,
  retry,
  className,
}: {
  title?: string;
  description?: string;
  retry?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger/5 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-danger/10">
        <svg
          className="size-6 text-danger"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {retry && <div className="mt-4">{retry}</div>}
    </div>
  );
}