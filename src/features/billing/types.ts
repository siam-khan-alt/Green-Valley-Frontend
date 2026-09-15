export type MeasurementStatus = "draft" | "verified" | "approved";

export type RaBillStatus = "draft" | "submitted" | "approved";

export interface Measurement {
  id: string;
  project_id: string;
  work_package_id: string;
  work_package_code: string;
  work_package_name: string;
  boq_item_id: string;
  boq_item_description: string;
  unit: string;
  measured_quantity: number;
  measurement_date: string;
  notes: string;
  status: MeasurementStatus;
}

export type MeasurementPayload = Pick<
  Measurement,
  | "work_package_id"
  | "boq_item_id"
  | "boq_item_description"
  | "unit"
  | "measured_quantity"
  | "measurement_date"
  | "notes"
>;

export type MeasurementPatch = Partial<
  Pick<Measurement, "status" | "notes" | "measured_quantity">
>;

export interface RaBillLine {
  work_package_code: string;
  work_package_name: string;
  boq_item_description: string;
  unit: string;
  measured_quantity: number;
  rate: number;
  amount: number;
}

export interface RaDeductions {
  advance: number;
  retention: number;
  material_issue: number;
  penalty: number;
}

export interface RaBill {
  id: string;
  project_id: string;
  bill_no: string;
  bill_date: string;
  period_from: string;
  period_to: string;
  status: RaBillStatus;
  lines: RaBillLine[];
  gross_amount: number;
  deductions: RaDeductions;
  net_payable: number;
  created_at: string;
  updated_at: string;
}

export type RaBillPayload = Pick<
  RaBill,
  "bill_no" | "bill_date" | "period_from" | "period_to"
>;

export type RaBillPatch = Partial<
  Pick<RaBill, "status" | "deductions">
>;