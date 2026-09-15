export interface PortfolioProjectRow {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: number;
  actual_cost: number;
  forecast_final_cost: number;
  expected_profit: number;
  progress_pct: number;
}

export interface PortfolioReport {
  total_budget: number;
  total_actual_cost: number;
  total_forecast_final_cost: number;
  total_expected_profit: number;
  projects: PortfolioProjectRow[];
}

export type ReportActivityType =
  | "purchase_order"
  | "ra_bill"
  | "measurement"
  | "expense"
  | "payment"
  | "variation";

export interface ProjectReportActivity {
  id: string;
  type: ReportActivityType;
  summary: string;
  amount: number;
  date: string;
  status: string;
}

export interface ProjectReportProgressPoint {
  date: string;
  percent_complete: number;
  cost: number;
}

export interface ProjectReport {
  cost_breakdown: { category: string; budget: number; actual: number }[];
  progress_series: ProjectReportProgressPoint[];
  recent_activity: ProjectReportActivity[];
}