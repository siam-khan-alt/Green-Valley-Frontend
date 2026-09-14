import { Badge } from "@/components/ui";
import { PROJECT_STATUS } from "../constants";
import type { ProjectStatus } from "../types";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const meta = PROJECT_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}