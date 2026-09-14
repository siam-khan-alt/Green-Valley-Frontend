import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { WorkPackageStatus } from "./types";

export const WP_STATUS: Record<
  WorkPackageStatus,
  { label: string; badge: BadgeVariant }
> = {
  not_started: { label: "Not started", badge: "neutral" },
  in_progress: { label: "In progress", badge: "info" },
  on_hold: { label: "On hold", badge: "warning" },
  completed: { label: "Completed", badge: "success" },
};

export const WP_STATUS_OPTIONS = Object.entries(WP_STATUS).map(
  ([value, meta]) => ({ value, label: meta.label })
);

export const WP_WRITE_ROLES: Role[] = ["admin", "project_manager"];