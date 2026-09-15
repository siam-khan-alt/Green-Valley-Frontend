import { registerMock } from "@/services/mock/adapter";
import { INSPECTION_TYPES, INSPECTION_STATUS } from "../constants";
import type { Inspection, InspectionPayload, InspectionPatch } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

let inspections: Inspection[] = [];

function seed(): void {
  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  };
  const daysAhead = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().split("T")[0];
  };

  inspections = [
    {
      id: "insp_001",
      project_id: "p_001",
      work_package_id: "wp_p_001_02",
      work_package_code: "WP-02",
      work_package_name: "Piling & deep foundation",
      type: "foundation",
      requested_by: "Site Engineer",
      scheduled_date: daysAgo(7),
      actual_date: daysAgo(7),
      status: "passed",
      remarks: "All 4 piles passed integrity test. Concrete grade M35 verified.",
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: "insp_002",
      project_id: "p_001",
      work_package_id: "wp_p_001_02",
      work_package_code: "WP-02",
      work_package_name: "Piling & deep foundation",
      type: "concrete",
      requested_by: "Site Supervisor",
      scheduled_date: daysAgo(3),
      actual_date: daysAgo(3),
      status: "passed",
      remarks: "Cube tests at 7 days: avg 38 MPa. Within spec.",
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "insp_003",
      project_id: "p_001",
      work_package_id: "wp_p_001_03",
      work_package_code: "WP-03",
      work_package_name: "Basement structure",
      type: "rebar",
      requested_by: "Site Engineer",
      scheduled_date: daysAhead(2),
      status: "scheduled",
      remarks: "Basement mat rebar inspection before pour.",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "insp_004",
      project_id: "p_001",
      work_package_id: "wp_p_001_04",
      work_package_code: "WP-04",
      work_package_name: "Superstructure slabs & columns",
      type: "structural",
      requested_by: "Project Manager",
      scheduled_date: daysAhead(10),
      status: "requested",
      remarks: "Column concrete pour inspection for Grid A-C.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

seed();

function validate(payload: InspectionPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package_id) errors.work_package_id = ["Work package is required."];
  if (!payload.type || !INSPECTION_TYPES.some((t) => t.value === payload.type)) {
    errors.type = ["Valid inspection type is required."];
  }
  if (!payload.requested_by?.trim()) errors.requested_by = ["Requested by is required."];
  if (!payload.scheduled_date) errors.scheduled_date = ["Scheduled date is required."];
  return errors;
}

function validatePatch(patch: InspectionPatch): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (patch.status && !INSPECTION_STATUS[patch.status]) {
    errors.status = ["Invalid inspection status."];
  }
  if (patch.scheduled_date && !patch.scheduled_date) {
    errors.scheduled_date = ["Invalid date."];
  }
  return errors;
}

function getProjectWorkPackages() {
  const wpMap: Record<string, { id: string; code: string; name: string }> = {
    wp_p_001_01: { id: "wp_p_001_01", code: "WP-01", name: "Mobilization & site setup" },
    wp_p_001_02: { id: "wp_p_001_02", code: "WP-02", name: "Piling & deep foundation" },
    wp_p_001_03: { id: "wp_p_001_03", code: "WP-03", name: "Basement structure" },
    wp_p_001_04: { id: "wp_p_001_04", code: "WP-04", name: "Superstructure slabs & columns" },
    wp_p_001_05: { id: "wp_p_001_05", code: "WP-05", name: "Brickwork & partitions" },
    wp_p_001_06: { id: "wp_p_001_06", code: "WP-06", name: "MEP works" },
    wp_p_001_07: { id: "wp_p_001_07", code: "WP-07", name: "Finishing & facade" },
    wp_p_001_08: { id: "wp_p_001_08", code: "WP-08", name: "External works & landscaping" },
  };
  return Object.values(wpMap);
}

registerMock("get", "/projects/{projectId}/inspections", async (config, params) => {
  const projectId = params.projectId;
  const projectInspections = inspections
    .filter((i) => i.project_id === projectId)
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date) || b.created_at.localeCompare(a.created_at));
  return wait({ status: 200, data: projectInspections });
});

registerMock("post", "/projects/{projectId}/inspections", async (config, params) => {
  const projectId = params.projectId;
  const payload = (config.data as InspectionPayload) ?? {};
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const wp = getProjectWorkPackages().find((w) => w.id === payload.work_package_id);
  if (!wp) {
    return { status: 400, data: { work_package_id: ["Invalid work package."] } };
  }
  const inspection: Inspection = {
    id: `insp_${Date.now().toString(36)}`,
    project_id: projectId,
    work_package_id: payload.work_package_id,
    work_package_code: wp.code,
    work_package_name: wp.name,
    type: payload.type,
    requested_by: payload.requested_by,
    scheduled_date: payload.scheduled_date,
    status: "requested",
    remarks: payload.remarks ?? "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inspections = [...inspections, inspection];
  return wait({ status: 201, data: inspection });
});

registerMock("patch", "/inspections/{id}", async (config, params) => {
  const index = inspections.findIndex((i) => i.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Inspection not found." } };
  }
  const patch = (config.data as InspectionPatch) ?? {};
  const errors = validatePatch(patch);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const updated: Inspection = {
    ...inspections[index],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  if (patch.status && !inspections[index].actual_date) {
    updated.actual_date = new Date().toISOString().split("T")[0];
  }
  inspections = inspections.map((i) => (i.id === params.id ? updated : i));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/inspections/{id}", async (_config, params) => {
  const index = inspections.findIndex((i) => i.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Inspection not found." } };
  }
  const [removed] = inspections.splice(index, 1);
  return wait({ status: 200, data: removed });
});