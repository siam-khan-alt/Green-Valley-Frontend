"use client";

import { useState, type ReactNode } from "react";
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

  function select(next: string) {
    setInternal(next);
    onChange?.(next);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        role="tablist"
        className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-1"
      >
        {tabs.map((tab) => {
          const active = tab.value === activeValue;
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={active}
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
      {children(activeValue)}
    </div>
  );
}