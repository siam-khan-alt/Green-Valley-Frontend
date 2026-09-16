import { registerMock } from "@/services/mock/adapter";
import { musterAmount } from "../constants";
import type { MusterEntry, MusterPayload } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 150 + Math.random() * 200);
  });
}

let muster: MusterEntry[] = [];

function seed(): void {
  muster = [
    { id: "ms_001", project_id: "p_001", work_package: "wp_001_04", date: "2026-01-08", labor_type: "mason", head_count: 14, hours_worked: 8, rate: 120, amount: musterAmount(14, 8, 120) },
    { id: "ms_002", project_id: "p_001", work_package: "wp_001_04", date: "2026-01-08", labor_type: "helper", head_count: 26, hours_worked: 8, rate: 90, amount: musterAmount(26, 8, 90) },
    { id: "ms_003", project_id: "p_001", work_package: "wp_001_04", date: "2026-01-08", labor_type: "bar_binder", head_count: 9, hours_worked: 7, rate: 110, amount: musterAmount(9, 7, 110) },
    { id: "ms_004", project_id: "p_001", work_package: "wp_001_05", date: "2026-01-09", labor_type: "mason", head_count: 11, hours_worked: 8, rate: 120, amount: musterAmount(11, 8, 120) },
    { id: "ms_005", project_id: "p_001", work_package: "wp_001_05", date: "2026-01-09", labor_type: "helper", head_count: 18, hours_worked: 8, rate: 90, amount: musterAmount(18, 8, 90) },
    { id: "ms_006", project_id: "p_001", work_package: "wp_001_03", date: "2026-01-10", labor_type: "carpenter", head_count: 7, hours_worked: 8, rate: 120, amount: musterAmount(7, 8, 120) },
    { id: "ms_007", project_id: "p_001", work_package: "wp_001_03", date: "2026-01-10", labor_type: "helper", head_count: 12, hours_worked: 7, rate: 90, amount: musterAmount(12, 7, 90) },
    { id: "ms_008", project_id: "p_002", work_package: "wp_002_02", date: "2026-02-05", labor_type: "mason", head_count: 8, hours_worked: 8, rate: 115, amount: musterAmount(8, 8, 115) },
    { id: "ms_009", project_id: "p_002", work_package: "wp_002_02", date: "2026-02-05", labor_type: "helper", head_count: 15, hours_worked: 8, rate: 85, amount: musterAmount(15, 8, 85) },
  ];
}

seed();

function validate(payload: MusterPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package) errors.work_package = ["Select a work package."];
  if (!payload.date) errors.date = ["Select a date."];
  if (!payload.labor_type) errors.labor_type = ["Select a labor type."];
  if (!(payload.head_count > 0)) errors.head_count = ["Head count must be greater than zero."];
  if (!(payload.hours_worked > 0)) errors.hours_worked = ["Hours worked must be greater than zero."];
  if (!(payload.rate > 0)) errors.rate = ["Rate must be greater than zero."];
  return errors;
}

registerMock("get", "/projects/{id}/muster", async (_config, params) => {
  return wait({
    status: 200,
    data: muster.filter((entry) => entry.project_id === params.id),
  });
});

registerMock("post", "/projects/{id}/muster", async (config, params) => {
  const payload = ((config.data as MusterPayload) ?? {}) as MusterPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const entry: MusterEntry = {
    id: `ms_${Date.now().toString(36)}`,
    project_id: params.id,
    work_package: payload.work_package,
    date: payload.date,
    labor_type: payload.labor_type,
    head_count: payload.head_count,
    hours_worked: payload.hours_worked,
    rate: payload.rate,
    amount: musterAmount(payload.head_count, payload.hours_worked, payload.rate),
  };
  muster = [...muster, entry];
  return wait({ status: 201, data: entry });
});

registerMock("delete", "/muster/{id}", async (_config, params) => {
  const index = muster.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Muster entry not found." } };
  }
  muster = muster.filter((m) => m.id !== params.id);
  return wait({ status: 204, data: null });
});