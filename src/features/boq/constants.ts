import type { Role } from "@/features/auth";

export const BOQ_UNITS = [
  { value: "cum", label: "Cubic metre (cum)" },
  { value: "sft", label: "Square foot (sft)" },
  { value: "cft", label: "Cubic foot (cft)" },
  { value: "rft", label: "Running foot (rft)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ton", label: "Metric ton (ton)" },
  { value: "no", label: "Numbers (nos)" },
] as const;

export type BoqUnit = (typeof BOQ_UNITS)[number]["value"];

export const BOQ_WRITE_ROLES: Role[] = ["admin", "project_manager"];

export function boqItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate);
}