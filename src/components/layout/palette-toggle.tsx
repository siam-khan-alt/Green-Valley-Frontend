"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Dropdown } from "@/components/ui";

const ACCENT_KEY = "gv_accent";
const ACCENT_EVENT = "gv-accentchange";

export const DEFAULT_ACCENT = "forest";

export type Accent = {
  id: string;
  label: string;
  primary: string;
  soft: string;
};

export const ACCENTS: Accent[] = [
  { id: "forest", label: "Deep Forest", primary: "#166534", soft: "#dce9dc" },
  { id: "sky", label: "Ocean Blue", primary: "#0369a1", soft: "#dbeafe" },
  { id: "violet", label: "Royal Purple", primary: "#6d28d9", soft: "#ede9fe" },
  { id: "amber", label: "Sunset Amber", primary: "#c2410c", soft: "#ffedd5" },
  { id: "slate", label: "Steel Slate", primary: "#334155", soft: "#e2e8f0" },
  { id: "rose", label: "Blossom Rose", primary: "#be123c", soft: "#ffe4e6" },
];

export function getStoredAccent(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  return window.localStorage.getItem(ACCENT_KEY) ?? DEFAULT_ACCENT;
}

/** Applies an accent to the whole app (light + dark) and notifies others. */
export function applyAccent(id: string) {
  document.documentElement.setAttribute("data-accent", id);
  window.localStorage.setItem(ACCENT_KEY, id);
  document.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: id }));
}

/** React binding — stays in sync across components (header toggle, UI kit…). */
export function useAccent(): [string, (id: string) => void] {
  const [accent, setAccent] = useState<string>(getStoredAccent);

  useEffect(() => {
    function onChange(e: Event) {
      setAccent((e as CustomEvent<string>).detail);
    }
    document.addEventListener(ACCENT_EVENT, onChange);
    return () => document.removeEventListener(ACCENT_EVENT, onChange);
  }, []);

  const apply = useCallback((id: string) => applyAccent(id), []);
  return [accent, apply];
}

export function AccentDot({ accented }: { accented: Accent }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span
        aria-hidden
        className="inline-block size-3 rounded-full border border-black/10"
        style={{ backgroundColor: accented.primary }}
      />
      <span
        aria-hidden
        className="inline-block size-3 rounded-full border border-black/10"
        style={{ backgroundColor: accented.soft }}
      />
    </span>
  );
}

export function PaletteToggle() {
  const [accent, apply] = useAccent();
  const current = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];

  return (
    <Dropdown
      label="Accent color"
      align="end"
      trigger={
        <Button variant="ghost" size="sm" aria-label="Accent color" title={`Accent: ${current.label}`}>
          <AccentDot accented={current} />
        </Button>
      }
      items={ACCENTS.map((a) => ({
        label: (
          <span className="flex items-center gap-2">
            <AccentDot accented={a} />
            <span className="text-sm text-text">{a.label}</span>
            {accent === a.id && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <span aria-hidden>✓</span> Active
              </span>
            )}
          </span>
        ),
        onClick: () => apply(a.id),
      }))}
    />
  );
}