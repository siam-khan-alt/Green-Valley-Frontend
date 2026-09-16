"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

export type TabItem = {
  value: string;
  label: ReactNode;
  badge?: number;
  disabled?: boolean;
};

export function Tabs({
  tabs,
  defaultValue,
  value,
  onChange,
  children,
  className,
}: {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: (activeValue: string) => ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.value ?? "");
  const activeValue = value ?? internal;
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();

  function select(next: string) {
    setInternal(next);
    onChange?.(next);
  }

  function onTabListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const idx = tabs.findIndex((t) => t.value === activeValue && !t.disabled);
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const step = e.key === "ArrowRight" ? 1 : -1;
      for (let i = 0; i < tabs.length; i++) {
        next = (next + step + tabs.length) % tabs.length;
        const candidate = tabs[next];
        if (!candidate?.disabled) {
          tabButtons.current[next]?.focus();
          select(candidate.value);
          return;
        }
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = tabs.findIndex((t) => !t.disabled);
      if (first >= 0) {
        tabButtons.current[first]?.focus();
        select(tabs[first].value);
      }
    } else if (e.key === "End") {
      e.preventDefault();
      const last = [...tabs].reverse().findIndex((t) => !t.disabled);
      if (last >= 0) {
        const real = tabs.length - 1 - last;
        tabButtons.current[real]?.focus();
        select(tabs[real].value);
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        id={listId}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onTabListKeyDown}
        className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-1"
      >
        {tabs.map((tab, i) => {
          const active = tab.value === activeValue;
          const tabId = `${listId}-tab-${tab.value}`;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                tabButtons.current[i] = el;
              }}
              role="tab"
              type="button"
              id={tabId}
              aria-selected={active}
              aria-controls={`${listId}-panel-${tab.value}`}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => select(tab.value)}
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-muted hover:text-text",
              )}
            >
              {tab.label}
              {typeof tab.badge === "number" && (
                <Badge variant={active ? "primary" : "neutral"}>{tab.badge}</Badge>
              )}
            </button>
          );
        })}
      </div>
      <div
        id={`${listId}-panel-${activeValue}`}
        role="tabpanel"
        aria-labelledby={`${listId}-tab-${activeValue}`}
      >
        {children(activeValue)}
      </div>
    </div>
  );
}