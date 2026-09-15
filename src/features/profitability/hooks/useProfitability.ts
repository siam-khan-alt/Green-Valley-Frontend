"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SimulationInput } from "../types";
import { profitabilityApi } from "../services/profitability.api";

function profitabilityKey(projectId: string) {
  return ["profitability", projectId] as const;
}

export function useProfitability(projectId: string) {
  return useQuery({
    queryKey: profitabilityKey(projectId),
    queryFn: () => profitabilityApi.getProfitability(projectId),
    enabled: !!projectId,
  });
}

export function useSimulateProfitability(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: SimulationInput) =>
      profitabilityApi.simulate(projectId, input),
    onSuccess: () => void client.invalidateQueries({ queryKey: profitabilityKey(projectId) }),
  });
}