import { registerMock } from "@/services/mock/adapter";
import { boqItemRate } from "@/features/boq/services/boq.mock";
import type {
  Measurement,
  MeasurementPayload,
  MeasurementPatch,
  RaBill,
  RaBillPayload,
  RaBillPatch,
} from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

interface WpSeed {
  id: string;
  code: string;
  name: string;
}

const workPackages: Record<string, WpSeed[]> = {
  p_001: [
    { id: "wp_p_001_01", code: "WP-01", name: "Mobilization & site setup" },
    { id: "wp_p_001_02", code: "WP-02", name: "Piling & deep foundation" },
    { id: "wp_p_001_03", code: "WP-03", name: "Basement structure" },
    { id: "wp_p_001_04", code: "WP-04", name: "Superstructure slabs & columns" },
    { id: "wp_p_001_05", code: "WP-05", name: "Brickwork & partitions" },
    { id: "wp_p_001_06", code: "WP-06", name: "MEP works" },
    { id: "wp_p_001_07", code: "WP-07", name: "Finishing & facade" },
    { id: "wp_p_001_08", code: "WP-08", name: "External works & landscaping" },
  ],
  p_002: [
    { id: "wp_p_002_01", code: "WP-01", name: "Piling & foundation" },
    { id: "wp_p_002_02", code: "WP-02", name: "Sub-structure works" },
    { id: "wp_p_002_03", code: "WP-03", name: "Superstructure GF–6th" },
  ],
  p_003: [
    { id: "wp_p_003_01", code: "WP-01", name: "Piling & basement excavation" },
    { id: "wp_p_003_02", code: "WP-02", name: "Sub-structure & core walls" },
  ],
};

let measurements: Measurement[] = [];
let raBills: RaBill[] = [];

