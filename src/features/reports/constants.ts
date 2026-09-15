import type { BadgeVariant } from "@/components/ui";
import type { ReportActivityType } from "./types";

export const ACTIVITY_TYPE_META: Record<
  ReportActivityType,
  { label: string; badge: BadgeVariant }
> = {
  purchase_order: { label: "PO", badge: "info" },
  ra_bill: { label: "RA bill", badge: "primary" },
  measurement: { label: "Measurement", badge: "neutral" },
  expense: { label: "Expense", badge: "warning" },
  payment: { label: "Payment", badge: "success" },
  variation: { label: "Variation", badge: "danger" },
};