import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { MeasurementStatus, RaBillStatus } from "./types";

export const MEASUREMENT_STATUS: Record<
  MeasurementStatus,
  { label: string; badge: BadgeVariant }
> = {
  draft: { label: "Draft", badge: "neutral" },
  verified: { label: "Verified", badge: "info" },
  approved: { label: "Approved", badge: "success" },
};

export const MEASUREMENT_STATUS_OPTIONS = Object.entries(MEASUREMENT_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const RA_BILL_STATUS: Record<
  RaBillStatus,
  { label: string; badge: BadgeVariant }
> = {
  draft: { label: "Draft", badge: "neutral" },
  submitted: { label: "Submitted", badge: "warning" },
  approved: { label: "Approved", badge: "success" },
};

export const RA_BILL_STATUS_OPTIONS = Object.entries(RA_BILL_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const MEASUREMENT_WRITE_ROLES: Role[] = ["admin", "project_manager", "site_staff"];
export const MEASUREMENT_VERIFY_ROLES: Role[] = ["admin", "project_manager"];
export const RA_BILL_WRITE_ROLES: Role[] = ["admin", "project_manager", "finance"];
export const RA_BILL_APPROVE_ROLES: Role[] = ["admin", "project_manager"];