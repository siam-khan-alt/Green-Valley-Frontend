import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { VariationStatus } from "./types";

export const VARIATION_STATUS: Record<
  VariationStatus,
  { label: string; badge: BadgeVariant }
> = {
  proposed: { label: "Proposed", badge: "warning" },
  approved: { label: "Approved", badge: "success" },
  rejected: { label: "Rejected", badge: "danger" },
};

export const VARIATION_STATUS_OPTIONS = Object.entries(VARIATION_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const VARIATION_WRITE_ROLES: Role[] = ["admin", "project_manager"];
export const VARIATION_APPROVE_ROLES: Role[] = ["admin", "project_manager"];