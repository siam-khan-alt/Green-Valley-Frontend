import type { Role } from "@/features/auth";

export const PROFITABILITY_SIMULATE_ROLES: Role[] = [
  "admin",
  "project_manager",
  "finance",
];

export const COST_CATEGORY_COLORS: Record<string, string> = {
  materials: "var(--chart-1)",
  labor: "var(--chart-2)",
  contractor: "var(--chart-3)",
  overhead: "var(--chart-4)",
  other: "var(--chart-5)",
};

export const COST_CATEGORY_LABELS: Record<string, string> = {
  materials: "Materials",
  labor: "Labor",
  contractor: "Contractor",
  overhead: "Overhead",
  other: "Other",
};