export type IndentStatus =
  | "drafted"
  | "submitted"
  | "approved"
  | "rejected"
  | "ordered";

export interface Indent {
  id: string;
  project_id: string;
  work_package: string;
  material: string;
  required_quantity: number;
  required_date: string;
  status: IndentStatus;
  created_at: string;
}

export type IndentPayload = Omit<
  Indent,
  "id" | "project_id" | "status" | "created_at"
>;

export type PoStatus = "issued" | "partially_received" | "received" | "closed";

export interface PurchaseOrder {
  id: string;
  project_id: string;
  po_no: string;
  indent: string | null;
  work_package: string;
  supplier: string;
  material: string;
  quantity: number;
  unit_price: number;
  po_date: string;
  due_date: string;
  status: PoStatus;
}

export type PoPayload = Omit<PurchaseOrder, "id" | "po_no" | "project_id">;

export interface GoodsReceipt {
  id: string;
  project_id: string;
  po: string;
  po_no: string;
  received_quantity: number;
  received_date: string;
  notes: string;
}

export type GrnPayload = Omit<GoodsReceipt, "id" | "project_id" | "po" | "po_no">;