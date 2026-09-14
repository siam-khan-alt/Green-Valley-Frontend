import { registerMock } from "@/services/mock/adapter";
import { boqItemAmount } from "../constants";
import type { Boq, BoqItem, BoqItemPayload } from "../types";

interface BoqRecord {
  boq_id: string;
  project_id: string;
  version: string;
  items: BoqItem[];
}

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 180 + Math.random() * 220);
  });
}

const boqStore = new Map<string, BoqRecord>();

function seed(): void {
  const mk = (
    boqId: string,
    projectId: string,
    version: string,
    items: Array<Omit<BoqItem, "id" | "boq_id" | "amount">>
  ): void => {
    const record: BoqRecord = {
      boq_id: boqId,
      project_id: projectId,
      version,
      items: items.map((i, index) => ({
        ...i,
        id: `bi_${projectId}_${index + 1}`,
        boq_id: boqId,
        amount: boqItemAmount(i.quantity, i.rate),
      })),
    };
    boqStore.set(projectId, record);
  };

  mk("boq_1", "p_001", "v1.2", [
    { work_package: "wp_001_01", material: "Site establishment & temporary works", description: "Office, store, water & power connection for the site", unit: "no", quantity: 1, rate: 8000000 },
    { work_package: "wp_001_01", material: "GI sheet hoarding & signboards", description: "Perimeter security hoarding with project signboards", unit: "rft", quantity: 900, rate: 3500 },
    { work_package: "wp_001_02", material: "Excavation & earthwork", description: "Basement excavation including dewatering and backfill", unit: "cum", quantity: 12500, rate: 850 },
    { work_package: "wp_001_02", material: "Bored piles (600 mm dia)", description: "Cast-in-situ bored pile with M30 concrete, 45 m avg depth", unit: "rft", quantity: 5200, rate: 7600 },
    { work_package: "wp_001_02", material: "Pile caps & grade beams", description: "M30 reinforced pile caps and grade beams", unit: "cum", quantity: 1150, rate: 21000 },
    { work_package: "wp_001_02", material: "Reinforcement steel — foundation", description: "MS bar (60 grade) cutting, bending and fixing", unit: "ton", quantity: 480, rate: 165000 },
    { work_package: "wp_001_03", material: "Basement structure RCC", description: "Basement slabs, columns and retaining walls M30", unit: "cum", quantity: 1980, rate: 20500 },
    { work_package: "wp_001_03", material: "Waterproofing membrane", description: "Self-adhesive waterproofing on basement walls and slabs", unit: "sft", quantity: 82000, rate: 260 },
    { work_package: "wp_001_04", material: "Superstructure concrete", description: "Columns, beams and flat slabs M28 by ready-mix", unit: "cum", quantity: 3500, rate: 18500 },
    { work_package: "wp_001_04", material: "Reinforcement steel — superstructure", description: "MS bar (60 grade) for columns, beams and slabs", unit: "ton", quantity: 420, rate: 165000 },
    { work_package: "wp_001_04", material: "Formwork", description: "Timber/plywood formwork for slabs and beams", unit: "sft", quantity: 62000, rate: 480 },
    { work_package: "wp_001_05", material: "Brickwork 7.5 in wall", description: "First class brick wall with cement mortar 1:6", unit: "cft", quantity: 68000, rate: 320 },
    { work_package: "wp_001_05", material: "Cement plaster", description: "12 mm internal plaster and 20 mm external plaster", unit: "sft", quantity: 92000, rate: 95 },
    { work_package: "wp_001_06", material: "MEP rough-in allowance", description: "Electrical, plumbing and HVAC rough-in works", unit: "no", quantity: 1, rate: 22000000 },
    { work_package: "wp_001_07", material: "Flooring & tiles", description: "Vitrified tiles and granite flooring", unit: "sft", quantity: 48000, rate: 520 },
    { work_package: "wp_001_07", material: "Paint & finishes", description: "Putty, emulsion and two-coat finishing paint", unit: "sft", quantity: 130000, rate: 105 },
    { work_package: "wp_001_07", material: "Windows & glazing", description: "uPVC windows with double-glazed glass", unit: "sft", quantity: 9600, rate: 3400 },
    { work_package: "wp_001_08", material: "External works & landscaping", description: "PCC road, boundary wall, plantation and finishing", unit: "no", quantity: 1, rate: 9500000 },
  ]);

  mk("boq_2", "p_002", "v1.0", [
    { work_package: "wp_002_01", material: "Site clearance & leveling", description: "Clearing, grubbing and leveling of the site", unit: "no", quantity: 1, rate: 600000 },
    { work_package: "wp_002_02", material: "Strip foundation PCC", description: "Plain cement concrete under foundations", unit: "cum", quantity: 420, rate: 14500 },
    { work_package: "wp_002_02", material: "Ground beam RCC", description: "Reinforced ground beams M25", unit: "cum", quantity: 310, rate: 19500 },
    { work_package: "wp_002_03", material: "Column & slab RCC", description: "Ground floor columns and roof slab M25", unit: "cum", quantity: 520, rate: 18300 },
    { work_package: "wp_002_03", material: "Roof insulation", description: "Compressed polystyrene insulation with screed", unit: "sft", quantity: 18500, rate: 240 },
  ]);

  mk("boq_3", "p_003", "v1.0", [
    { work_package: "wp_003_01", material: "Tower crane & hoarding", description: "Tower crane hire, hoarding and site office", unit: "no", quantity: 1, rate: 4200000 },
    { work_package: "wp_003_02", material: "Raft foundation RCC", description: "Full raft foundation M35 waterproofing concrete", unit: "cum", quantity: 2100, rate: 22800 },
    { work_package: "wp_003_02", material: "Reinforcement steel", description: "MS bar (60 grade) for raft foundation", unit: "ton", quantity: 540, rate: 165000 },
    { work_package: "wp_003_03", material: "Core & shear wall concrete", description: "Core walls and lift shafts M35 by ready-mix", unit: "cum", quantity: 1450, rate: 20500 },
  ]);

  mk("boq_4", "p_004", "v1.0", []);
  mk("boq_5", "p_005", "v1.0", []);
  mk("boq_6", "p_006", "v1.0", []);
}

