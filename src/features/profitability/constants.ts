import type { Role } from "@/features/auth";

export const PROFITABILITY_SIMULATE_ROLES: Role[] = [
  "admin",
  "project_manager",
  "finance",
];

export const COST_CATEGORY_COLORS: Record<string, string> = {
  materials: "#2f9e44",
  labor: "#1971c2",
  contractor: "#e8590c",
  overhead: "#6741d9",
  other: "#868e96",
};

export const COST_CATEGORY_LABELS: Record<string, string> = {
  materials: "Materials",
  labor: "Labor",
  contractor: "Contractor",
  overhead: "Overhead",
  other: "Other",
};