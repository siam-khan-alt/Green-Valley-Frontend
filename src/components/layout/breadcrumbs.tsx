"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChevronRight } from "./icons";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "ui-kit": "UI Kit",
  login: "Login",
  projects: "Projects",
  schedule: "Schedule",
  "work-packages": "Work Packages",
  procurement: "Procurement",
  billing: "Billing",
  reports: "Reports",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        href="/dashboard"
        className="font-medium text-text-muted transition-colors hover:text-text"
      >
        Home
      </Link>
      {segments.map((segment, index) => {
        const label = SEGMENT_LABELS[segment] ?? segment;
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        return (
          <span key={href} className="flex items-center gap-1">
            <IconChevronRight className="text-text-muted/60" />
            {isLast ? (
              <span className="font-semibold capitalize text-text">{label}</span>
            ) : (
              <Link href={href} className="font-medium capitalize text-text-muted transition-colors hover:text-text">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}