import { Badge } from "@/components/ui";
import { PO_STATUS } from "../constants";
import type { PoStatus } from "../types";

export function PurchaseOrderStatusBadge({ status }: { status: PoStatus }) {
  const meta = PO_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}