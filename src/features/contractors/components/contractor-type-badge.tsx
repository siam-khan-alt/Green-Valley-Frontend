import { Badge } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui/Badge";
import type { ContractorType } from "../types";

const TYPE_STYLES: Record<ContractorType, { label: string; variant: BadgeVariant }> = {
  contractor: { label: "Contractor", variant: "primary" },
  subcontractor: { label: "Subcontractor", variant: "info" },
};

export function ContractorTypeBadge({ type }: { type: ContractorType }) {
  const style = TYPE_STYLES[type];
  return <Badge variant={style.variant}>{style.label}</Badge>;
}