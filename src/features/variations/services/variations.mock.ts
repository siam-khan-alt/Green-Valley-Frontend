import { registerMock } from "@/services/mock/adapter";
import type {
  Variation,
  VariationPatch,
  VariationPayload,
} from "../types";

interface SeedRow {
  description: string;
  cost_impact: number;
  schedule_impact_days: number;
  status: Variation["status"];
  notes?: string;
}

const seedByProject: Record<string, SeedRow[]> = {
  p_001: [
    {
      description: "Additional 2 basement levels — retention wall redesign",
      cost_impact: 42_000_000,
      schedule_impact_days: 45,
      status: "approved",
      notes: "Client approved after revised foundation layout.",
    },
    {
      description: "Upgrade lift capacity 10 to 13 passenger for all cores",
      cost_impact: 18_500_000,
      schedule_impact_days: 21,
      status: "proposed",
      notes: "Waiting for vendor quotation.",
    },
    {
      description: "Smart-home wiring package on units 1–32",
      cost_impact: 9_750_000,
      schedule_impact_days: 14,
      status: "proposed",
    },
  ],
  p_002: [
    {
      description: "Ground water dewatering scope extension",
      cost_impact: 8_200_000,
      schedule_impact_days: 60,
      status: "approved",
      notes: "Delayed foundation by 2 months.",
    },
  ],
  p_003: [
    {
      description: "Rooftop solar PV integration (client request)",
      cost_impact: 24_000_000,
      schedule_impact_days: 30,
      status: "proposed",
    },
    {
      description: "Remove retail podium fountain feature",
      cost_impact: -6_500_000,
      schedule_impact_days: 0,
      status: "rejected",
    },
  ],
};

let variations: Variation[] = [];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function seed(): void {
  for (const [projectId, rows] of Object.entries(seedByProject)) {
    rows.forEach((row, index) => {
      const created = daysAgo(20 - index * 4);
      variations.push({
        id: `var_${projectId.split("_")[1]}_${String(index + 1).padStart(2, "0")}`,
        project_id: projectId,
        description: row.description,
        cost_impact: row.cost_impact,
        schedule_impact_days: row.schedule_impact_days,
        status: row.status,
        notes: row.notes,
        created_at: new Date(`${created}T09:00:00Z`).toISOString(),
        updated_at: new Date(`${created}T09:00:00Z`).toISOString(),
      });
    });
  }
}

seed();

function validate(payload: Partial<VariationPayload>): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.description?.trim()) errors.description = ["Description is required."];
  if (payload.cost_impact === undefined || Number.isNaN(payload.cost_impact)) {
    errors.cost_impact = ["Cost impact is required."];
  }
  if (payload.schedule_impact_days === undefined || payload.schedule_impact_days < 0) {
    errors.schedule_impact_days = ["Schedule impact days must be non-negative."];
  }
  return errors;
}

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

registerMock("get", "/projects/{projectId}/variations", async (_config, params) => {
  const result = variations
    .filter((v) => v.project_id === params.projectId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return wait({ status: 200, data: result });
});

registerMock("post", "/projects/{projectId}/variations", async (config, params) => {
  const payload = ((config.data as VariationPayload) ?? {}) as VariationPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const projectSerial = params.projectId.split("_")[1] ?? "001";
  const variation: Variation = {
    id: `var_${projectSerial}_${Date.now().toString(36)}`,
    project_id: params.projectId,
    description: payload.description,
    cost_impact: payload.cost_impact,
    schedule_impact_days: payload.schedule_impact_days,
    status: "proposed",
    notes: payload.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  variations = [...variations, variation];
  return wait({ status: 201, data: variation });
});

registerMock("patch", "/variations/{id}", async (config, params) => {
  const index = variations.findIndex((v) => v.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Variation not found." } };
  }
  const patch = ((config.data as VariationPatch) ?? {}) as VariationPatch;
  const updated: Variation = {
    ...variations[index],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  variations = variations.map((v) => (v.id === params.id ? updated : v));
  return wait({ status: 200, data: updated });
});