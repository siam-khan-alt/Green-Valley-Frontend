export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "delayed";

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  planned_date: string;
  actual_date: string | null;
  status: MilestoneStatus;
}

export type MilestonePayload = Pick<
  Milestone,
  "name" | "planned_date" | "actual_date" | "status"
>;