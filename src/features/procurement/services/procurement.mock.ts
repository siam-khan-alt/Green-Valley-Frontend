import { registerMock } from "@/services/mock/adapter";
import type { Indent, IndentPayload, PurchaseOrder, PoPayload, GoodsReceipt, GrnPayload } from "../types";

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 150 + Math.random() * 200);
  });
}

let indents: Indent[] = [];
let orders: PurchaseOrder[] = [];
let receipts: GoodsReceipt[] = [];

function seed(): void {
  indents = [
    { id: "in_001", project_id: "p_001", work_package: "wp_001_04", material: "Ready-mix concrete M28", required_quantity: 3500, required_date: "2025-10-10", status: "ordered", created_at: "2025-09-28" },
    { id: "in_002", project_id: "p_001", work_package: "wp_001_02", material: "Reinforcement steel (60 grade)", required_quantity: 480, required_date: "2025-05-01", status: "ordered", created_at: "2025-04-18" },
    { id: "in_003", project_id: "p_001", work_package: "wp_001_05", material: "First class brick", required_quantity: 68000, required_date: "2026-01-15", status: "submitted", created_at: "2026-01-02" },
    { id: "in_004", project_id: "p_001", work_package: "wp_001_03", material: "Waterproofing membrane", required_quantity: 82000, required_date: "2026-02-01", status: "drafted", created_at: "2026-01-20" },
    { id: "in_005", project_id: "p_001", work_package: "wp_001_07", material: "uPVC windows & glazing", required_quantity: 1500, required_date: "2025-11-30", status: "rejected", created_at: "2025-11-10" },
    { id: "in_006", project_id: "p_002", work_package: "wp_002_02", material: "Ground beam RCC M25", required_quantity: 310, required_date: "2026-03-05", status: "submitted", created_at: "2026-02-20" },
    { id: "in_007", project_id: "p_002", work_package: "wp_002_03", material: "Roof insulation boards", required_quantity: 18500, required_date: "2026-04-01", status: "drafted", created_at: "2026-03-01" },
    { id: "in_008", project_id: "p_003", work_package: "wp_003_02", material: "Reinforcement steel (60 grade)", required_quantity: 540, required_date: "2026-05-10", status: "approved", created_at: "2026-04-25" },
  ];

  orders = [
    { id: "po_001", project_id: "p_001", po_no: "PO-001", indent: "in_001", work_package: "wp_001_04", supplier: "Meghna Ready-Mix Ltd.", material: "Ready-mix concrete M28", quantity: 3500, unit_price: 18500, po_date: "2025-10-20", due_date: "2026-01-20", status: "partially_received" },
    { id: "po_002", project_id: "p_001", po_no: "PO-002", indent: "in_002", work_package: "wp_001_02", supplier: "Bashundhara Steel", material: "Reinforcement steel (60 grade)", quantity: 480, unit_price: 165000, po_date: "2025-05-10", due_date: "2025-07-10", status: "received" },
    { id: "po_003", project_id: "p_001", po_no: "PO-003", indent: "in_002", work_package: "wp_001_02", supplier: "Bashundhara Steel", material: "Reinforcement steel (60 grade)", quantity: 60, unit_price: 162000, po_date: "2025-08-01", due_date: "2025-09-01", status: "closed" },
    { id: "po_004", project_id: "p_001", po_no: "PO-004", indent: null, work_package: "wp_001_06", supplier: "Uttara Electricals", material: "MEP rough-in allowance", quantity: 1, unit_price: 22000000, po_date: "2026-01-05", due_date: "2026-06-30", status: "issued" },
    { id: "po_005", project_id: "p_002", po_no: "PO-001", indent: null, work_package: "wp_002_03", supplier: "RFL Building Solutions", material: "Roof insulation boards", quantity: 18500, unit_price: 240, po_date: "2026-03-10", due_date: "2026-05-01", status: "issued" },
  ];

  receipts = [
    { id: "grn_001", project_id: "p_001", po: "po_001", po_no: "PO-001", received_quantity: 1500, received_date: "2025-11-15", notes: "First delivery — basement slab section." },
    { id: "grn_002", project_id: "p_001", po: "po_001", po_no: "PO-001", received_quantity: 500, received_date: "2025-12-20", notes: "Superstructure pour at level 3." },
    { id: "grn_003", project_id: "p_001", po: "po_002", po_no: "PO-002", received_quantity: 480, received_date: "2025-06-30", notes: "Full order received against indent in_002." },
  ];
}

seed();

const currentDate = () => new Date().toISOString().slice(0, 10);

function indentValidate(payload: IndentPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package) errors.work_package = ["Select a work package."];
  if (!payload.material?.trim()) errors.material = ["Material is required."];
  if (!(payload.required_quantity > 0)) errors.required_quantity = ["Quantity must be greater than zero."];
  if (!payload.required_date) errors.required_date = ["Required date is required."];
  return errors;
}

function poValidate(payload: PoPayload): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!payload.work_package) errors.work_package = ["Select a work package."];
  if (!payload.supplier?.trim()) errors.supplier = ["Supplier is required."];
  if (!payload.material?.trim()) errors.material = ["Material is required."];
  if (!(payload.quantity > 0)) errors.quantity = ["Quantity must be greater than zero."];
  if (!(payload.unit_price > 0)) errors.unit_price = ["Unit price must be greater than zero."];
  if (!payload.po_date) errors.po_date = ["PO date is required."];
  if (!payload.due_date) errors.due_date = ["Due date is required."];
  return errors;
}

function nextPoNo(projectId: string): string {
  const count = orders.filter((po) => po.project_id === projectId).length + 1;
  return `PO-${String(count).padStart(3, "0")}`;
}

