import { registerMock } from "@/services/mock/adapter";
import type {
  PortfolioReport,
  ProjectReport,
  ProjectReportActivity,
} from "../types";

interface ProjectSeed {
  name: string;
  type: string;
  status: string;
  budget: number;
  actual_cost: number;
  forecast_final_cost: number;
  expected_profit: number;
  progress_pct: number;
}

const projectSeeds: Record<string, ProjectSeed> = {
  p_001: {
    name: "Green Valley Heights",
    type: "residential",
    status: "active",
    budget: 480_000_000,
    actual_cost: 296_000_000,
    forecast_final_cost: 465_000_000,
    expected_profit: 15_000_000,
    progress_pct: 62.5,
  },
  p_002: {
    name: "Shyamoli Breeze Residency",
    type: "residential",
    status: "delayed",
    budget: 290_000_000,
    actual_cost: 214_000_000,
    forecast_final_cost: 305_000_000,
    expected_profit: -15_000_000,
    progress_pct: 48,
  },
  p_003: {
    name: "City Point Commercial",
    type: "commercial",
    status: "active",
    budget: 720_000_000,
    actual_cost: 330_000_000,
    forecast_final_cost: 705_000_000,
    expected_profit: 15_000_000,
    progress_pct: 44,
  },
  p_004: {
    name: "Old Town Revival",
    type: "mixed_use",
    status: "planning",
    budget: 160_000_000,
    actual_cost: 8_000_000,
    forecast_final_cost: 160_000_000,
    expected_profit: 0,
    progress_pct: 5,
  },
  p_005: {
    name: "Riverside Crest Ph-1",
    type: "residential",
    status: "completed",
    budget: 350_000_000,
    actual_cost: 332_000_000,
    forecast_final_cost: 334_000_000,
    expected_profit: 16_000_000,
    progress_pct: 100,
  },
  p_006: {
    name: "Bypass Logistics Hub",
    type: "infrastructure",
    status: "active",
    budget: 610_000_000,
    actual_cost: 245_000_000,
    forecast_final_cost: 625_000_000,
    expected_profit: -15_000_000,
    progress_pct: 37,
  },
};

function projectCostBreakdown(projectId: string) {
  const seeds: Record<string, { category: string; budget: number; actual: number }[]> = {
    p_001: [
      { category: "materials", budget: 218_000_000, actual: 118_000_000 },
      { category: "labor", budget: 92_000_000, actual: 61_000_000 },
      { category: "contractor", budget: 124_000_000, actual: 88_000_000 },
      { category: "overhead", budget: 46_000_000, actual: 29_000_000 },
    ],
    p_002: [
      { category: "materials", budget: 121_000_000, actual: 84_000_000 },
      { category: "labor", budget: 58_000_000, actual: 47_000_000 },
      { category: "contractor", budget: 82_000_000, actual: 63_000_000 },
      { category: "overhead", budget: 29_000_000, actual: 20_000_000 },
    ],
    p_003: [
      { category: "materials", budget: 338_000_000, actual: 142_000_000 },
      { category: "labor", budget: 118_000_000, actual: 61_000_000 },
      { category: "contractor", budget: 192_000_000, actual: 96_000_000 },
      { category: "overhead", budget: 72_000_000, actual: 31_000_000 },
    ],
  };
  return seeds[projectId] ?? [];
}

function projectProgressSeries(projectId: string) {
  const seeds: Record<string, { date: string; percent_complete: number; cost: number }[]> = {
    p_001: [
      { date: "2025-02-28", percent_complete: 6, cost: 28_000_000 },
      { date: "2025-05-31", percent_complete: 14, cost: 66_000_000 },
      { date: "2025-08-31", percent_complete: 26, cost: 123_000_000 },
      { date: "2025-11-30", percent_complete: 38, cost: 180_000_000 },
      { date: "2026-02-28", percent_complete: 50, cost: 237_000_000 },
      { date: "2026-05-31", percent_complete: 62, cost: 296_000_000 },
    ],
    p_002: [
      { date: "2024-09-30", percent_complete: 15, cost: 68_000_000 },
      { date: "2024-12-31", percent_complete: 28, cost: 124_000_000 },
      { date: "2025-03-31", percent_complete: 34, cost: 158_000_000 },
      { date: "2025-09-30", percent_complete: 42, cost: 189_000_000 },
      { date: "2026-02-28", percent_complete: 48, cost: 214_000_000 },
    ],
    p_003: [
      { date: "2025-09-30", percent_complete: 12, cost: 90_000_000 },
      { date: "2025-12-31", percent_complete: 25, cost: 186_000_000 },
      { date: "2026-03-31", percent_complete: 36, cost: 267_000_000 },
      { date: "2026-06-30", percent_complete: 44, cost: 330_000_000 },
    ],
    p_006: [
      { date: "2025-06-30", percent_complete: 14, cost: 92_000_000 },
      { date: "2025-10-31", percent_complete: 25, cost: 164_000_000 },
      { date: "2026-02-28", percent_complete: 31, cost: 205_000_000 },
    ],
  };
  return seeds[projectId] ?? [];
}