function seed(): void {
  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  };

  measurements = [
    {
      id: "meas_001",
      project_id: "p_001",
      work_package_id: "wp_p_001_02",
      work_package_code: "WP-02",
      work_package_name: "Piling & deep foundation",
      boq_item_id: "bi_p_001_4",
      boq_item_description: "Bored piles (600 mm dia)",
      unit: "rft",
      measured_quantity: 1350,
      measurement_date: daysAgo(30),
      notes: "DPR 1–15 piling advance.",
      status: "approved",
    },
    {
      id: "meas_002",
      project_id: "p_001",
      work_package_id: "wp_p_001_02",
      work_package_code: "WP-02",
      work_package_name: "Piling & deep foundation",
      boq_item_id: "bi_p_001_5",
      boq_item_description: "Pile caps & grade beams",
      unit: "cum",
      measured_quantity: 210,
      measurement_date: daysAgo(28),
      notes: "Pile caps A–C pour measurement.",
      status: "approved",
    },
    {
      id: "meas_003",
      project_id: "p_001",
      work_package_id: "wp_p_001_03",
      work_package_code: "WP-03",
      work_package_name: "Basement structure",
      boq_item_id: "bi_p_001_6",
      boq_item_description: "Basement structure RCC",
      unit: "cum",
      measured_quantity: 480,
      measurement_date: daysAgo(12),
      notes: "Basement B1 slab pour.",
      status: "approved",
    },
    {
      id: "meas_004",
      project_id: "p_001",
      work_package_id: "wp_p_001_04",
      work_package_code: "WP-04",
      work_package_name: "Superstructure slabs & columns",
      boq_item_id: "bi_p_001_8",
      boq_item_description: "Superstructure concrete",
      unit: "cum",
      measured_quantity: 380,
      measurement_date: daysAgo(4),
      notes: "Ground floor columns & slab.",
      status: "verified",
    },
    {
      id: "meas_005",
      project_id: "p_001",
      work_package_id: "wp_p_001_01",
      work_package_code: "WP-01",
      work_package_name: "Mobilization & site setup",
      boq_item_id: "bi_p_001_1",
      boq_item_description: "Site establishment & temporary works",
      unit: "no",
      measured_quantity: 1,
      measurement_date: daysAgo(2),
      notes: "Site office handed over.",
      status: "draft",
    },
    {
      id: "meas_006",
      project_id: "p_002",
      work_package_id: "wp_p_002_01",
      work_package_code: "WP-01",
      work_package_name: "Piling & foundation",
      boq_item_id: "bi_p_002_1",
      boq_item_description: "Site clearance & leveling",
      unit: "no",
      measured_quantity: 1,
      measurement_date: daysAgo(20),
      notes: "Complete site clearance.",
      status: "approved",
    },
    {
      id: "meas_007",
      project_id: "p_002",
      work_package_id: "wp_p_002_02",
      work_package_code: "WP-02",
      work_package_name: "Sub-structure works",
      boq_item_id: "bi_p_002_2",
      boq_item_description: "Strip foundation PCC",
      unit: "cum",
      measured_quantity: 120,
      measurement_date: daysAgo(8),
      notes: "Block A strip foundation PCC.",
      status: "verified",
    },
  ];

  raBills = [
    {
      id: "rab_001",
      project_id: "p_001",
      bill_no: "GV-001",
      bill_date: daysAgo(25),
      period_from: daysAgo(60),
      period_to: daysAgo(30),
      status: "approved",
      lines: [
        {
          work_package_code: "WP-02",
          work_package_name: "Piling & deep foundation",
          boq_item_description: "Bored piles (600 mm dia)",
          unit: "rft",
          measured_quantity: 1350,
          rate: 7600,
          amount: 10260000,
        },
        {
          work_package_code: "WP-02",
          work_package_name: "Piling & deep foundation",
          boq_item_description: "Pile caps & grade beams",
          unit: "cum",
          measured_quantity: 210,
          rate: 21000,
          amount: 4410000,
        },
      ],
      gross_amount: 14670000,
      deductions: { advance: 2000000, retention: 733500, material_issue: 0, penalty: 0 },
      net_payable: 11936500,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: "rab_002",
      project_id: "p_001",
      bill_no: "GV-002",
      bill_date: daysAgo(8),
      period_from: daysAgo(29),
      period_to: daysAgo(12),
      status: "draft",
      lines: [],
      gross_amount: 0,
      deductions: { advance: 0, retention: 0, material_issue: 0, penalty: 0 },
      net_payable: 0,
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
      id: "rab_003",
      project_id: "p_002",
      bill_no: "GV-101",
      bill_date: daysAgo(15),
      period_from: daysAgo(45),
      period_to: daysAgo(20),
      status: "submitted",
      lines: [
        {
          work_package_code: "WP-01",
          work_package_name: "Piling & foundation",
          boq_item_description: "Site clearance & leveling",
          unit: "no",
          measured_quantity: 1,
          rate: 600000,
          amount: 600000,
        },
      ],
      gross_amount: 600000,
      deductions: { advance: 0, retention: 30000, material_issue: 0, penalty: 0 },
      net_payable: 570000,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ];
}

seed();

function validateMeasurement(payload: MeasurementPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package_id) errors.work_package_id = ["Work package is required."];
  if (!payload.boq_item_id) errors.boq_item_id = ["BOQ item is required."];
  if (!(payload.measured_quantity >= 0)) errors.measured_quantity = ["Measured quantity must be non-negative."];
  if (!payload.measurement_date) errors.measurement_date = ["Measurement date is required."];
  return errors;
}

function round(value: number): number {
  return Math.round(value);
}

registerMock("get", "/projects/{projectId}/measurements", async (_config, params) => {
  const result = measurements
    .filter((m) => m.project_id === params.projectId)
    .sort((a, b) => b.measurement_date.localeCompare(a.measurement_date));
  return wait({ status: 200, data: result });
});

