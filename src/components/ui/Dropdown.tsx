"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DropdownItem = {
  label?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onSelect?: () => void;
};

export function Dropdown({
  trigger,
  items,
  align = "start",
  label,
}: {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <span
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex"
      >
        {trigger}
      </span>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "absolute z-40 mt-1.5 min-w-[180px] rounded-md border border-border bg-surface py-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 border-t border-border" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                  item.onSelect?.();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors",
                  "hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50",
                  item.danger ? "text-danger" : "text-text",
                )}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}