function receivedQuantity(poId: string): number {
  return receipts
    .filter((grn) => grn.po === poId)
    .reduce((sum, grn) => sum + grn.received_quantity, 0);
}

registerMock("get", "/projects/{id}/indents", async (_config, params) => {
  return wait({ status: 200, data: indents.filter((i) => i.project_id === params.id) });
});

registerMock("post", "/projects/{id}/indents", async (config, params) => {
  const payload = ((config.data as IndentPayload) ?? {}) as IndentPayload;
  const errors = indentValidate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const indent: Indent = {
    id: `in_${Date.now().toString(36)}`,
    project_id: params.id,
    work_package: payload.work_package,
    material: payload.material,
    required_quantity: payload.required_quantity,
    required_date: payload.required_date,
    status: "drafted",
    created_at: currentDate(),
  };
  indents = [...indents, indent];
  return wait({ status: 201, data: indent });
});

registerMock("patch", "/indents/{id}", async (config, params) => {
  const index = indents.findIndex((i) => i.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Indent not found." } };
  }
  const current = indents[index];
  const patch = ((config.data as Partial<IndentPayload> & { status?: Indent["status"] }) ?? {}) as Partial<IndentPayload> & { status?: Indent["status"] };
  const errors = indentValidate({ ...current, ...patch } as IndentPayload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const updated: Indent = { ...current, ...patch };
  indents = indents.map((i) => (i.id === params.id ? updated : i));
  return wait({ status: 200, data: updated });
});

registerMock("post", "/indents/{id}/create-po", async (config, params) => {
  const index = indents.findIndex((i) => i.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Indent not found." } };
  }
  const current = indents[index];
  if (current.status === "ordered") {
    return { status: 400, data: { detail: "A purchase order has already been created for this indent." } };
  }
  if (current.status !== "approved") {
    return { status: 400, data: { detail: "The indent must be approved before creating a purchase order." } };
  }
  const body = ((config.data ?? {}) as {
    supplier?: string;
    unit_price?: number;
    po_date?: string;
    due_date?: string;
  });
  if (!body.supplier?.trim() || !(body.unit_price && body.unit_price > 0) || !body.due_date) {
    return { status: 400, data: { detail: "supplier, unit_price and due_date are required." } };
  }
  const po: PurchaseOrder = {
    id: `po_${Date.now().toString(36)}`,
    project_id: current.project_id,
    po_no: nextPoNo(current.project_id),
    indent: current.id,
    work_package: current.work_package,
    supplier: body.supplier,
    material: current.material,
    quantity: current.required_quantity,
    unit_price: body.unit_price,
    po_date: body.po_date ?? currentDate(),
    due_date: body.due_date,
    status: "issued",
  };
  orders = [...orders, po];
  indents = indents.map((i) => (i.id === current.id ? { ...i, status: "ordered" } : i));
  return wait({ status: 201, data: po });
});

registerMock("get", "/projects/{id}/purchase-orders", async (_config, params) => {
  return wait({ status: 200, data: orders.filter((po) => po.project_id === params.id) });
});

registerMock("post", "/projects/{id}/purchase-orders", async (config, params) => {
  const payload = ((config.data as PoPayload) ?? {}) as PoPayload;
  const errors = poValidate(payload);
  if (Object.keys(errors).length > 0) {
    return { status: 400, data: errors };
  }
  const po: PurchaseOrder = {
    id: `po_${Date.now().toString(36)}`,
    project_id: params.id,
    po_no: nextPoNo(params.id),
    ...payload,
  };
  orders = [...orders, po];
  return wait({ status: 201, data: po });
});

registerMock("patch", "/purchase-orders/{id}", async (config, params) => {
  const index = orders.findIndex((po) => po.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Purchase order not found." } };
  }
  const patch = ((config.data as Partial<PoPayload> & { status?: PurchaseOrder["status"] }) ?? {}) as Partial<PoPayload> & { status?: PurchaseOrder["status"] };
  const updated: PurchaseOrder = { ...orders[index], ...patch };
  orders = orders.map((po) => (po.id === params.id ? updated : po));
  return wait({ status: 200, data: updated });
});

registerMock("post", "/purchase-orders/{id}/goods-receipts", async (config, params) => {
  const index = orders.findIndex((po) => po.id === params.id);
  if (index === -1) {
    return { status: 404, data: { detail: "Purchase order not found." } };
  }
  const po = orders[index];
  const payload = ((config.data as GrnPayload) ?? {}) as GrnPayload;
  if (!(payload.received_quantity > 0)) {
    return { status: 400, data: { detail: "received_quantity must be greater than zero." } };
  }
  const remaining = po.quantity - receivedQuantity(po.id);
  if (payload.received_quantity > remaining) {
    return { status: 400, data: { detail: `Cannot receive more than the remaining ${remaining} units.` } };
  }
  const grn: GoodsReceipt = {
    id: `grn_${Date.now().toString(36)}`,
    project_id: po.project_id,
    po: po.id,
    po_no: po.po_no,
    received_quantity: payload.received_quantity,
    received_date: payload.received_date ?? currentDate(),
    notes: payload.notes ?? "",
  };
  receipts = [...receipts, grn];
  const nextStatus: PurchaseOrder["status"] =
    receivedQuantity(po.id) >= po.quantity ? "received" : "partially_received";
  orders = orders.map((o) => (o.id === po.id ? { ...o, status: nextStatus } : o));
  return wait({ status: 201, data: grn });
});

registerMock("get", "/projects/{id}/goods-receipts", async (_config, params) => {
  return wait({ status: 200, data: receipts.filter((grn) => grn.project_id === params.id) });
});