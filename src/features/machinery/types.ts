export interface Machinery {
  id: string;
  name: string;
  type: string;
  asset_no: string;
  daily_rate: number;
}

export type MachineryPayload = Omit<Machinery, "id">;

export interface MachineryUsage {
  id: string;
  project_id: string;
  machinery: string;
  work_package: string;
  date: string;
  hours_used: number;
  operator: string;
  rate: number;
  amount: number;
}

export type MachineryUsagePayload = Omit<
  MachineryUsage,
  "id" | "project_id" | "amount"
>;