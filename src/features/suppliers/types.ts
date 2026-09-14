export interface Supplier {
  id: string;
  name: string;
  contact_info: string;
}

export type SupplierPayload = Omit<Supplier, "id">;