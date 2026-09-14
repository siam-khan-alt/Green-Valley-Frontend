"use client";

import { cn } from "@/lib/cn";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  className?: string;
}) {
  const pageWindow = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      {typeof totalItems === "number" && (
        <p className="text-sm text-text-muted">{totalItems.toLocaleString()} records</p>
      )}
      <div className="flex items-center gap-1">
        <PageButton
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          label="Previous page"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PageButton>

        {pageWindow.map((p, i) => {
          const gap = i > 0 && p - pageWindow[i - 1] > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {gap && <span className="px-1 text-sm text-text-muted">…</span>}
              <PageButton active={p === page} onClick={() => onPageChange(p)}>
                {p}
              </PageButton>
            </span>
          );
        })}

        <PageButton
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          label="Next page"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-primary text-primary-foreground"
          : "text-text hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}