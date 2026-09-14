import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { ProjectStatus, ProjectType } from "./types";

export const PROJECT_TYPES: Record<
  ProjectType,
  { label: string; badge: BadgeVariant }
> = {
  residential: { label: "Residential", badge: "info" },
  commercial: { label: "Commercial", badge: "primary" },
  mixed_use: { label: "Mixed-use", badge: "info" },
  infrastructure: { label: "Infrastructure", badge: "neutral" },
};

export const PROJECT_STATUS: Record<
  ProjectStatus,
  { label: string; badge: BadgeVariant }
> = {
  planning: { label: "Planning", badge: "neutral" },
  active: { label: "Active", badge: "success" },
  delayed: { label: "Delayed", badge: "warning" },
  completed: { label: "Completed", badge: "primary" },
};

export const PROJECT_TYPE_OPTIONS = Object.entries(PROJECT_TYPES).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const PROJECT_STATUS_OPTIONS = Object.entries(PROJECT_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const PROJECT_WRITE_ROLES: Role[] = ["admin", "project_manager"];