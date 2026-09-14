import type { Role } from "@/features/auth";
import type { LaborType } from "./types";

export const LABOR_TYPES: Array<{ value: LaborType; label: string }> = [
  { value: "mason", label: "Mason" },
  { value: "bar_binder", label: "Bar binder" },
  { value: "carpenter", label: "Carpenter" },
  { value: "helper", label: "Helper / shohoi" },
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "painter", label: "Painter" },
  { value: "steel_fixer", label: "Steel fixer" },
  { value: "other", label: "General worker" },
];

export const LABOR_TYPE_OPTIONS = LABOR_TYPES.map((item) => ({
  value: item.value,
  label: item.label,
}));

export const DEFAULT_LABOR_RATES: Record<LaborType, number> = {
  mason: 120,
  bar_binder: 110,
  carpenter: 120,
  helper: 90,
  electrician: 130,
  plumber: 130,
  painter: 110,
  steel_fixer: 135,
  other: 95,
};

export const LABOR_WRITE_ROLES: Role[] = ["admin", "project_manager", "site_staff"];

export function musterAmount(
  headCount: number,
  hoursWorked: number,
  rate: number
): number {
  return Math.round(headCount * hoursWorked * rate);
}