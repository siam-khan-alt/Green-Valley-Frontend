import { registerMock } from "@/services/mock/adapter";
import { DPR_WEATHER_OPTIONS } from "../constants";
import type {
  DailyProgressReport,
  DprPayload,
} from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

let dprs: DailyProgressReport[] = [];

function seed(): void {
  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  };

  dprs = [
    {
      id: "dpr_001",
      project_id: "p_001",
      work_package_id: "wp_p_001_01",
      work_package_code: "WP-01",
      work_package_name: "Mobilization & site setup",
      date: daysAgo(10),
      weather: "sunny",
      work_done: "Cleared vegetation and topsoil removal for 2,500 sqm",
      quantity_achieved: 2500,
      labor_entries: [
        { labor_type: "Unskilled", head_count: 12, hours_worked: 8, rate: 450 },
        { labor_type: "Semi-skilled", head_count: 4, hours_worked: 8, rate: 650 },
      ],
      machinery_entries: [
        { machinery_id: "mach_001", machinery_name: "Excavator 20T", hours_used: 8, rate: 2800 },
        { machinery_id: "mach_003", machinery_name: "Dump Truck 10T", hours_used: 6, rate: 1800 },
      ],
      notes: "Good progress. Ready for compaction tomorrow.",
      created_by: "Site Supervisor",
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: "dpr_002",
      project_id: "p_001",
      work_package_id: "wp_p_001_01",
      work_package_code: "WP-01",
      work_package_name: "Mobilization & site setup",
      date: daysAgo(9),
      weather: "cloudy",
      work_done: "Excavation and hauling for foundation trenches",
      quantity_achieved: 180,
      labor_entries: [
        { labor_type: "Unskilled", head_count: 10, hours_worked: 8, rate: 450 },
        { labor_type: "Skilled", head_count: 2, hours_worked: 8, rate: 900 },
      ],
      machinery_entries: [
        { machinery_id: "mach_001", machinery_name: "Excavator 20T", hours_used: 7, rate: 2800 },
      ],
      notes: "Slower due to light rain in afternoon.",
      created_by: "Site Supervisor",
      created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
    {
      id: "dpr_003",
      project_id: "p_001",
      work_package_id: "wp_p_001_02",
      work_package_code: "WP-02",
      work_package_name: "Piling & deep foundation",
      date: daysAgo(8),
      weather: "sunny",
      work_done: "Completed 4 bored piles (P-01 to P-04), concrete poured",
      quantity_achieved: 4,
      labor_entries: [
        { labor_type: "Skilled", head_count: 6, hours_worked: 10, rate: 900 },
        { labor_type: "Semi-skilled", head_count: 8, hours_worked: 10, rate: 650 },
      ],
      machinery_entries: [
        { machinery_id: "mach_004", machinery_name: "Piling Rig", hours_used: 10, rate: 5500 },
        { machinery_id: "mach_002", machinery_name: "Concrete Pump", hours_used: 6, rate: 3200 },
      ],
      notes: "All piles passed initial set. Awaiting 7-day cube test.",
      created_by: "Site Engineer",
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
  ];
}

seed();

function validate(payload: DprPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package_id) errors.work_package_id = ["Work package is required."];
  if (!payload.date) errors.date = ["Date is required."];
  if (!payload.weather || !DPR_WEATHER_OPTIONS.some((w) => w.value === payload.weather)) {
    errors.weather = ["Valid weather condition is required."];
  }
  if (!payload.work_done?.trim()) errors.work_done = ["Work done description is required."];
  if (payload.quantity_achieved === undefined || payload.quantity_achieved < 0) {
    errors.quantity_achieved = ["Quantity achieved must be a non-negative number."];
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

registerMock("get", "/projects/{projectId}/daily-reports", async (config, params) => {
  const projectId = params.projectId;
  const projectDprs = dprs.filter((d) => d.project_id === projectId).sort((a, b) => b.date.localeCompare(a.date));
  return wait({ status: 200, data: projectDprs });
});

registerMock("get", "/projects/{id}/progress", async (config, params) => {
  const projectId = params.id;
  const projectDprs = dprs.filter((d) => d.project_id === projectId).sort((a, b) => b.date.localeCompare(a.date));
  const progress: { date: string; percent_complete: number; notes?: string }[] = projectDprs.map((d) => {
    const laborCost = d.labor_entries.reduce((sum, e) => sum + e.head_count * e.hours_worked * e.rate, 0);
    const machineryCost = d.machinery_entries.reduce((sum, e) => sum + e.hours_used * e.rate, 0);
    const totalCost = laborCost + machineryCost;
    const wpCosts = projectDprs.filter((p) => p.work_package_id !== d.work_package_id).reduce((acc, p) => {
      const lp = p.labor_entries.reduce((s, e) => s + e.head_count * e.hours_worked * e.rate, 0);
      const mp = p.machinery_entries.reduce((s, e) => s + e.hours_used * e.rate, 0);
      return acc + lp + mp;
    }, 0);
    const total = totalCost + wpCosts;
    const pct = total > 0 ? Math.round((totalCost / total) * 100) : 0;
    return { date: d.date, percent_complete: pct, notes: d.notes };
  });
  return wait({ status: 200, data: progress });
});

registerMock("post", "/projects/{projectId}/dpr", async (config, params) => {
  const projectId = params.projectId;
  const payload = ((config.data as DprPayload) ?? {}) as DprPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const wp = getProjectWorkPackages().find((w) => w.id === payload.work_package_id);
  if (!wp) {
    return { status: 400, data: { work_package_id: ["Invalid work package."] } };
  }
  const dpr: DailyProgressReport = {
    id: `dpr_${Date.now().toString(36)}`,
    project_id: projectId,
    work_package_id: payload.work_package_id,
    work_package_code: wp.code,
    work_package_name: wp.name,
    date: payload.date,
    weather: payload.weather,
    work_done: payload.work_done,
    quantity_achieved: payload.quantity_achieved,
    labor_entries: payload.labor_entries ?? [],
    machinery_entries: payload.machinery_entries ?? [],
    notes: payload.notes ?? "",
    created_by: "Current User",
    created_at: new Date().toISOString(),
  };
  dprs = [...dprs, dpr];
  return wait({ status: 201, data: dpr });
});

registerMock("patch", "/dpr/{id}", async (config, params) => {
  const index = dprs.findIndex((d) => d.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "DPR not found." } };
  }
  const patch = ((config.data as Partial<DprPayload>) ?? {}) as Partial<DprPayload>;
  const updated: DailyProgressReport = { ...dprs[index], ...patch };
  dprs = dprs.map((d) => (d.id === params.id ? updated : d));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/dpr/{id}", async (_config, params) => {
  const index = dprs.findIndex((d) => d.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "DPR not found." } };
  }
  const [removed] = dprs.splice(index, 1);
  return wait({ status: 200, data: removed });
});