seed();

function getRecord(projectId: string): BoqRecord {
  let record = boqStore.get(projectId);
  if (!record) {
    record = { boq_id: `boq_${boqStore.size + 1}`, project_id: projectId, version: "v1.0", items: [] };
    boqStore.set(projectId, record);
  }
  return record;
}

function validate(payload: BoqItemPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package) errors.work_package = ["Select a work package."];
  if (!payload.material?.trim()) errors.material = ["Material / item is required."];
  if (!payload.unit) errors.unit = ["Select a unit."];
  if (!(payload.quantity > 0)) errors.quantity = ["Quantity must be greater than zero."];
  if (!(payload.rate > 0)) errors.rate = ["Rate must be greater than zero."];
  return errors;
}

registerMock("get", "/projects/{id}/boq", async (_config, params) => {
  const record: Boq = getRecord(params.id);
  return wait({ status: 200, data: record });
});

registerMock("post", "/projects/{id}/boq/items", async (config, params) => {
  const payload = ((config.data as BoqItemPayload) ?? {}) as BoqItemPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const record = getRecord(params.id);
  const item: BoqItem = {
    ...payload,
    id: `bi_${Date.now().toString(36)}_${record.items.length + 1}`,
    boq_id: record.boq_id,
    amount: boqItemAmount(payload.quantity, payload.rate),
  };
  record.items.push(item);
  return wait({ status: 201, data: item });
});

registerMock("patch", "/boq-items/{id}", async (config, params) => {
  const patch = ((config.data as Partial<BoqItemPayload>) ?? {}) as Partial<BoqItemPayload>;
  for (const record of boqStore.values()) {
    const item = record.items.find((i) => i.id === params.id);
    if (item) {
      Object.assign(item, patch);
      item.amount = boqItemAmount(item.quantity, item.rate);
      return wait({ status: 200, data: item });
    }
  }
  return { status: 404, data: { detail: "BOQ item not found." } };
});

registerMock("delete", "/boq-items/{id}", async (_config, params) => {
  for (const record of boqStore.values()) {
    const index = record.items.findIndex((i) => i.id === params.id);
    if (index >= 0) {
      const [removed] = record.items.splice(index, 1);
      return wait({ status: 200, data: removed });
    }
  }
  return { status: 404, data: { detail: "BOQ item not found." } };
});