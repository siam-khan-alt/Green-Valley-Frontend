import { Badge } from "@/components/ui";
import { INDENT_STATUS } from "../constants";
import type { IndentStatus } from "../types";

export function IndentStatusBadge({ status }: { status: IndentStatus }) {
  const meta = INDENT_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}