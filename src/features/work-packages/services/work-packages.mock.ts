import { registerMock } from "@/services/mock/adapter";
import type {
  WorkPackage,
  WorkPackagePayload,
  WorkPackageSummary,
} from "../types";

interface SeedRow {
  code: string;
  name: string;
  description: string;
  planned_start: string;
  planned_end: string;
  contractor: string;
  status: WorkPackage["status"];
  boq_scope: number;
  measured_quantity: number;
  progress_pct: number;
  labor_cost: number;
  po_cost: number;
  ra_bill_value: number;
}

const seedByProject: Record<string, SeedRow[]> = {
  p_001: [
    {
      code: "WP-01",
      name: "Mobilization & site setup",
      description: "Site handover, temporary utilities, hoarding and worker facilities.",
      planned_start: "2025-01-20",
      planned_end: "2025-03-10",
      contractor: "Apex Construction",
      status: "completed",
      boq_scope: 12_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 2_100_000,
      po_cost: 3_400_000,
      ra_bill_value: 4_800_000,
    },
    {
      code: "WP-02",
      name: "Piling & deep foundation",
      description: "Bored piling, pile caps and ground beams for both basements.",
      planned_start: "2025-04-15",
      planned_end: "2025-09-20",
      contractor: "Foundation Experts Ltd.",
      status: "completed",
      boq_scope: 68_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 11_000_000,
      po_cost: 42_000_000,
      ra_bill_value: 30_500_000,
    },
    {
      code: "WP-03",
      name: "Basement structure",
      description: "Basement slabs, retaining walls and waterproofing membrane.",
      planned_start: "2025-09-25",
      planned_end: "2026-02-28",
      contractor: "Apex Construction",
      status: "completed",
      boq_scope: 55_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 9_200_000,
      po_cost: 31_000_000,
      ra_bill_value: 24_000_000,
    },
    {
      code: "WP-04",
      name: "Superstructure slabs & columns",
      description: "Structural frame from ground floor to roof slab level.",
      planned_start: "2026-03-01",
      planned_end: "2026-12-31",
      contractor: "Rongdhonu Builders",
      status: "in_progress",
      boq_scope: 95_000_000,
      measured_quantity: 55,
      progress_pct: 58,
      labor_cost: 17_500_000,
      po_cost: 44_000_000,
      ra_bill_value: 28_000_000,
    },
    {
      code: "WP-05",
      name: "Brickwork & partitions",
      description: "External and internal masonry, lintels and opening framing.",
      planned_start: "2026-11-01",
      planned_end: "2027-03-31",
      contractor: "Apex Construction",
      status: "not_started",
      boq_scope: 26_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-06",
      name: "MEP works",
      description: "Electrical, plumbing, drainage and HVAC rough-in and fit-out.",
      planned_start: "2027-01-10",
      planned_end: "2027-06-30",
      contractor: "Powerline MEP",
      status: "not_started",
      boq_scope: 38_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-07",
      name: "Finishing & facade",
      description: "Flooring, false ceiling, paint, cladding and fenestration.",
      planned_start: "2027-04-01",
      planned_end: "2027-08-31",
      contractor: "InteriorPro Bangladesh",
      status: "not_started",
      boq_scope: 44_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-08",
      name: "External works & landscaping",
      description: "Paved courts, RCC gates, boundary walls and green areas.",
      planned_start: "2027-05-01",
      planned_end: "2027-10-31",
      contractor: "GreenScape Ltd.",
      status: "not_started",
      boq_scope: 12_500_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-09",
      name: "Stilt parking & approach road",
      description: "Stilt parking slab, ramp and front approach road.",
      planned_start: "2026-06-01",
      planned_end: "2026-11-30",
      contractor: "RoadTek Builders",
      status: "on_hold",
      boq_scope: 15_000_000,
      measured_quantity: 20,
      progress_pct: 20,
      labor_cost: 1_000_000,
      po_cost: 4_500_000,
      ra_bill_value: 0,
    },
  ],
  p_002: [
    {
      code: "WP-01",
      name: "Piling & foundation",
      description: "Piling, pile caps and ground beams.",
      planned_start: "2024-06-15",
      planned_end: "2025-01-20",
      contractor: "Foundation Experts Ltd.",
      status: "completed",
      boq_scope: 41_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 6_800_000,
      po_cost: 26_000_000,
      ra_bill_value: 18_500_000,
    },
    {
      code: "WP-02",
      name: "Sub-structure works",
      description: "Basements and ground slab for the two blocks.",
      planned_start: "2025-02-01",
      planned_end: "2025-06-15",
      contractor: "Apex Construction",
      status: "completed",
      boq_scope: 33_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 5_400_000,
      po_cost: 19_000_000,
      ra_bill_value: 14_000_000,
    },
    {
      code: "WP-03",
      name: "Superstructure GF–6th",
      description: "Structural frame up to the 6th floor.",
      planned_start: "2025-07-01",
      planned_end: "2026-08-10",
      contractor: "Rongdhonu Builders",
      status: "completed",
      boq_scope: 74_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 13_000_000,
      po_cost: 38_000_000,
      ra_bill_value: 30_000_000,
    },
    {
      code: "WP-04",
      name: "Superstructure 7th–roof",
      description: "Top floor and roof slab, water tank and pump room.",
      planned_start: "2026-02-01",
      planned_end: "2026-08-31",
      contractor: "Rongdhonu Builders",
      status: "on_hold",
      boq_scope: 39_000_000,
      measured_quantity: 40,
      progress_pct: 42,
      labor_cost: 6_000_000,
      po_cost: 16_000_000,
      ra_bill_value: 9_000_000,
    },
    {
      code: "WP-05",
      name: "Brickwork & plaster",
      description: "Masonry, plaster and roughness of internal walls.",
      planned_start: "2026-08-15",
      planned_end: "2026-12-31",
      contractor: "Apex Construction",
      status: "not_started",
      boq_scope: 22_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
  ],
  p_003: [
    {
      code: "WP-01",
      name: "Piling & basement excavation",
      description: "Piling, excavation and shoring for the two basements.",
      planned_start: "2025-08-10",
      planned_end: "2025-12-01",
      contractor: "Foundation Experts Ltd.",
      status: "completed",
      boq_scope: 88_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 14_000_000,
      po_cost: 52_000_000,
      ra_bill_value: 38_000_000,
    },
    {
      code: "WP-02",
      name: "Sub-structure & core walls",
      description: "Basement slabs, shear walls and elevator cores.",
      planned_start: "2025-12-05",
      planned_end: "2026-06-30",
      contractor: "Apex Construction",
      status: "in_progress",
      boq_scope: 120_000_000,
      measured_quantity: 35,
      progress_pct: 38,
      labor_cost: 18_000_000,
      po_cost: 52_000_000,
      ra_bill_value: 33_000_000,
    },
    {
      code: "WP-03",
      name: "Tower superstructure",
      description: "Office tower structural frame to 24 floors.",
      planned_start: "2026-07-01",
      planned_end: "2027-12-31",
      contractor: "Rongdhonu Builders",
      status: "not_started",
      boq_scope: 210_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-04",
      name: "Retail podium & facade",
      description: "Podium finishes, glazing and curtain wall.",
      planned_start: "2027-06-30",
      planned_end: "2028-03-31",
      contractor: "InteriorPro Bangladesh",
      status: "not_started",
      boq_scope: 64_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
  ],
  p_004: [
    {
      code: "WP-01",
      name: "Design & approvals",
      description: "Approval drawings, RAJUK clearances and shop drawings.",
      planned_start: "2026-10-01",
      planned_end: "2027-01-31",
      contractor: "Studio Veranda",
      status: "in_progress",
      boq_scope: 5_000_000,
      measured_quantity: 30,
      progress_pct: 30,
      labor_cost: 800_000,
      po_cost: 1_200_000,
      ra_bill_value: 0,
    },
    {
      code: "WP-02",
      name: "Demolition & clearance",
      description: "Selective demolition of heritage structures per conservation plan.",
      planned_start: "2027-02-01",
      planned_end: "2027-05-31",
      contractor: "GreenScape Ltd.",
      status: "not_started",
      boq_scope: 8_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-03",
      name: "Foundation & superstructure",
      description: "Retail arcade and residential loft construction.",
      planned_start: "2027-06-01",
      planned_end: "2028-03-31",
      contractor: "Apex Construction",
      status: "not_started",
      boq_scope: 98_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
  ],
  p_005: [
    {
      code: "WP-01",
      name: "Foundation",
      description: "Piling and raft foundation.",
      planned_start: "2023-04-01",
      planned_end: "2023-11-12",
      contractor: "Foundation Experts Ltd.",
      status: "completed",
      boq_scope: 47_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 7_000_000,
      po_cost: 28_000_000,
      ra_bill_value: 21_000_000,
    },
    {
      code: "WP-02",
      name: "Superstructure",
      description: "Full structural frame to roof.",
      planned_start: "2023-12-01",
      planned_end: "2025-03-20",
      contractor: "Rongdhonu Builders",
      status: "completed",
      boq_scope: 122_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 22_000_000,
      po_cost: 58_000_000,
      ra_bill_value: 55_000_000,
    },
    {
      code: "WP-03",
      name: "Finishing & services",
      description: "Finishing, MEP and external works to handover.",
      planned_start: "2025-04-01",
      planned_end: "2026-07-01",
      contractor: "InteriorPro Bangladesh",
      status: "completed",
      boq_scope: 96_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 17_000_000,
      po_cost: 41_000_000,
      ra_bill_value: 40_000_000,
    },
  ],
  p_006: [
    {
      code: "WP-01",
      name: "Earthworks & approach",
      description: "Site grading, compaction and approach roads.",
      planned_start: "2025-02-15",
      planned_end: "2025-08-25",
      contractor: "RoadTek Builders",
      status: "completed",
      boq_scope: 58_000_000,
      measured_quantity: 100,
      progress_pct: 100,
      labor_cost: 9_000_000,
      po_cost: 31_000_000,
      ra_bill_value: 22_000_000,
    },
    {
      code: "WP-02",
      name: "Steel structure phase 1",
      description: "Primary frames for warehouse blocks A–C.",
      planned_start: "2025-09-01",
      planned_end: "2026-06-30",
      contractor: "SteelTech Industries",
      status: "in_progress",
      boq_scope: 152_000_000,
      measured_quantity: 45,
      progress_pct: 47,
      labor_cost: 16_000_000,
      po_cost: 80_000_000,
      ra_bill_value: 38_000_000,
    },
    {
      code: "WP-03",
      name: "Steel structure phase 2",
      description: "Cladding, doors and secondary steel for blocks D–F.",
      planned_start: "2026-07-01",
      planned_end: "2026-12-31",
      contractor: "SteelTech Industries",
      status: "not_started",
      boq_scope: 98_000_000,
      measured_quantity: 0,
      progress_pct: 0,
      labor_cost: 0,
      po_cost: 0,
      ra_bill_value: 0,
    },
    {
      code: "WP-04",
      name: "Utilities & internal roads",
      description: "Drainage, water, power distribution and internal circulation.",
      planned_start: "2026-03-01",
      planned_end: "2027-06-30",
      contractor: "Powerline MEP",
      status: "in_progress",
      boq_scope: 74_000_000,
      measured_quantity: 20,
      progress_pct: 22,
      labor_cost: 6_500_000,
      po_cost: 38_000_000,
      ra_bill_value: 11_000_000,
    },
  ],
};

let wpStore: WorkPackage[] = [];
const summaryStore = new Map<string, WorkPackageSummary>();

for (const [projectId, rows] of Object.entries(seedByProject)) {
  rows.forEach((row, index) => {
    const id = `wp_${projectId}_${String(index + 1).padStart(2, "0")}`;
    wpStore.push({
      id,
      project_id: projectId,
      code: row.code,
      name: row.name,
      description: row.description,
      planned_start: row.planned_start,
      planned_end: row.planned_end,
      contractor: row.contractor,
      status: row.status,
    });
    summaryStore.set(id, {
      id,
      boq_scope: row.boq_scope,
      measured_quantity: row.measured_quantity,
      progress_pct: row.progress_pct,
      labor_cost: row.labor_cost,
      po_cost: row.po_cost,
      ra_bill_value: row.ra_bill_value,
    });
  });
}

function wait<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function validate(
  payload: Partial<WorkPackagePayload>
): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  if (!payload.code?.trim()) fields.code = ["This field is required."];
  if (!payload.name?.trim()) fields.name = ["This field is required."];
  if (payload.planned_start && payload.planned_end && payload.planned_start > payload.planned_end) {
    fields.planned_start = ["Start date must be before end date."];
  }
  return fields;
}

registerMock("get", "/projects/{id}/work-packages", async (_config, params) => {
  const results = wpStore.filter((wp) => wp.project_id === params.id);
  return wait({ status: 200, data: results });
});

registerMock("post", "/projects/{id}/work-packages", async (config, params) => {
  const payload = (config.data as WorkPackagePayload) ?? {};
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const id = `wp_${Date.now().toString(36)}`;
  const workPackage: WorkPackage = {
    id,
    project_id: params.id,
    ...payload,
  };
  wpStore = [...wpStore, workPackage];
  summaryStore.set(id, {
    id,
    boq_scope: 0,
    measured_quantity: 0,
    progress_pct: payload.status === "completed" ? 100 : 0,
    labor_cost: 0,
    po_cost: 0,
    ra_bill_value: 0,
  });
  return wait({ status: 201, data: workPackage });
});

registerMock("patch", "/work-packages/{id}", async (config, params) => {
  const index = wpStore.findIndex((wp) => wp.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Work package not found." } };
  }
  const payload = (config.data as Partial<WorkPackagePayload>) ?? {};
  const errors = validate({ ...wpStore[index], ...payload });
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const updated: WorkPackage = { ...wpStore[index], ...payload };
  wpStore = wpStore.map((wp) => (wp.id === params.id ? updated : wp));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/work-packages/{id}", async (_config, params) => {
  const index = wpStore.findIndex((wp) => wp.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Work package not found." } };
  }
  wpStore = wpStore.filter((wp) => wp.id !== params.id);
  summaryStore.delete(params.id);
  return wait({ status: 204, data: null });
});

registerMock("get", "/work-packages/{id}/summary", async (_config, params) => {
  const summary = summaryStore.get(params.id);
  if (!summary) {
    return { status: 404, data: { detail: "Work package not found." } };
  }
  return wait({ status: 200, data: summary });
});