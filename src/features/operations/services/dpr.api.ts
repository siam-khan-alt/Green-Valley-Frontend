import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { DailyProgressReport, DprPayload } from "../types";

export const dprApi = {
  async list(projectId: string): Promise<DailyProgressReport[]> {
    try {
      return await api.get<DailyProgressReport[]>(`/projects/${projectId}/daily-reports`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(projectId: string, payload: DprPayload): Promise<DailyProgressReport> {
    try {
      return await api.post<DailyProgressReport>(`/projects/${projectId}/dpr`, payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async update(id: string, patch: Partial<DprPayload>): Promise<DailyProgressReport> {
    try {
      return await api.patch<DailyProgressReport>(`/dpr/${id}`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.del(`/dpr/${id}`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};