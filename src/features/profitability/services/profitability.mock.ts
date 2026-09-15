import { registerMock } from "@/services/mock/adapter";
import type {
  Profitability,
  SimulationInput,
  SimulationResult,
} from "../types";

interface ProfitabilitySeed {
  budget: number;
  actual_cost: number;
  forecast_final_cost: number;
  expected_profit: number;
  cost_breakdown: { category: string; budget: number; actual: number }[];
  work_packages: { id: string; progress_pct: number; labor_cost: number; po_cost: number; ra_bill_value: number }[];
  daily_overhead: number;
  material_share: number;
}

const profitabilitySeeds: Record<string, ProfitabilitySeed> = {
  p_001: {
    budget: 480_000_000,
    actual_cost: 296_000_000,
    forecast_final_cost: 465_000_000,
    expected_profit: 15_000_000,
    daily_overhead: 240_000,
    material_share: 0.44,
    cost_breakdown: [
      { category: "materials", budget: 218_000_000, actual: 118_000_000 },
      { category: "labor", budget: 92_000_000, actual: 61_000_000 },
      { category: "contractor", budget: 124_000_000, actual: 88_000_000 },
      { category: "overhead", budget: 46_000_000, actual: 29_000_000 },
    ],
    work_packages: [
      { id: "wp_p_001_01", progress_pct: 100, labor_cost: 1_400_000, po_cost: 2_100_000, ra_bill_value: 3_200_000 },
      { id: "wp_p_001_02", progress_pct: 100, labor_cost: 8_600_000, po_cost: 28_400_000, ra_bill_value: 34_900_000 },
      { id: "wp_p_001_03", progress_pct: 82, labor_cost: 12_300_000, po_cost: 41_200_000, ra_bill_value: 49_500_000 },
      { id: "wp_p_001_04", progress_pct: 58, labor_cost: 16_800_000, po_cost: 87_500_000, ra_bill_value: 61_200_000 },
      { id: "wp_p_001_05", progress_pct: 21, labor_cost: 6_400_000, po_cost: 14_800_000, ra_bill_value: 8_100_000 },
      { id: "wp_p_001_06", progress_pct: 35, labor_cost: 7_900_000, po_cost: 22_000_000, ra_bill_value: 18_400_000 },
      { id: "wp_p_001_07", progress_pct: 12, labor_cost: 4_200_000, po_cost: 6_500_000, ra_bill_value: 0 },
      { id: "wp_p_001_08", progress_pct: 5, labor_cost: 1_100_000, po_cost: 1_900_000, ra_bill_value: 0 },
    ],
  },
  p_002: {
    budget: 290_000_000,
    actual_cost: 214_000_000,
    forecast_final_cost: 305_000_000,
    expected_profit: -15_000_000,
    daily_overhead: 180_000,
    material_share: 0.42,
    cost_breakdown: [
      { category: "materials", budget: 121_000_000, actual: 84_000_000 },
      { category: "labor", budget: 58_000_000, actual: 47_000_000 },
      { category: "contractor", budget: 82_000_000, actual: 63_000_000 },
      { category: "overhead", budget: 29_000_000, actual: 20_000_000 },
    ],
    work_packages: [
      { id: "wp_p_002_01", progress_pct: 100, labor_cost: 2_100_000, po_cost: 3_400_000, ra_bill_value: 4_800_000 },
      { id: "wp_p_002_02", progress_pct: 76, labor_cost: 9_800_000, po_cost: 24_600_000, ra_bill_value: 28_700_000 },
      { id: "wp_p_002_03", progress_pct: 41, labor_cost: 7_400_000, po_cost: 15_200_000, ra_bill_value: 12_900_000 },
    ],
  },
  p_003: {
    budget: 720_000_000,
    actual_cost: 330_000_000,
    forecast_final_cost: 705_000_000,
    expected_profit: 15_000_000,
    daily_overhead: 310_000,
    material_share: 0.47,
    cost_breakdown: [
      { category: "materials", budget: 338_000_000, actual: 142_000_000 },
      { category: "labor", budget: 118_000_000, actual: 61_000_000 },
      { category: "contractor", budget: 192_000_000, actual: 96_000_000 },
      { category: "overhead", budget: 72_000_000, actual: 31_000_000 },
    ],
    work_packages: [
      { id: "wp_p_003_01", progress_pct: 88, labor_cost: 4_900_000, po_cost: 62_300_000, ra_bill_value: 58_600_000 },
      { id: "wp_p_003_02", progress_pct: 34, labor_cost: 6_700_000, po_cost: 29_800_000, ra_bill_value: 22_400_000 },
    ],
  },
};

const defaultSeed: ProfitabilitySeed = {
  budget: 0,
  actual_cost: 0,
  forecast_final_cost: 0,
  expected_profit: 0,
  daily_overhead: 150_000,
  material_share: 0.4,
  cost_breakdown: [
    { category: "materials", budget: 0, actual: 0 },
    { category: "labor", budget: 0, actual: 0 },
    { category: "contractor", budget: 0, actual: 0 },
    { category: "overhead", budget: 0, actual: 0 },
    { category: "other", budget: 0, actual: 0 },
  ],
  work_packages: [],
};

function buildProfitability(seed: ProfitabilitySeed): Profitability {
  return {
    budget: seed.budget,
    actual_cost: seed.actual_cost,
    forecast_final_cost: seed.forecast_final_cost,
    expected_profit: seed.expected_profit,
    budget_variance: seed.budget - seed.forecast_final_cost,
    cost_breakdown: seed.cost_breakdown,
    work_packages: seed.work_packages,
  };
}

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 100 + Math.random() * 150);
  });
}

registerMock("get", "/projects/{id}/profitability", async (_config, params) => {
  const seed = profitabilitySeeds[params.id] ?? defaultSeed;
  return wait({ status: 200, data: buildProfitability(seed) });
});

registerMock("post", "/projects/{id}/profitability/simulate", async (config, params) => {
  const input = ((config.data as SimulationInput) ?? {}) as SimulationInput;
  const seed = profitabilitySeeds[params.id] ?? defaultSeed;

  const materialPct = Math.max(0, input.material_price_change_pct ?? 0);
  const delayDays = Math.max(0, input.delay_days ?? 0);
  const extraVariation = Math.max(0, input.extra_variation_cost ?? 0);

  const materialChange = seed.forecast_final_cost * seed.material_share * (materialPct / 100);
  const delayChange = delayDays * seed.daily_overhead;
  const costChange = Math.round(materialChange + delayChange + extraVariation);

  const result: SimulationResult = {
    baseline: {
      forecast_final_cost: seed.forecast_final_cost,
      expected_profit: seed.expected_profit,
    },
    simulated: {
      forecast_final_cost: seed.forecast_final_cost + costChange,
      expected_profit: seed.expected_profit - costChange,
    },
    delta: {
      cost_change: costChange,
      profit_change: -costChange,
    },
  };
  return wait({ status: 200, data: result });
});