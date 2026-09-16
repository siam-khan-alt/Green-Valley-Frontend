import type { BadgeVariant } from "@/components/ui";
import type { AuditTargetType } from "./types";

export const AUDIT_TARGET_OPTIONS: { value: AuditTargetType; label: string }[] = [
  { value: "project", label: "Project" },
  { value: "schedule", label: "Schedule" },
  { value: "work_package", label: "Work package" },
  { value: "boq", label: "BOQ" },
  { value: "purchase_order", label: "Purchase order" },
  { value: "measurement", label: "Measurement" },
  { value: "ra_bill", label: "RA bill" },
  { value: "variation", label: "Variation" },
  { value: "expense", label: "Expense" },
  { value: "payment", label: "Payment" },
  { value: "user", label: "User" },
  { value: "material", label: "Material" },
  { value: "supplier", label: "Supplier" },
  { value: "contractor", label: "Contractor" },
];

export const AUDIT_TARGET_BADGE: Record<AuditTargetType, BadgeVariant> = {
  project: "primary",
  schedule: "info",
  work_package: "info",
  boq: "neutral",
  purchase_order: "info",
  measurement: "neutral",
  ra_bill: "primary",
  variation: "danger",
  expense: "warning",
  payment: "success",
  user: "neutral",
  material: "info",
  supplier: "neutral",
  contractor: "neutral",
};