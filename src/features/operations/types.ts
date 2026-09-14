export type DprWeather = "sunny" | "cloudy" | "rainy" | "hot" | "humid";

export interface DprLaborEntry {
  labor_type: string;
  head_count: number;
  hours_worked: number;
  rate: number;
}

export interface DprMachineryEntry {
  machinery_id: string;
  machinery_name: string;
  hours_used: number;
  rate: number;
}

export interface DailyProgressReport {
  id: string;
  project_id: string;
  work_package_id: string;
  work_package_code: string;
  work_package_name: string;
  date: string;
  weather: DprWeather;
  work_done: string;
  quantity_achieved: number;
  labor_entries: DprLaborEntry[];
  machinery_entries: DprMachineryEntry[];
  notes: string;
  created_by: string;
  created_at: string;
}

export interface ProgressReport {
  date: string;
  percent_complete: number;
  notes?: string;
}

export type DprPayload = Pick<
  DailyProgressReport,
  | "work_package_id"
  | "date"
  | "weather"
  | "work_done"
  | "quantity_achieved"
  | "labor_entries"
  | "machinery_entries"
  | "notes"
>;