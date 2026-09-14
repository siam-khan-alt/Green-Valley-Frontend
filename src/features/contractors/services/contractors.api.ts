import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { Contractor, ContractorPayload } from "../types";

export const contractorsApi = {
  async list(): Promise<Contractor[]> {
    try {
      return await api.get<Contractor[]>("/api/v1/contractors/");
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(payload: ContractorPayload): Promise<Contractor> {
    try {
      return await api.post<Contractor>("/api/v1/contractors/", payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async update(id: string, patch: Partial<ContractorPayload>): Promise<Contractor> {
    try {
      return await api.patch<Contractor>(`/api/v1/contractors/${id}/`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.del(`/api/v1/contractors/${id}/`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};