import { api } from "@/services";
import type {
  Measurement,
  MeasurementPayload,
  MeasurementPatch,
  RaBill,
  RaBillPayload,
  RaBillPatch,
} from "../types";

export const billingApi = {
  listMeasurements: (projectId: string) =>
    api.get<Measurement[]>(`/projects/${projectId}/measurements`),
  createMeasurement: (projectId: string, payload: MeasurementPayload) =>
    api.post<Measurement>(`/projects/${projectId}/measurements`, payload),
  updateMeasurement: (id: string, patch: MeasurementPatch) =>
    api.patch<Measurement>(`/measurements/${id}`, patch),
  removeMeasurement: (id: string) => api.del<void>(`/measurements/${id}`),

  listRaBills: (projectId: string) =>
    api.get<RaBill[]>(`/projects/${projectId}/ra-bills`),
  createRaBill: (projectId: string, payload: RaBillPayload) =>
    api.post<RaBill>(`/projects/${projectId}/ra-bills`, payload),
  generateRaBill: (id: string) =>
    api.post<RaBill>(`/ra-bills/${id}/generate`),
  updateRaBill: (id: string, patch: RaBillPatch) =>
    api.patch<RaBill>(`/ra-bills/${id}`, patch),
};