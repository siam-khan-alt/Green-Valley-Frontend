export type ProjectType =
  | "residential"
  | "commercial"
  | "mixed_use"
  | "infrastructure";

export type ProjectStatus = "planning" | "active" | "delayed" | "completed";

export interface ProjectSummary {
  id: string;
  name: string;
  type: ProjectType;
  location: string;
  status: ProjectStatus;
  budget: number;
  actual_cost: number;
  forecast_final_cost: number;
  expected_profit: number;
  progress_pct: number;
}

export interface Project extends ProjectSummary {
  description: string;
  start_date: string;
  end_date: string;
  client: string;
  area_sqft: number;
  units: number;
}

export type ProjectPayload = Pick<
  Project,
  | "name"
  | "type"
  | "location"
  | "status"
  | "budget"
  | "start_date"
  | "end_date"
  | "description"
  | "client"
  | "area_sqft"
  | "units"
>;