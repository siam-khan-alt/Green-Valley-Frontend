import type { Role } from "@/features/auth";

export const MACHINE_TYPES: Array<{ value: string; label: string }> = [
  { value: "excavator", label: "Excavator" },
  { value: "crane", label: "Crane" },
  { value: "concrete_pump", label: "Concrete pump" },
  { value: "transit_mixer", label: "Transit mixer" },
  { value: "vibrating_roller", label: "Vibrating roller" },
  { value: "dump_truck", label: "Dump truck" },
  { value: "compressor", label: "Compressor" },
  { value: "welding_machine", label: "Welding machine" },
  { value: "other", label: "Other" },
];

export const MACHINE_TYPE_OPTIONS = MACHINE_TYPES.map((item) => ({
  value: item.value,
  label: item.label,
}));

export const MACHINERY_WRITE_ROLES: Role[] = ["admin", "project_manager", "site_staff"];

export function usageAmount(hoursUsed: number, rate: number): number {
  return Math.round(hoursUsed * rate);
}