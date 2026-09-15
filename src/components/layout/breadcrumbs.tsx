"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChevronRight } from "./icons";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "ui-kit": "UI Kit",
  login: "Login",
  projects: "Projects",
  materials: "Materials",
  suppliers: "Suppliers",
  contractors: "Contractors",
  schedule: "Schedule",
  "work-packages": "Work Packages",
  boq: "BOQ",
  procurement: "Procurement",
  labor: "Labor",
  machinery: "Machinery",
  billing: "Billing",
  variations: "Variations",
  expenses: "Expenses",
  reports: "Reports",
};

const ID_SEGMENT = /^[a-z]+_[a-z0-9_]+$/i;

function segmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? (ID_SEGMENT.test(segment) ? "Details" : segment);
}

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
        const label = segmentLabel(segment);
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