registerMock("post", "/projects/{projectId}/measurements", async (config, params) => {
  const payload = ((config.data as MeasurementPayload) ?? {}) as MeasurementPayload;
  const errors = validateMeasurement(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const wp = (workPackages[params.projectId] ?? []).find((w) => w.id === payload.work_package_id);
  const rate = boqItemRate(params.projectId, payload.boq_item_id);
  if (!wp) {
    return { status: 400, data: { work_package_id: ["Invalid work package."] } };
  }
  if (!rate) {
    return { status: 400, data: { boq_item_id: ["Invalid BOQ item."] } };
  }
  const measurement: Measurement = {
    id: `meas_${Date.now().toString(36)}`,
    project_id: params.projectId,
    work_package_id: payload.work_package_id,
    work_package_code: wp.code,
    work_package_name: wp.name,
    boq_item_id: payload.boq_item_id,
    boq_item_description: payload.boq_item_description || "",
    unit: payload.unit || "",
    measured_quantity: payload.measured_quantity,
    measurement_date: payload.measurement_date,
    notes: payload.notes ?? "",
    status: "draft",
  };
  measurements = [...measurements, measurement];
  return wait({ status: 201, data: measurement });
});

registerMock("patch", "/measurements/{id}", async (config, params) => {
  const index = measurements.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Measurement not found." } };
  }
  const patch = ((config.data as MeasurementPatch) ?? {}) as MeasurementPatch;
  const updated: Measurement = { ...measurements[index], ...patch };
  measurements = measurements.map((m) => (m.id === params.id ? updated : m));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/measurements/{id}", async (_config, params) => {
  const index = measurements.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Measurement not found." } };
  }
  const [removed] = measurements.splice(index, 1);
  return wait({ status: 200, data: removed });
});

registerMock("get", "/projects/{projectId}/ra-bills", async (_config, params) => {
  const result = raBills
    .filter((b) => b.project_id === params.projectId)
    .sort((a, b) => b.bill_date.localeCompare(a.bill_date));
  return wait({ status: 200, data: result });
});

registerMock("post", "/projects/{projectId}/ra-bills", async (config, params) => {
  const payload = ((config.data as RaBillPayload) ?? {}) as RaBillPayload;
  if (!payload.bill_no?.trim()) {
    return { status: 400, data: { bill_no: ["Bill number is required."] } };
  }
  const bill: RaBill = {
    id: `rab_${Date.now().toString(36)}`,
    project_id: params.projectId,
    bill_no: payload.bill_no,
    bill_date: payload.bill_date,
    period_from: payload.period_from,
    period_to: payload.period_to,
    status: "draft",
    lines: [],
    gross_amount: 0,
    deductions: { advance: 0, retention: 0, material_issue: 0, penalty: 0 },
    net_payable: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  raBills = [...raBills, bill];
  return wait({ status: 201, data: bill });
});

registerMock("post", "/ra-bills/{id}/generate", async (_config, params) => {
  const index = raBills.findIndex((b) => b.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "RA bill not found." } };
  }
  const bill = raBills[index];
  const projectId = bill.project_id;
  const approved = measurements.filter(
    (m) => m.project_id === projectId && m.status === "approved"
  );
  const lines = approved.map((m) => {
    const rate = boqItemRate(projectId, m.boq_item_id);
    return {
      work_package_code: m.work_package_code,
      work_package_name: m.work_package_name,
      boq_item_description: m.boq_item_description,
      unit: m.unit,
      measured_quantity: m.measured_quantity,
      rate,
      amount: round(m.measured_quantity * rate),
    };
  });
  const gross = lines.reduce((sum, l) => sum + l.amount, 0);
  const retention = round(gross * 0.05);
  const deductions = { advance: 0, retention, material_issue: 0, penalty: 0 };
  const updated: RaBill = {
    ...bill,
    lines,
    gross_amount: gross,
    deductions,
    net_payable: round(gross - (deductions.advance + deductions.retention + deductions.material_issue + deductions.penalty)),
    updated_at: new Date().toISOString(),
  };
  raBills = raBills.map((b) => (b.id === params.id ? updated : b));
  return wait({ status: 200, data: updated });
});

registerMock("patch", "/ra-bills/{id}", async (config, params) => {
  const index = raBills.findIndex((b) => b.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "RA bill not found." } };
  }
  const patch = ((config.data as RaBillPatch) ?? {}) as RaBillPatch;
  const deductions = patch.deductions;
  const next: RaBill = {
    ...raBills[index],
    ...patch,
    net_payable: deductions
      ? round(raBills[index].gross_amount - (deductions.advance + deductions.retention + deductions.material_issue + deductions.penalty))
      : raBills[index].net_payable,
    updated_at: new Date().toISOString(),
  };
  raBills = raBills.map((b) => (b.id === params.id ? next : b));
  return wait({ status: 200, data: next });
});