import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { InspectionType, InspectionStatus } from "./types";

export const INSPECTION_TYPES: { value: InspectionType; label: string }[] = [
  { value: "foundation", label: "Foundation" },
  { value: "concrete", label: "Concrete" },
  { value: "rebar", label: "Rebar" },
  { value: "waterproofing", label: "Waterproofing" },
  { value: "masonry", label: "Masonry" },
  { value: "structural", label: "Structural" },
  { value: "mep", label: "MEP" },
  { value: "finishing", label: "Finishing" },
  { value: "final", label: "Final" },
];

export const INSPECTION_STATUS: Record<
  InspectionStatus,
  { label: string; badge: BadgeVariant }
> = {
  requested: { label: "Requested", badge: "info" },
  scheduled: { label: "Scheduled", badge: "warning" },
  passed: { label: "Passed", badge: "success" },
  rejected: { label: "Rejected", badge: "danger" },
  cancelled: { label: "Cancelled", badge: "neutral" },
};

export const INSPECTION_STATUS_OPTIONS = Object.entries(INSPECTION_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const INSPECTION_WRITE_ROLES: Role[] = ["admin", "project_manager", "site_staff"];
export const INSPECTION_APPROVE_ROLES: Role[] = ["admin", "project_manager"];