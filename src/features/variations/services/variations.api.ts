import { api } from "@/services";
import type {
  Variation,
  VariationPatch,
  VariationPayload,
} from "../types";

export const variationsApi = {
  list: (projectId: string) =>
    api.get<Variation[]>(`/projects/${projectId}/variations`),
  create: (projectId: string, payload: VariationPayload) =>
    api.post<Variation>(`/projects/${projectId}/variations`, payload),
  update: (id: string, patch: VariationPatch) =>
    api.patch<Variation>(`/variations/${id}`, patch),
  delete: (id: string) => api.del<void>(`/variations/${id}`),
};