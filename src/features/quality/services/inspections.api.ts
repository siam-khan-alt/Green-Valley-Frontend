import { api } from "@/services";
import type { Inspection, InspectionPayload, InspectionPatch } from "../types";

export const inspectionsApi = {
  list: (projectId: string) =>
    api.get<Inspection[]>(`/projects/${projectId}/inspections`),
  create: (projectId: string, payload: InspectionPayload) =>
    api.post<Inspection>(`/projects/${projectId}/inspections`, payload),
  update: (id: string, patch: InspectionPatch) =>
    api.patch<Inspection>(`/inspections/${id}`, patch),
  remove: (id: string) => api.del<void>(`/inspections/${id}`),
};