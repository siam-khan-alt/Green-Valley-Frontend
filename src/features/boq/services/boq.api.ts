import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { Boq, BoqItem, BoqItemPayload } from "../types";

export const boqApi = {
  async get(projectId: string): Promise<Boq> {
    try {
      return await api.get<Boq>(`/api/v1/projects/${projectId}/boq/`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async addItem(projectId: string, payload: BoqItemPayload): Promise<BoqItem> {
    try {
      return await api.post<BoqItem>(`/api/v1/projects/${projectId}/boq/items/`, payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async updateItem(id: string, patch: Partial<BoqItemPayload>): Promise<BoqItem> {
    try {
      return await api.patch<BoqItem>(`/api/v1/boq-items/${id}/`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async removeItem(id: string): Promise<void> {
    try {
      await api.del(`/api/v1/boq-items/${id}/`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};