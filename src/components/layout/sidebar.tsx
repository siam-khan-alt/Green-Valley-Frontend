"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  ACTIVE_PROJECT_KEY,
  NAV_GROUPS,
  ORG_NAME,
  ORG_SUBTITLE,
  resolveHref,
} from "./nav";
import { NavIcon } from "./icons";

function subscribeToActiveProject(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getActiveProjectSnapshot(): string | null {
  return window.localStorage.getItem(ACTIVE_PROJECT_KEY);
}

function getActiveProjectServerSnapshot(): string | null {
  return null;
}

function OrgMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
      GV
    </span>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const storedProjectId = useSyncExternalStore(
    subscribeToActiveProject,
    getActiveProjectSnapshot,
    getActiveProjectServerSnapshot,
  );
  const pathProjectId = pathname.match(/^\/projects\/([^/]+)/)?.[1] ?? null;

  useEffect(() => {
    if (pathProjectId) window.localStorage.setItem(ACTIVE_PROJECT_KEY, pathProjectId);
  }, [pathProjectId]);

  const activeProjectId = pathProjectId ?? storedProjectId;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
        <OrgMark />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{ORG_NAME}</p>
          <p className="truncate text-xs text-text-muted">{ORG_SUBTITLE}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const href = resolveHref(item, activeProjectId);
                const active =
                  pathname === href ||
                  item.match?.includes(pathname) ||
                  (href !== "/" && pathname.startsWith(`${href}/`));
                return (
                  <li key={item.id}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-soft text-primary"
                          : "text-text-muted hover:bg-surface-muted hover:text-text",
                      )}
                    >
                      {item.icon && <NavIcon name={item.icon} className={active ? "text-primary" : undefined} />}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="text-xs text-text-muted">BuildControl v0.1 · single org</p>
      </div>
    </div>
  );
}