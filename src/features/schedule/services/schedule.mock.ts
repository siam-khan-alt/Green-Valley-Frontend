import { registerMock } from "@/services/mock/adapter";
import type { Milestone, MilestonePayload } from "../types";

interface SeedMilestone {
  name: string;
  planned_date: string;
  actual_date: string | null;
  status: Milestone["status"];
}

const seedByProject: Record<string, SeedMilestone[]> = {
  p_001: [
    { name: "Mobilization & site handover", planned_date: "2025-02-01", actual_date: "2025-02-05", status: "completed" },
    { name: "Soil investigation & design approval", planned_date: "2025-04-01", actual_date: "2025-04-18", status: "completed" },
    { name: "Piling & deep foundation", planned_date: "2025-08-15", actual_date: "2025-09-02", status: "completed" },
    { name: "Basement structure works", planned_date: "2026-01-30", actual_date: "2026-02-14", status: "completed" },
    { name: "Superstructure to roof slab", planned_date: "2026-09-30", actual_date: null, status: "in_progress" },
    { name: "Stilt parking & approach road", planned_date: "2026-09-01", actual_date: null, status: "delayed" },
    { name: "Brickwork & partitions", planned_date: "2026-11-30", actual_date: null, status: "not_started" },
    { name: "MEP rough-in", planned_date: "2027-01-15", actual_date: null, status: "not_started" },
    { name: "Finishing & facade", planned_date: "2027-04-15", actual_date: null, status: "not_started" },
    { name: "Handover & snagging", planned_date: "2027-06-30", actual_date: null, status: "not_started" },
  ],
  p_002: [
    { name: "Mobilization & site handover", planned_date: "2024-06-15", actual_date: "2024-07-10", status: "completed" },
    { name: "Piling & deep foundation", planned_date: "2024-11-01", actual_date: "2025-01-20", status: "completed" },
    { name: "Sub-structure works", planned_date: "2025-04-01", actual_date: "2025-06-15", status: "completed" },
    { name: "Superstructure GF–6th floor", planned_date: "2025-11-30", actual_date: "2026-08-10", status: "completed" },
    { name: "Superstructure 7th–roof slab", planned_date: "2026-05-31", actual_date: null, status: "delayed" },
    { name: "Brickwork & plaster", planned_date: "2026-08-15", actual_date: null, status: "delayed" },
    { name: "Finishing & MEP", planned_date: "2026-12-31", actual_date: null, status: "not_started" },
  ],
  p_003: [
    { name: "Mobilization & piling", planned_date: "2025-08-10", actual_date: "2025-08-22", status: "completed" },
    { name: "Basement excavation", planned_date: "2025-10-15", actual_date: "2025-12-01", status: "completed" },
    { name: "Sub-structure & core walls", planned_date: "2026-02-28", actual_date: null, status: "in_progress" },
    { name: "Tower superstructure", planned_date: "2026-09-30", actual_date: null, status: "not_started" },
    { name: "Retail podium finish", planned_date: "2027-06-30", actual_date: null, status: "not_started" },
    { name: "Handover", planned_date: "2028-03-31", actual_date: null, status: "not_started" },
  ],
  p_004: [
    { name: "Design & statutory approvals", planned_date: "2026-11-15", actual_date: null, status: "in_progress" },
    { name: "Demolition & site clearance", planned_date: "2027-01-31", actual_date: null, status: "not_started" },
    { name: "Foundation works", planned_date: "2027-06-30", actual_date: null, status: "not_started" },
    { name: "Superstructure", planned_date: "2028-03-31", actual_date: null, status: "not_started" },
    { name: "Handover", planned_date: "2028-09-30", actual_date: null, status: "not_started" },
  ],
  p_005: [
    { name: "Mobilization & piling", planned_date: "2023-04-01", actual_date: "2023-04-10", status: "completed" },
    { name: "Basement & foundation", planned_date: "2023-10-31", actual_date: "2023-11-12", status: "completed" },
    { name: "Superstructure to roof", planned_date: "2025-02-28", actual_date: "2025-03-20", status: "completed" },
    { name: "Finishing & MEP", planned_date: "2026-02-28", actual_date: "2026-03-05", status: "completed" },
    { name: "Handover & snagging", planned_date: "2026-06-15", actual_date: "2026-07-01", status: "completed" },
  ],
  p_006: [
    { name: "Site mobilization", planned_date: "2025-02-15", actual_date: "2025-02-18", status: "completed" },
    { name: "Earthworks & approach roads", planned_date: "2025-07-31", actual_date: "2025-08-25", status: "completed" },
    { name: "Steel structure — phase 1", planned_date: "2026-02-28", actual_date: null, status: "in_progress" },
    { name: "Utilities & internal roads", planned_date: "2026-06-30", actual_date: null, status: "in_progress" },
    { name: "Steel structure — phase 2", planned_date: "2026-12-31", actual_date: null, status: "not_started" },
    { name: "Full handover", planned_date: "2027-12-31", actual_date: null, status: "not_started" },
  ],
};

let store: Milestone[] = [];
for (const [projectId, rows] of Object.entries(seedByProject)) {
  rows.forEach((row, index) => {
    store.push({
      id: `m_${projectId}_${String(index + 1).padStart(2, "0")}`,
      project_id: projectId,
      name: row.name,
      planned_date: row.planned_date,
      actual_date: row.actual_date,
      status: row.status,
    });
  });
}

function wait<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function validate(payload: Partial<MilestonePayload>): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  if (!payload.name?.trim()) fields.name = ["This field is required."];
  if (!payload.planned_date) fields.planned_date = ["Planned date is required."];
  return fields;
}

function forProject(projectId: string): Milestone[] {
  return store.filter((m) => m.project_id === projectId);
}

registerMock("get", "/projects/{id}/milestones", async (_config, params) => {
  const results = forProject(params.id);
  return wait({ status: 200, data: results });
});

registerMock("post", "/projects/{id}/milestones", async (config, params) => {
  const payload = (config.data as MilestonePayload) ?? {};
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const milestone: Milestone = {
    id: `m_${Date.now().toString(36)}`,
    project_id: params.id,
    name: payload.name,
    planned_date: payload.planned_date,
    actual_date: payload.actual_date ?? null,
    status: payload.status ?? "not_started",
  };
  store = [...store, milestone];
  return wait({ status: 201, data: milestone });
});

registerMock("patch", "/milestones/{id}", async (config, params) => {
  const index = store.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Milestone not found." } };
  }
  const payload = (config.data as Partial<MilestonePayload>) ?? {};
  const errors = validate({ ...store[index], ...payload });
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const updated: Milestone = {
    ...store[index],
    ...payload,
    actual_date: payload.actual_date ?? null,
  };
  store = store.map((m) => (m.id === params.id ? updated : m));
  return wait({ status: 200, data: updated });
});