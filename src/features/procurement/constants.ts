import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { IndentStatus, PoStatus } from "./types";

export const INDENT_STATUS: Record<
  IndentStatus,
  { label: string; badge: BadgeVariant }
> = {
  drafted: { label: "Drafted", badge: "neutral" },
  submitted: { label: "Submitted", badge: "info" },
  approved: { label: "Approved", badge: "success" },
  rejected: { label: "Rejected", badge: "danger" },
  ordered: { label: "Ordered", badge: "primary" },
};

export const INDENT_STATUS_OPTIONS = Object.entries(INDENT_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const PO_STATUS: Record<
  PoStatus,
  { label: string; badge: BadgeVariant }
> = {
  issued: { label: "Issued", badge: "info" },
  partially_received: { label: "Partially received", badge: "warning" },
  received: { label: "Received", badge: "success" },
  closed: { label: "Closed", badge: "neutral" },
};

export const PO_STATUS_OPTIONS = Object.entries(PO_STATUS).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export const PROCUREMENT_WRITE_ROLES: Role[] = ["admin", "project_manager"];