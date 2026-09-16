"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type DropdownItem = {
  key?: string;
  label?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ids = useId();
  const controlId = `${ids}-ctrl`;
  const menuId = `${ids}-menu`;

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onDocKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKey);
    const first = itemRefs.current.find((el) => el && !el.disabled);
    first?.focus();
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKey);
      if (open) {
        const trigger = document.getElementById(controlId);
        trigger?.focus();
      }
    };
  }, [open, controlId]);

  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const current = itemRefs.current.indexOf(document.activeElement as HTMLButtonElement);
      const step = e.key === "ArrowDown" ? 1 : -1;
      let idx = current;
      for (let i = 0; i < itemRefs.current.length; i++) {
        idx = (idx + step + itemRefs.current.length) % itemRefs.current.length;
        const el = itemRefs.current[idx];
        if (el && !el.disabled) {
          el.focus();
          return;
        }
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      itemRefs.current.find((el) => el && !el.disabled)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      [...itemRefs.current].reverse().find((el) => el && !el.disabled)?.focus();
    }
  }

  const triggerEl = isValidElement(trigger)
    ? cloneElement(
        trigger as ReactElement<Record<string, unknown>>,
        {
        id: controlId,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
          onClick: () => setOpen((o) => !o),
        },
      )
    : trigger;

  return (
    <div ref={rootRef} className="relative inline-flex">
      {triggerEl}
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          className={cn(
            "absolute z-40 mt-1.5 min-w-[180px] rounded-md border border-border bg-surface py-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={item.key ?? `div-${i}`} className="my-1 border-t border-border" />
            ) : (
              <button
                key={item.key ?? i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center text-left text-sm transition-colors",
                  "px-3 py-2 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50",
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