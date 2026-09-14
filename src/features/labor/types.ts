export type LaborType =
  | "mason"
  | "bar_binder"
  | "carpenter"
  | "helper"
  | "electrician"
  | "plumber"
  | "painter"
  | "steel_fixer"
  | "other";

export interface MusterEntry {
  id: string;
  project_id: string;
  work_package: string;
  date: string;
  labor_type: LaborType;
  head_count: number;
  hours_worked: number;
  rate: number;
  amount: number;
}

export type MusterPayload = Omit<MusterEntry, "id" | "project_id" | "amount">;