import { api } from "@/services";
import type { Profitability, SimulationInput, SimulationResult } from "../types";

export const profitabilityApi = {
  getProfitability: (projectId: string) =>
    api.get<Profitability>(`/projects/${projectId}/profitability`),
  simulate: (projectId: string, input: SimulationInput) =>
    api.post<SimulationResult>(`/projects/${projectId}/profitability/simulate`, input),
};