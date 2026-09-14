import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { MusterEntry, MusterPayload } from "../types";

export const laborApi = {
  async list(projectId: string): Promise<MusterEntry[]> {
    try {
      return await api.get<MusterEntry[]>(`/api/v1/projects/${projectId}/muster/`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(projectId: string, payload: MusterPayload): Promise<MusterEntry> {
    try {
      return await api.post<MusterEntry>(
        `/api/v1/projects/${projectId}/muster/`,
        payload
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};