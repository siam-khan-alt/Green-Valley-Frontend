import { registerMock } from "@/services/mock/adapter";
import { CONTRACTOR_TYPES } from "../constants";
import type { Contractor, ContractorPayload } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

let contractors: Contractor[] = [];

function seed(): void {
  contractors = [
    { id: "ctr_001", name: "Apex Construction", type: "contractor", contact_info: "01716-778899 · apex.construction@bdmail.com · Gulshan, Dhaka" },
    { id: "ctr_002", name: "Foundation Experts Ltd.", type: "subcontractor", contact_info: "01717-889900 · piling@foundationex.com · Tejgaon, Dhaka" },
    { id: "ctr_003", name: "Rongdhonu Builders", type: "contractor", contact_info: "01718-990011 · rongdhonu.bd@gmail.com · Uttara, Dhaka" },
    { id: "ctr_004", name: "Powerline MEP", type: "subcontractor", contact_info: "01719-112233 · mep@powerlinebd.com · Banani, Dhaka" },
    { id: "ctr_005", name: "InteriorPro Bangladesh", type: "subcontractor", contact_info: "01720-223344 · hello@interiorpro.bd · Dhanmondi, Dhaka" },
    { id: "ctr_006", name: "GreenScape Ltd.", type: "subcontractor", contact_info: "01721-334455 · landscape@greenscape.bd · Baridhara, Dhaka" },
    { id: "ctr_007", name: "RoadTek Builders", type: "contractor", contact_info: "01722-445566 · info@roadtek.com.bd · Mirpur, Dhaka" },
    { id: "ctr_008", name: "SteelTech Industries", type: "subcontractor", contact_info: "01723-556677 · steel@steeltech.bd · Savar, Dhaka" },
    { id: "ctr_009", name: "Studio Veranda", type: "subcontractor", contact_info: "01724-667788 · studio@veranda.design · Gulshan, Dhaka" },
  ];
}

seed();

function validate(payload: ContractorPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.name?.trim()) errors.name = ["Name is required."];
  if (!payload.type || !CONTRACTOR_TYPES.includes(payload.type)) {
    errors.type = ["Type must be contractor or subcontractor."];
  }
  return errors;
}

registerMock("get", "/contractors", async () => {
  return wait({ status: 200, data: contractors });
});

registerMock("post", "/contractors", async (config) => {
  const payload = ((config.data as ContractorPayload) ?? {}) as ContractorPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const contractor: Contractor = {
    id: `ctr_${Date.now().toString(36)}`,
    ...payload,
  };
  contractors = [...contractors, contractor];
  return wait({ status: 201, data: contractor });
});

registerMock("patch", "/contractors/{id}", async (config, params) => {
  const index = contractors.findIndex((c) => c.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Contractor not found." } };
  }
  const patch = ((config.data as Partial<ContractorPayload>) ?? {}) as Partial<ContractorPayload>;
  const updated: Contractor = { ...contractors[index], ...patch };
  contractors = contractors.map((c) => (c.id === params.id ? updated : c));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/contractors/{id}", async (_config, params) => {
  const index = contractors.findIndex((c) => c.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Contractor not found." } };
  }
  const [removed] = contractors.splice(index, 1);
  return wait({ status: 200, data: removed });
});