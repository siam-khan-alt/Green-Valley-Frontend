import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { Material, MaterialPayload } from "../types";

export const materialsApi = {
  async list(): Promise<Material[]> {
    try {
      return await api.get<Material[]>("/materials");
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(payload: MaterialPayload): Promise<Material> {
    try {
      return await api.post<Material>("/materials", payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async update(id: string, patch: Partial<MaterialPayload>): Promise<Material> {
    try {
      return await api.patch<Material>(`/materials/${id}`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.del(`/materials/${id}`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};