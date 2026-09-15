import type { BadgeVariant } from "@/components/ui";
import { Badge } from "@/components/ui";
import { VARIATION_STATUS } from "../constants";
import type { VariationStatus } from "../types";

export function VariationStatusBadge({ status }: { status: VariationStatus }) {
  const meta = VARIATION_STATUS[status] ?? { label: status, badge: "neutral" as BadgeVariant };
  return <Badge variant={meta.badge}>{meta.label}</Badge>;
}