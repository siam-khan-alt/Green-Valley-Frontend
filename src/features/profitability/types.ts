export interface CostBreakdownCategory {
  category: string;
  budget: number;
  actual: number;
}

export interface WorkPackageCost {
  id: string;
  progress_pct: number;
  labor_cost: number;
  po_cost: number;
  ra_bill_value: number;
}

export interface Profitability {
  budget: number;
  actual_cost: number;
  forecast_final_cost: number;
  expected_profit: number;
  budget_variance: number;
  cost_breakdown: CostBreakdownCategory[];
  work_packages: WorkPackageCost[];
}

export interface SimulationInput {
  material_price_change_pct?: number | null;
  delay_days?: number | null;
  extra_variation_cost?: number | null;
}

export interface SimulationPoint {
  forecast_final_cost: number;
  expected_profit: number;
}

export interface SimulationResult {
  baseline: SimulationPoint;
  simulated: SimulationPoint;
  delta: { cost_change: number; profit_change: number };
}