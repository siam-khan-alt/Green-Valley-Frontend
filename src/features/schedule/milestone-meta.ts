import type { Milestone, MilestoneStatus } from "./types";

const DAY_MS = 86_400_000;

const dotClasses: Record<MilestoneStatus, string> = {
  completed: "bg-success",
  in_progress: "bg-info",
  delayed: "bg-warning",
  not_started: "bg-text-muted/50",
};

export function milestoneDotClass(status: MilestoneStatus): string {
  return dotClasses[status];
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  if (Number.isNaN(from) || Number.isNaN(to)) return 0;
  return Math.round((to - from) / DAY_MS);
}

export interface OverdueInfo {
  days: number;
}

export function milestoneOverdue(
  milestone: Milestone,
  today: Date
): OverdueInfo | null {
  if (milestone.status === "completed" || milestone.actual_date) return null;
  const planned = new Date(milestone.planned_date).getTime();
  if (Number.isNaN(planned) || planned >= today.getTime()) return null;
  const days = Math.max(0, Math.round((today.getTime() - planned) / DAY_MS));
  return { days };
}

export function milestoneLateDays(milestone: Milestone): number | null {
  if (!milestone.actual_date) return null;
  return daysBetween(milestone.planned_date, milestone.actual_date);
}