function projectActivity(projectId: string): ProjectReportActivity[] {
  const seeds: Record<string, ProjectReportActivity[]> = {
    p_001: [
      {
        id: "po_002",
        type: "purchase_order",
        summary: "Reinforcement steel (60 grade)",
        amount: 79_200_000,
        date: "2025-05-10",
        status: "received",
      },
      {
        id: "rab_001",
        type: "ra_bill",
        summary: "RA Bill #T-2026-001",
        amount: 12_711_500,
        date: "2026-03-05",
        status: "approved",
      },
      {
        id: "mea_001",
        type: "measurement",
        summary: "Superstructure slabs & columns — slab S1",
        amount: 7_800_000,
        date: "2026-02-18",
        status: "approved",
      },
      {
        id: "po_001",
        type: "purchase_order",
        summary: "Ready-mix concrete M28",
        amount: 64_750_000,
        date: "2025-10-20",
        status: "partially_received",
      },
      {
        id: "pay_001_05",
        type: "payment",
        summary: "Green Valley Properties Ltd. — RA bill settlement",
        amount: 11_936_500,
        date: "2026-09-08",
        status: "completed",
      },
      {
        id: "var_001_01",
        type: "variation",
        summary: "Client requested additional balcony glazing on levels 3–8",
        amount: 3_200_000,
        date: "2026-04-12",
        status: "approved",
      },
    ],
    p_002: [
      {
        id: "po_001",
        type: "purchase_order",
        summary: "Roof insulation boards",
        amount: 4_440_000,
        date: "2026-03-10",
        status: "issued",
      },
      {
        id: "rab_003",
        type: "ra_bill",
        summary: "RA Bill #B-2026-003",
        amount: 570_000,
        date: "2026-06-22",
        status: "approved",
      },
    ],
    p_003: [
      {
        id: "po_004",
        type: "purchase_order",
        summary: "MEP rough-in allowance",
        amount: 22_000_000,
        date: "2026-01-05",
        status: "issued",
      },
      {
        id: "exp_003_02",
        type: "expense",
        summary: "Foundation contractor advance recovery",
        amount: 5_200_000,
        date: "2026-08-24",
        status: "recorded",
      },
    ],
  };
  return seeds[projectId] ?? [];
}

function buildPortfolio(): PortfolioReport {
  const projects = Object.entries(projectSeeds).map(([id, seed]) => ({
    id,
    ...seed,
  }));
  return {
    total_budget: projects.reduce((s, p) => s + p.budget, 0),
    total_actual_cost: projects.reduce((s, p) => s + p.actual_cost, 0),
    total_forecast_final_cost: projects.reduce((s, p) => s + p.forecast_final_cost, 0),
    total_expected_profit: projects.reduce((s, p) => s + p.expected_profit, 0),
    projects,
  };
}

function buildProjectReport(projectId: string): ProjectReport {
  return {
    cost_breakdown: projectCostBreakdown(projectId),
    progress_series: projectProgressSeries(projectId),
    recent_activity: projectActivity(projectId),
  };
}

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 100 + Math.random() * 150);
  });
}

registerMock("get", "/reports/portfolio", async () =>
  wait({ status: 200, data: buildPortfolio() })
);

registerMock("get", "/projects/{id}/reports", async (_config, params) =>
  wait({ status: 200, data: buildProjectReport(params.id) })
);