import { registerMock } from "@/services/mock/adapter";
import type {
  Project,
  ProjectPayload,
  ProjectSummary,
} from "../types";

let store: Project[] = seedProjects();

function seedProjects(): Project[] {
  return [
    {
      id: "p_001",
      name: "Green Valley Heights",
      type: "residential",
      location: "Uttara, Dhaka",
      status: "active",
      budget: 480_000_000,
      actual_cost: 296_000_000,
      forecast_final_cost: 465_000_000,
      expected_profit: 15_000_000,
      progress_pct: 62.5,
      description:
        "12-storied premium residential tower with 2 basements, rooftop amenities, and smart-home standard finishing.",
      start_date: "2025-01-15",
      end_date: "2027-06-30",
      client: "Green Valley Properties Ltd.",
      area_sqft: 185_000,
      units: 96,
    },
    {
      id: "p_002",
      name: "Shyamoli Breeze Residency",
      type: "residential",
      location: "Shyamoli, Dhaka",
      status: "delayed",
      budget: 290_000_000,
      actual_cost: 214_000_000,
      forecast_final_cost: 305_000_000,
      expected_profit: -15_000_000,
      progress_pct: 48,
      description:
        "Mid-rise apartment complex; foundation works delayed by groundwater issues, revised schedule under review.",
      start_date: "2024-06-01",
      end_date: "2026-12-31",
      client: "Breeze Development Co.",
      area_sqft: 118_000,
      units: 64,
    },
    {
      id: "p_003",
      name: "City Point Commercial",
      type: "commercial",
      location: "Gulshan, Dhaka",
      status: "active",
      budget: 720_000_000,
      actual_cost: 330_000_000,
      forecast_final_cost: 705_000_000,
      expected_profit: 15_000_000,
      progress_pct: 44,
      description:
        "Grade-A office tower with basement parking, retail podium, and central HVAC for rental investment.",
      start_date: "2025-07-01",
      end_date: "2028-03-31",
      client: "CityPoint Holdings",
      area_sqft: 320_000,
      units: 40,
    },
    {
      id: "p_004",
      name: "Old Town Revival",
      type: "mixed_use",
      location: "Wari, Dhaka",
      status: "planning",
      budget: 160_000_000,
      actual_cost: 8_000_000,
      forecast_final_cost: 160_000_000,
      expected_profit: 0,
      progress_pct: 5,
      description:
        "Regeneration of a heritage block into retail arcade plus residential lofts; BOQ under preparation.",
      start_date: "2026-10-01",
      end_date: "2028-09-30",
      client: "Old Town Development Trust",
      area_sqft: 74_000,
      units: 28,
    },
    {
      id: "p_005",
      name: "Riverside Crest Ph-1",
      type: "residential",
      location: "Badda, Dhaka",
      status: "completed",
      budget: 350_000_000,
      actual_cost: 332_000_000,
      forecast_final_cost: 334_000_000,
      expected_profit: 16_000_000,
      progress_pct: 100,
      description:
        "Completed riverfront housing society; final handover and snag-resolution completed June 2026.",
      start_date: "2023-03-15",
      end_date: "2026-06-15",
      client: "Riverside Cooperative",
      area_sqft: 142_000,
      units: 80,
    },
    {
      id: "p_006",
      name: "Bypass Logistics Hub",
      type: "infrastructure",
      location: "Savar, Dhaka",
      status: "active",
      budget: 610_000_000,
      actual_cost: 245_000_000,
      forecast_final_cost: 625_000_000,
      expected_profit: -15_000_000,
      progress_pct: 37,
      description:
        "Warehouse and distribution campus with approach roads and utilities; steel procurement variance active.",
      start_date: "2025-02-01",
      end_date: "2027-12-31",
      client: "LogiChain Bangladesh",
      area_sqft: 410_000,
      units: 6,
    },
  ];
}

function wait<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function toSummary(project: Project): ProjectSummary {
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    location: project.location,
    status: project.status,
    budget: project.budget,
    actual_cost: project.actual_cost,
    forecast_final_cost: project.forecast_final_cost,
    expected_profit: project.expected_profit,
    progress_pct: project.progress_pct,
  };
}

function nextId(): string {
  return `p_${Date.now().toString(36)}`;
}

function validate(
  payload: Partial<ProjectPayload>
): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  if (!payload.name?.trim()) fields.name = ["This field is required."];
  if (!payload.client?.trim()) fields.client = ["This field is required."];
  if (!payload.location?.trim()) fields.location = ["This field is required."];
  if (typeof payload.budget === "number" && payload.budget <= 0) {
    fields.budget = ["Budget must be greater than zero."];
  }
  if (payload.start_date && payload.end_date && payload.start_date > payload.end_date) {
    fields.start_date = ["Start date must be before end date."];
  }
  return fields;
}

async function listProjects(page: number, page_size: number, status?: string) {
  const filtered = status ? store.filter((p) => p.status === status) : store;
  const start = (page - 1) * page_size;
  const results = filtered.slice(start, start + page_size).map(toSummary);
  return wait({
    count: filtered.length,
    next:
      start + page_size < filtered.length
        ? `/api/v1/projects/?page=${page + 1}&page_size=${page_size}`
        : null,
    previous: page > 1 ? `/api/v1/projects/?page=${page - 1}&page_size=${page_size}` : null,
    results,
  });
}

async function getProject(id: string) {
  const project = store.find((p) => p.id === id);
  if (!project) {
    return { status: 404, data: { detail: "Project not found." } };
  }
  return wait({ status: 200, data: project });
}

async function createProject(payload: ProjectPayload) {
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const project: Project = {
    id: nextId(),
    name: payload.name,
    type: payload.type,
    location: payload.location,
    status: payload.status,
    budget: payload.budget,
    actual_cost: 0,
    forecast_final_cost: payload.budget,
    expected_profit: 0,
    progress_pct: 0,
    description: payload.description,
    start_date: payload.start_date,
    end_date: payload.end_date,
    client: payload.client,
    area_sqft: payload.area_sqft,
    units: payload.units,
  };
  store = [project, ...store];
  return wait({ status: 201, data: project });
}

async function updateProject(id: string, payload: Partial<ProjectPayload>) {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) {
    return { status: 404, data: { detail: "Project not found." } };
  }
  const errors = validate({ ...store[index], ...payload });
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const updated: Project = { ...store[index], ...payload };
  store = store.map((p) => (p.id === id ? updated : p));
  return wait({ status: 200, data: updated });
}

async function deleteProject(id: string) {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) {
    return { status: 404, data: { detail: "Project not found." } };
  }
  store = store.filter((p) => p.id !== id);
  return wait({ status: 204, data: null });
}

registerMock("get", "/projects", async (config) => {
  const params = (config.params ?? {}) as { page?: string; page_size?: string; status?: string };
  const page = Number(params.page ?? 1);
  const page_size = Number(params.page_size ?? 10);
  const status = params.status || undefined;
  const data = await listProjects(page, page_size, status);
  return { status: 200, data };
});

registerMock("post", "/projects", async (config) =>
  createProject((config.data as ProjectPayload) ?? {})
);

registerMock("get", "/projects/{id}", async (_config, params) =>
  getProject(params.id)
);

registerMock("patch", "/projects/{id}", async (config, params) =>
  updateProject(params.id, (config.data as Partial<ProjectPayload>) ?? {})
);

registerMock("delete", "/projects/{id}", async (_config, params) =>
  deleteProject(params.id)
);