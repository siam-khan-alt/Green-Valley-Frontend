import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type {
  Machinery,
  MachineryPayload,
  MachineryUsage,
  MachineryUsagePayload,
} from "../types";

export const machineryApi = {
  async listMachinery(): Promise<Machinery[]> {
    try {
      return await api.get<Machinery[]>("/api/v1/machinery/");
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createMachinery(payload: MachineryPayload): Promise<Machinery> {
    try {
      return await api.post<Machinery>("/api/v1/machinery/", payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async updateMachinery(id: string, patch: Partial<MachineryPayload>): Promise<Machinery> {
    try {
      return await api.patch<Machinery>(`/api/v1/machinery/${id}/`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async removeMachinery(id: string): Promise<void> {
    try {
      await api.del(`/api/v1/machinery/${id}/`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async listUsage(projectId: string): Promise<MachineryUsage[]> {
    try {
      return await api.get<MachineryUsage[]>(
        `/api/v1/projects/${projectId}/machinery-usage/`
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createUsage(
    projectId: string,
    payload: MachineryUsagePayload
  ): Promise<MachineryUsage> {
    try {
      return await api.post<MachineryUsage>(
        `/api/v1/projects/${projectId}/machinery-usage/`,
        payload
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};