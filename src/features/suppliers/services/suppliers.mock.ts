import { registerMock } from "@/services/mock/adapter";
import type { Supplier, SupplierPayload } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

let suppliers: Supplier[] = [];

function seed(): void {
  suppliers = [
    { id: "sup_001", name: "Bashundhara Steel", contact_info: "01711-222333 · steel@bsbd.com · Tejgaon, Dhaka" },
    { id: "sup_002", name: "Meghna Ready-Mix Ltd.", contact_info: "01712-334455 · sales@meghnarcc.com · Narayanganj" },
    { id: "sup_003", name: "Premier Cement Mills", contact_info: "09611-717171 · dhaka@premiercement.com" },
    { id: "sup_004", name: "RFL Building Solutions", contact_info: "01713-445566 · b2b@rflbd.com · Uttara, Dhaka" },
    { id: "sup_005", name: "Uttara Electricals Ltd.", contact_info: "01714-556677 · uttara.elec@bdmail.com" },
    { id: "sup_006", name: "Apex Building Materials", contact_info: "01715-667788 · apex.bm@gmail.com · Banani, Dhaka" },
  ];
}

seed();

function validate(payload: SupplierPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.name?.trim()) errors.name = ["Name is required."];
  return errors;
}

registerMock("get", "/suppliers", async () => {
  return wait({ status: 200, data: suppliers });
});

registerMock("post", "/suppliers", async (config) => {
  const payload = ((config.data as SupplierPayload) ?? {}) as SupplierPayload;
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const supplier: Supplier = {
    id: `sup_${Date.now().toString(36)}`,
    ...payload,
  };
  suppliers = [...suppliers, supplier];
  return wait({ status: 201, data: supplier });
});

registerMock("patch", "/suppliers/{id}", async (config, params) => {
  const index = suppliers.findIndex((s) => s.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Supplier not found." } };
  }
  const patch = ((config.data as Partial<SupplierPayload>) ?? {}) as Partial<SupplierPayload>;
  const updated: Supplier = { ...suppliers[index], ...patch };
  suppliers = suppliers.map((s) => (s.id === params.id ? updated : s));
  return wait({ status: 200, data: updated });
});

registerMock("delete", "/suppliers/{id}", async (_config, params) => {
  const index = suppliers.findIndex((s) => s.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Supplier not found." } };
  }
  const [removed] = suppliers.splice(index, 1);
  return wait({ status: 200, data: removed });
});