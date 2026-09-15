export type VariationStatus = "proposed" | "approved" | "rejected";

export interface Variation {
  id: string;
  project_id: string;
  description: string;
  cost_impact: number;
  schedule_impact_days: number;
  status: VariationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type VariationPayload = Pick<
  Variation,
  "description" | "cost_impact" | "schedule_impact_days"
> & { notes?: string };

export type VariationPatch = Partial<
  Pick<Variation, "status" | "description" | "cost_impact" | "schedule_impact_days" | "notes">
>;