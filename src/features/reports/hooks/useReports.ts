"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../services/reports.api";

export function usePortfolioReport() {
  return useQuery({
    queryKey: ["reports", "portfolio"] as const,
    queryFn: () => reportsApi.portfolio(),
  });
}

export function useProjectReport(projectId: string) {
  return useQuery({
    queryKey: ["reports", projectId] as const,
    queryFn: () => reportsApi.project(projectId),
    enabled: !!projectId,
  });
}