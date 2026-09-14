import { Badge } from "@/components/ui";
import { PROJECT_TYPES } from "../constants";
import type { ProjectType } from "../types";

export function ProjectTypeBadge({ type }: { type: ProjectType }) {
  const meta = PROJECT_TYPES[type];
  return <Badge variant={meta.badge}>{meta.label}</Badge>;
}