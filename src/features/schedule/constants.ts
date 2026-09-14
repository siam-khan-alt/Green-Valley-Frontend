import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { MilestoneStatus } from "./types";

export const MILESTONE_STATUS: Record<
  MilestoneStatus,
  { label: string; badge: BadgeVariant }
> = {
  not_started: { label: "Not started", badge: "neutral" },
  in_progress: { label: "In progress", badge: "info" },
  completed: { label: "Completed", badge: "success" },
  delayed: { label: "Delayed", badge: "warning" },
};

export const MILESTONE_STATUS_OPTIONS = Object.entries(MILESTONE_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const SCHEDULE_WRITE_ROLES: Role[] = ["admin", "project_manager"];