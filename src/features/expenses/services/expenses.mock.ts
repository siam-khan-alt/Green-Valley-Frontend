import { registerMock } from "@/services/mock/adapter";
import type {
  Expense,
  ExpensePatch,
  ExpensePayload,
  Payment,
  PaymentPatch,
  PaymentPayload,
} from "../types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

interface ExpenseSeed {
  category: Expense["category"];
  amount: number;
  dateOffset: number;
  description: string;
  purchase_order?: string | null;
}

interface PaymentSeed {
  amount: number;
  dateOffset: number;
  payee: string;
  method: Payment["method"];
  purchase_order?: string | null;
  ra_bill?: string | null;
  related_expense?: string | null;
}

const expenseSeedByProject: Record<string, ExpenseSeed[]> = {
  p_001: [
    { category: "materials", amount: 27_750_000, dateOffset: 40, description: "Steel & rebar delivery against PO-002", purchase_order: "po_002" },
    { category: "labor", amount: 2_100_000, dateOffset: 32, description: "Site staff payroll — January" },
    { category: "contractor", amount: 8_000_000, dateOffset: 26, description: "Piling subcontractor interim payment", purchase_order: null },
    { category: "materials", amount: 11_100_000, dateOffset: 18, description: "Ready-mix concrete M28 (1,500 cum)", purchase_order: "po_001" },
    { category: "overhead", amount: 480_000, dateOffset: 9, description: "Site utilities, security & office rent" },
  ],
  p_002: [
    { category: "contractor", amount: 5_200_000, dateOffset: 22, description: "Foundation contractor advance recovery" },
    { category: "materials", amount: 3_650_000, dateOffset: 12, description: "PCC materials for strip foundations" },
  ],
  p_003: [
    { category: "materials", amount: 4_200_000, dateOffset: 15, description: "Tower crane hoarding & signage" },
    { category: "overhead", amount: 610_000, dateOffset: 5, description: "Security & utilities — office tower" },
  ],
};

const paymentSeedByProject: Record<string, PaymentSeed[]> = {
  p_001: [
    { amount: 27_750_000, dateOffset: 39, payee: "Bashundhara Steel", method: "bank_transfer", purchase_order: "po_002" },
    { amount: 2_100_000, dateOffset: 31, payee: "Payroll — Site Crew", method: "cash" },
    { amount: 8_000_000, dateOffset: 25, payee: "Foundation Experts Ltd.", method: "bank_transfer" },
    { amount: 11_100_000, dateOffset: 16, payee: "Meghna Ready-Mix Ltd.", method: "bank_transfer", purchase_order: "po_001" },
    { amount: 11_936_500, dateOffset: 7, payee: "Green Valley Properties Ltd.", method: "cheque", ra_bill: "rab_001" },
  ],
  p_002: [
    { amount: 5_200_000, dateOffset: 21, payee: "Foundation Experts Ltd.", method: "bank_transfer" },
    { amount: 570_000, dateOffset: 6, payee: "Green Valley Properties Ltd.", method: "cheque", ra_bill: "rab_003" },
  ],
};

const expenseStore = new Map<string, Expense[]>();
const paymentStore = new Map<string, Payment[]>();

function seedProject(projectId: string): void {
  expenseStore.set(
    projectId,
    expenseSeedByProject[projectId]?.map((s, idx) => ({
      id: `exp_${projectId.split("_")[1]}_${String(idx + 1).padStart(2, "0")}`,
      project_id: projectId,
      category: s.category,
      amount: s.amount,
      date: daysAgo(s.dateOffset),
      description: s.description,
      purchase_order: s.purchase_order ?? null,
      created_at: new Date(`${daysAgo(s.dateOffset)}T09:00:00Z`).toISOString(),
      updated_at: new Date(`${daysAgo(s.dateOffset)}T09:00:00Z`).toISOString(),
    })) ?? []
  );
  paymentStore.set(
    projectId,
    paymentSeedByProject[projectId]?.map((s, idx) => ({
      id: `pay_${projectId.split("_")[1]}_${String(idx + 1).padStart(2, "0")}`,
      project_id: projectId,
      amount: s.amount,
      date: daysAgo(s.dateOffset),
      payee: s.payee,
      method: s.method,
      purchase_order: s.purchase_order ?? null,
      ra_bill: s.ra_bill ?? null,
      related_expense: s.related_expense ?? null,
      created_at: new Date(`${daysAgo(s.dateOffset)}T09:00:00Z`).toISOString(),
      updated_at: new Date(`${daysAgo(s.dateOffset)}T09:00:00Z`).toISOString(),
    })) ?? []
  );
}

seedProject("p_001");
seedProject("p_002");
seedProject("p_003");

