import { Badge } from "@/components/ui";
import { INSPECTION_STATUS } from "../constants";
import type { InspectionStatus } from "../types";

export function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  const meta = INSPECTION_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}