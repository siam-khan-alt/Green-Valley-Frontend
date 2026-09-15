export { PROFITABILITY_SIMULATE_ROLES, COST_CATEGORY_COLORS, COST_CATEGORY_LABELS } from "./constants";
export type { Profitability, CostBreakdownCategory, WorkPackageCost, SimulationInput, SimulationPoint, SimulationResult } from "./types";
export { useProfitability, useSimulateProfitability } from "./hooks/useProfitability";
export { ProfitabilitySimulator } from "./components/profitability-simulator";