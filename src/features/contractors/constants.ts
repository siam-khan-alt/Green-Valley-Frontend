import type { ContractorType } from "./types";

export const CONTRACTOR_TYPES: ContractorType[] = ["contractor", "subcontractor"];

export const CONTRACTOR_OPTIONS: { value: ContractorType; label: string }[] = [
  { value: "contractor", label: "Contractor" },
  { value: "subcontractor", label: "Subcontractor" },
];

export const CONTRACTORS_WRITE_ROLES = ["admin", "project_manager"];