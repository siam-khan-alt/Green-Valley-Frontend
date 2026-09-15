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
      return await api.get<Machinery[]>("/machinery");
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createMachinery(payload: MachineryPayload): Promise<Machinery> {
    try {
      return await api.post<Machinery>("/machinery", payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async updateMachinery(id: string, patch: Partial<MachineryPayload>): Promise<Machinery> {
    try {
      return await api.patch<Machinery>(`/machinery/${id}`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async removeMachinery(id: string): Promise<void> {
    try {
      await api.del(`/machinery/${id}`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async listUsage(projectId: string): Promise<MachineryUsage[]> {
    try {
      return await api.get<MachineryUsage[]>(
        `/projects/${projectId}/machinery-usage`
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
        `/projects/${projectId}/machinery-usage`,
        payload
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};