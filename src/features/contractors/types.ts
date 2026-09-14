export type ContractorType = "contractor" | "subcontractor";

export interface Contractor {
  id: string;
  name: string;
  contact_info: string;
  type: ContractorType;
}

export type ContractorPayload = Pick<Contractor, "name" | "contact_info" | "type">;