function projectExpenses(projectId: string): Expense[] {
  return (
    expenseStore.get(projectId) ??
    (() => {
      const empty: Expense[] = [];
      expenseStore.set(projectId, empty);
      return empty;
    })()
  );
}

function projectPayments(projectId: string): Payment[] {
  return (
    paymentStore.get(projectId) ??
    (() => {
      const empty: Payment[] = [];
      paymentStore.set(projectId, empty);
      return empty;
    })()
  );
}

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

registerMock("get", "/projects/{projectId}/expenses", async (_config, params) => {
  const list = projectExpenses(params.projectId)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  return wait({ status: 200, data: list });
});

registerMock("post", "/projects/{projectId}/expenses", async (config, params) => {
  const payload = ((config.data as ExpensePayload) ?? {}) as ExpensePayload;
  if (!payload.category) return { status: 400, data: { category: ["Category is required."] } };
  if (!(payload.amount >= 0)) return { status: 400, data: { amount: ["Amount must be non-negative."] } };
  if (!payload.date) return { status: 400, data: { date: ["Date is required."] } };
  if (!payload.description?.trim()) return { status: 400, data: { description: ["Description is required."] } };
  const list = projectExpenses(params.projectId);
  const expense: Expense = {
    id: `exp_${Date.now().toString(36)}`,
    project_id: params.projectId,
    category: payload.category,
    amount: payload.amount,
    date: payload.date,
    description: payload.description,
    purchase_order: payload.purchase_order ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  expenseStore.set(params.projectId, [expense, ...list]);
  return wait({ status: 201, data: expense });
});

registerMock("patch", "/expenses/{id}", async (config, params) => {
  for (const [projectId, list] of expenseStore) {
    const index = list.findIndex((e) => e.id === params.id);
    if (index === -1) continue;
    const patch = ((config.data as ExpensePatch) ?? {}) as ExpensePatch;
    const updated: Expense = { ...list[index], ...patch, updated_at: new Date().toISOString() };
    expenseStore.set(projectId, list.map((e) => (e.id === params.id ? updated : e)));
    return wait({ status: 200, data: updated });
  }
  return { status: 404, data: { detail: "Expense not found." } };
});

registerMock("delete", "/expenses/{id}", async (_config, params) => {
  for (const [projectId, list] of expenseStore) {
    const index = list.findIndex((e) => e.id === params.id);
    if (index === -1) continue;
    const [removed] = list.splice(index, 1);
    expenseStore.set(projectId, [...list]);
    return wait({ status: 200, data: removed });
  }
  return { status: 404, data: { detail: "Expense not found." } };
});

registerMock("get", "/projects/{projectId}/payments", async (_config, params) => {
  const list = projectPayments(params.projectId)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  return wait({ status: 200, data: list });
});

registerMock("post", "/projects/{projectId}/payments", async (config, params) => {
  const payload = ((config.data as PaymentPayload) ?? {}) as PaymentPayload;
  if (!(payload.amount >= 0)) return { status: 400, data: { amount: ["Amount must be non-negative."] } };
  if (!payload.date) return { status: 400, data: { date: ["Date is required."] } };
  if (!payload.payee?.trim()) return { status: 400, data: { payee: ["Payee is required."] } };
  if (!payload.method) return { status: 400, data: { method: ["Method is required."] } };
  const list = projectPayments(params.projectId);
  const payment: Payment = {
    id: `pay_${Date.now().toString(36)}`,
    project_id: params.projectId,
    amount: payload.amount,
    date: payload.date,
    payee: payload.payee,
    method: payload.method,
    purchase_order: payload.purchase_order ?? null,
    ra_bill: payload.ra_bill ?? null,
    related_expense: payload.related_expense ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  paymentStore.set(params.projectId, [payment, ...list]);
  return wait({ status: 201, data: payment });
});

registerMock("patch", "/payments/{id}", async (config, params) => {
  for (const [projectId, list] of paymentStore) {
    const index = list.findIndex((p) => p.id === params.id);
    if (index === -1) continue;
    const patch = ((config.data as PaymentPatch) ?? {}) as PaymentPatch;
    const updated: Payment = { ...list[index], ...patch, updated_at: new Date().toISOString() };
    paymentStore.set(projectId, list.map((p) => (p.id === params.id ? updated : p)));
    return wait({ status: 200, data: updated });
  }
  return { status: 404, data: { detail: "Payment not found." } };
});

registerMock("delete", "/payments/{id}", async (_config, params) => {
  for (const [projectId, list] of paymentStore) {
    const index = list.findIndex((p) => p.id === params.id);
    if (index === -1) continue;
    const [removed] = list.splice(index, 1);
    paymentStore.set(projectId, [...list]);
    return wait({ status: 200, data: removed });
  }
  return { status: 404, data: { detail: "Payment not found." } };
});