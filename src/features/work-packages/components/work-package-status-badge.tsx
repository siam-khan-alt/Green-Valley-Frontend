import { Badge } from "@/components/ui";
import { WP_STATUS } from "../constants";
import type { WorkPackageStatus } from "../types";

export function WorkPackageStatusBadge({ status }: { status: WorkPackageStatus }) {
  const meta = WP_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}