import { Badge } from "@/components/ui";
import { MILESTONE_STATUS } from "../constants";
import type { MilestoneStatus } from "../types";

export function MilestoneStatusBadge({ status }: { status: MilestoneStatus }) {
  const meta = MILESTONE_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}