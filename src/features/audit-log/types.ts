export type AuditTargetType =
  | "project"
  | "schedule"
  | "work_package"
  | "boq"
  | "purchase_order"
  | "measurement"
  | "ra_bill"
  | "variation"
  | "expense"
  | "payment"
  | "user"
  | "material"
  | "supplier"
  | "contractor"
  | "inspection"
  | "dpr"
  | "milestone"
  | "labor"
  | "machinery"
  | "indent"
  | "grn";

export interface AuditEntry {
  id: string;
  user: string;
  user_email: string;
  action: string;
  target_type: AuditTargetType;
  target_id: string;
  metadata: Record<string, string>;
  timestamp: string;
}

export interface AuditLogQuery {
  user?: string | null;
  target_type?: AuditTargetType | null;
  date?: string | null;
}