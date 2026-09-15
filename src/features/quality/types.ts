export type InspectionType =
  | "foundation"
  | "concrete"
  | "rebar"
  | "waterproofing"
  | "masonry"
  | "structural"
  | "mep"
  | "finishing"
  | "final";

export type InspectionStatus =
  | "requested"
  | "scheduled"
  | "passed"
  | "rejected"
  | "cancelled";

export interface Inspection {
  id: string;
  project_id: string;
  work_package_id: string;
  work_package_code: string;
  work_package_name: string;
  type: InspectionType;
  requested_by: string;
  scheduled_date: string;
  actual_date?: string;
  status: InspectionStatus;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export type InspectionPayload = Pick<
  Inspection,
  "work_package_id" | "type" | "requested_by" | "scheduled_date" | "remarks"
>;

export type InspectionPatch = Partial<
  Pick<Inspection, "scheduled_date" | "status" | "remarks" | "actual_date">
>;