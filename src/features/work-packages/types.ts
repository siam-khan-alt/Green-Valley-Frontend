export type WorkPackageStatus =
  | "not_started"
  | "in_progress"
  | "on_hold"
  | "completed";

export interface WorkPackage {
  id: string;
  project_id: string;
  code: string;
  name: string;
  description: string;
  planned_start: string;
  planned_end: string;
  contractor: string;
  status: WorkPackageStatus;
}

export type WorkPackagePayload = Omit<WorkPackage, "id" | "project_id">;

export interface WorkPackageSummary {
  id: string;
  boq_scope: number;
  measured_quantity: number;
  progress_pct: number;
  labor_cost: number;
  po_cost: number;
  ra_bill_value: number;
}