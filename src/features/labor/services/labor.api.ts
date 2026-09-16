import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { MusterEntry, MusterPayload } from "../types";

export const laborApi = {
  async list(projectId: string): Promise<MusterEntry[]> {
    try {
      return await api.get<MusterEntry[]>(`/projects/${projectId}/muster`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(projectId: string, payload: MusterPayload): Promise<MusterEntry> {
    try {
      return await api.post<MusterEntry>(`/projects/${projectId}/muster`, payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.del<void>(`/muster/${id}`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};