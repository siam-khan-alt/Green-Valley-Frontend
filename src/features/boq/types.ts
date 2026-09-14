export interface BoqItem {
  id: string;
  boq_id: string;
  work_package: string;
  material: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type BoqItemPayload = Omit<BoqItem, "id" | "boq_id" | "amount">;

export interface Boq {
  boq_id: string;
  project_id: string;
  version: string;
  items: BoqItem[];
}