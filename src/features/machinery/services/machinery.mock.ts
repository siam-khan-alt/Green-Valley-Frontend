import { registerMock } from "@/services/mock/adapter";
import { usageAmount } from "../constants";
import type { Machinery, MachineryPayload, MachineryUsage, MachineryUsagePayload } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 150 + Math.random() * 200);
  });
}

let machinery: Machinery[] = [];
let usage: MachineryUsage[] = [];

function seed(): void {
  machinery = [
    { id: "mc_001", name: "Caterpillar 320 Excavator", type: "excavator", asset_no: "EXC-001", daily_rate: 45000 },
    { id: "mc_002", name: "Liebherr Tower Crane", type: "crane", asset_no: "CRN-004", daily_rate: 78000 },
    { id: "mc_003", name: "Schwing Concrete Pump", type: "concrete_pump", asset_no: "PMP-002", daily_rate: 36000 },
    { id: "mc_004", name: "Ashok Leyland Transit Mixer", type: "transit_mixer", asset_no: "MXR-011", daily_rate: 28000 },
    { id: "mc_005", name: "Bomag Vibrating Roller", type: "vibrating_roller", asset_no: "RLL-003", daily_rate: 32000 },
    { id: "mc_006", name: "Howo Dump Truck", type: "dump_truck", asset_no: "TRK-007", daily_rate: 25000 },
    { id: "mc_007", name: "Atlas Welding Machine", type: "welding_machine", asset_no: "WLD-015", daily_rate: 4000 },
  ];

  usage = [
    { id: "mu_001", project_id: "p_001", machinery: "mc_001", work_package: "wp_001_02", date: "2025-04-20", hours_used: 8, operator: "Rahim Uddin", rate: 45000, amount: usageAmount(8, 45000) },
    { id: "mu_002", project_id: "p_001", machinery: "mc_002", work_package: "wp_001_04", date: "2025-10-12", hours_used: 10, operator: "Hasan Ali", rate: 78000, amount: usageAmount(10, 78000) },
    { id: "mu_003", project_id: "p_001", machinery: "mc_003", work_package: "wp_001_04", date: "2026-01-08", hours_used: 6, operator: "Kamal Hossain", rate: 36000, amount: usageAmount(6, 36000) },
    { id: "mu_004", project_id: "p_001", machinery: "mc_004", work_package: "wp_001_02", date: "2025-04-22", hours_used: 8, operator: "Jamal Miah", rate: 28000, amount: usageAmount(8, 28000) },
    { id: "mu_005", project_id: "p_002", machinery: "mc_001", work_package: "wp_002_02", date: "2026-02-08", hours_used: 7, operator: "Rahim Uddin", rate: 45000, amount: usageAmount(7, 45000) },
  ];
}

seed();

function machineryValidate(payload: MachineryPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.name?.trim()) errors.name = ["Name is required."];
  if (!payload.type) errors.type = ["Select a type."];
  if (!payload.asset_no?.trim()) errors.asset_no = ["Asset number is required."];
  if (!(payload.daily_rate > 0)) errors.daily_rate = ["Daily rate must be greater than zero."];
  return errors;
}

function usageValidate(payload: MachineryUsagePayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.machinery) errors.machinery = ["Select machinery."];
  if (!payload.work_package) errors.work_package = ["Select a work package."];
  if (!payload.date) errors.date = ["Select a date."];
  if (!(payload.hours_used > 0)) errors.hours_used = ["Hours used must be greater than zero."];
  if (!(payload.rate > 0)) errors.rate = ["Rate must be greater than zero."];
  return errors;
}

registerMock("get", "/machinery", async () => {
  return wait({ status: 200, data: machinery });
});

registerMock("post", "/machinery", async (config) => {
  const payload = ((config.data as MachineryPayload) ?? {}) as MachineryPayload;
  const errors = machineryValidate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const item: Machinery = {
    id: `mc_${Date.now().toString(36)}`,
    ...payload,
  };
  machinery = [...machinery, item];
  return wait({ status: 201, data: item });
});

registerMock("patch", "/machinery/{id}", async (config, params) => {
  const index = machinery.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Machinery not found." } };
  }
  const patch = ((config.data as Partial<MachineryPayload>) ?? {}) as Partial<MachineryPayload>;
  const updated: Machinery = { ...machinery[index], ...patch };
  machinery = machinery.map((m) => (m.id === params.id ? updated : m));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/machinery/{id}", async (_config, params) => {
  const index = machinery.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Machinery not found." } };
  }
  const [removed] = machinery.splice(index, 1);
  return wait({ status: 200, data: removed });
});

registerMock("get", "/projects/{id}/machinery-usage", async (_config, params) => {
  return wait({
    status: 200,
    data: usage.filter((row) => row.project_id === params.id),
  });
});

registerMock("post", "/projects/{id}/machinery-usage", async (config, params) => {
  const payload = ((config.data as MachineryUsagePayload) ?? {}) as MachineryUsagePayload;
  const errors = usageValidate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const row: MachineryUsage = {
    id: `mu_${Date.now().toString(36)}`,
    project_id: params.id,
    machinery: payload.machinery,
    work_package: payload.work_package,
    date: payload.date,
    hours_used: payload.hours_used,
    operator: payload.operator,
    rate: payload.rate,
    amount: usageAmount(payload.hours_used, payload.rate),
  };
  usage = [...usage, row];
  return wait({ status: 201, data: row });
});