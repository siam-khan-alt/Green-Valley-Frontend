import { registerMock } from "@/services/mock/adapter";
import { DEMO_USERS } from "@/features/auth/services/auth.mock";
import type { AuditEntry, AuditLogQuery, AuditTargetType } from "../types";

interface AuditSeed {
  user_index: number;
  action: string;
  target_type: AuditTargetType;
  target_id: string;
  metadata: Record<string, string>;
  days_ago: number;
}

const SEEDS: AuditSeed[] = [
  { user_index: 0, action: "created", target_type: "user", target_id: "u_finance", metadata: { email: "finance@greenvalley.dev", role: "finance" }, days_ago: 62 },
  { user_index: 1, action: "created", target_type: "project", target_id: "p_001", metadata: { name: "Green Valley Heights" }, days_ago: 61 },
  { user_index: 0, action: "updated", target_type: "project", target_id: "p_001", metadata: { field: "budget" }, days_ago: 58 },
  { user_index: 1, action: "created", target_type: "schedule", target_id: "ms_8", metadata: { name: "Roof slab completion" }, days_ago: 55 },
  { user_index: 2, action: "updated", target_type: "schedule", target_id: "ms_8", metadata: { field: "planned_date" }, days_ago: 53 },
  { user_index: 1, action: "created", target_type: "boq", target_id: "bi_1", metadata: { package: "Piling & deep foundation" }, days_ago: 50 },
  { user_index: 3, action: "approved", target_type: "measurement", target_id: "mea_002", metadata: { work_package: "WP-01" }, days_ago: 47 },
  { user_index: 1, action: "created", target_type: "purchase_order", target_id: "po_001", metadata: { supplier: "Meghna Ready-Mix Ltd." }, days_ago: 45 },
  { user_index: 1, action: "created", target_type: "purchase_order", target_id: "po_002", metadata: { supplier: "Bashundhara Steel" }, days_ago: 42 },
  { user_index: 0, action: "updated", target_type: "user", target_id: "u_site", metadata: { field: "role" }, days_ago: 40 },
  { user_index: 3, action: "created", target_type: "ra_bill", target_id: "rab_001", metadata: { bill_no: "T-2026-001" }, days_ago: 38 },
  { user_index: 1, action: "updated", target_type: "work_package", target_id: "wp_p_001_04", metadata: { field: "progress_pct" }, days_ago: 36 },
  { user_index: 4, action: "created", target_type: "expense", target_id: "exp_001_01", metadata: { category: "materials", amount: "27,750,000" }, days_ago: 33 },
  { user_index: 4, action: "created", target_type: "payment", target_id: "pay_001_01", metadata: { payee: "Bashundhara Steel" }, days_ago: 32 },
  { user_index: 0, action: "updated", target_type: "user", target_id: "u_viewer", metadata: { field: "is_active" }, days_ago: 29 },
  { user_index: 3, action: "approved", target_type: "ra_bill", target_id: "rab_001", metadata: { net_payable: "11,936,500" }, days_ago: 27 },
  { user_index: 1, action: "created", target_type: "variation", target_id: "var_001_01", metadata: { cost_impact: "+3,200,000" }, days_ago: 24 },
  { user_index: 4, action: "created", target_type: "expense", target_id: "exp_001_05", metadata: { category: "overhead", amount: "480,000" }, days_ago: 21 },
  { user_index: 2, action: "created", target_type: "work_package", target_id: "wp_p_001_08", metadata: { name: "External works & landscaping" }, days_ago: 18 },
  { user_index: 1, action: "approved", target_type: "variation", target_id: "var_001_01", metadata: { cost_impact: "+3,200,000" }, days_ago: 15 },
  { user_index: 0, action: "updated", target_type: "user", target_id: "u_pm", metadata: { field: "role" }, days_ago: 12 },
  { user_index: 4, action: "created", target_type: "payment", target_id: "pay_001_05", metadata: { payee: "Green Valley Properties Ltd.", ra_bill: "rab_001" }, days_ago: 10 },
  { user_index: 1, action: "updated", target_type: "boq", target_id: "bi_1", metadata: { field: "rate" }, days_ago: 8 },
  { user_index: 3, action: "approved", target_type: "measurement", target_id: "mea_003", metadata: { work_package: "WP-03" }, days_ago: 6 },
  { user_index: 1, action: "created", target_type: "purchase_order", target_id: "po_004", metadata: { supplier: "Uttara Electricals" }, days_ago: 4 },
  { user_index: 0, action: "deactivated", target_type: "user", target_id: "u_site", metadata: { email: "site@greenvalley.dev" }, days_ago: 2 },
  { user_index: 1, action: "created", target_type: "expense", target_id: "exp_001_05", metadata: { category: "overhead", amount: "480,000" }, days_ago: 0 },
];

const store: AuditEntry[] = SEEDS.map((seed, index) => {
  const date = new Date();
  date.setDate(date.getDate() - seed.days_ago);
  date.setHours(9 + (index % 9), 10 + (index % 50), 0, 0);
  return {
    id: `aud_${String(index + 1).padStart(3, "0")}`,
    user: DEMO_USERS[seed.user_index].name,
    user_email: DEMO_USERS[seed.user_index].email,
    action: seed.action,
    target_type: seed.target_type,
    target_id: seed.target_id,
    metadata: seed.metadata,
    timestamp: date.toISOString(),
  };
});

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

registerMock("get", "/audit-log", async (config) => {
  const params = ((config.params as Record<string, unknown>) ?? {}) as Record<string, unknown>;
  const query: AuditLogQuery = {
    user: typeof params.user === "string" && params.user ? params.user : null,
    target_type: typeof params.target_type === "string" && params.target_type ? params.target_type as AuditTargetType : null,
    date: typeof params.date === "string" && params.date ? params.date : null,
  };

  const filtered = store
    .filter((entry) => {
      if (query.user) {
        const needle = query.user.toLowerCase();
        const hit =
          entry.user.toLowerCase().includes(needle) ||
          entry.user_email.toLowerCase().includes(needle);
        if (!hit) return false;
      }
      if (query.target_type && entry.target_type !== query.target_type) return false;
      if (query.date && !entry.timestamp.startsWith(query.date)) return false;
      return true;
    })
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return wait({ status: 200, data: filtered });
});