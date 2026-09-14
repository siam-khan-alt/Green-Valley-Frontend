import { registerMock } from "@/services/mock/adapter";
import type { Material, MaterialPayload } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

let materials: Material[] = [];

function seed(): void {
  materials = [
    { id: "mat_001", name: "Portland cement (50 kg bag)", unit: "no", default_rate: 720 },
    { id: "mat_002", name: "MS reinforcement bar (60 grade)", unit: "ton", default_rate: 165000 },
    { id: "mat_003", name: "First class brick", unit: "cft", default_rate: 48 },
    { id: "mat_004", name: "River sand", unit: "cft", default_rate: 55 },
    { id: "mat_005", name: "Stone aggregate (3/4 in)", unit: "cft", default_rate: 65 },
    { id: "mat_006", name: "Ready-mix concrete M28", unit: "cum", default_rate: 18500 },
    { id: "mat_007", name: "Ready-mix concrete M30", unit: "cum", default_rate: 19500 },
    { id: "mat_008", name: "Vitrified tile 600×600", unit: "sft", default_rate: 185 },
    { id: "mat_009", name: "uPVC window with glazing", unit: "sft", default_rate: 3400 },
    { id: "mat_010", name: "Self-adhesive waterproofing membrane", unit: "sft", default_rate: 260 },
  ];
}

seed();

function validate(payload: MaterialPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.name?.trim()) errors.name = ["Name is required."];
  if (!payload.unit) errors.unit = ["Select a unit."];
  if (!(payload.default_rate > 0)) errors.default_rate = ["Default rate must be greater than zero."];
  return errors;
}

registerMock("get", "/materials", async () => {
  return wait({ status: 200, data: materials });
});

registerMock("post", "/materials", async (config) => {
  const payload = ((config.data as MaterialPayload) ?? {}) as MaterialPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const material: Material = {
    id: `mat_${Date.now().toString(36)}`,
    ...payload,
  };
  materials = [...materials, material];
  return wait({ status: 201, data: material });
});

registerMock("patch", "/materials/{id}", async (config, params) => {
  const index = materials.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Material not found." } };
  }
  const patch = ((config.data as Partial<MaterialPayload>) ?? {}) as Partial<MaterialPayload>;
  const updated: Material = { ...materials[index], ...patch };
  materials = materials.map((m) => (m.id === params.id ? updated : m));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/materials/{id}", async (_config, params) => {
  const index = materials.findIndex((m) => m.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Material not found." } };
  }
  const [removed] = materials.splice(index, 1);
  return wait({ status: 200, data: removed });
});