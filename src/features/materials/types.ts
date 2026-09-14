export interface Material {
  id: string;
  name: string;
  unit: string;
  default_rate: number;
}

export type MaterialPayload = Omit<Material, "id">;