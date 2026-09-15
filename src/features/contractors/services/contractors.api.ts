import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { Contractor, ContractorPayload } from "../types";

export const contractorsApi = {
  async list(): Promise<Contractor[]> {
    try {
      return await api.get<Contractor[]>("/contractors");
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(payload: ContractorPayload): Promise<Contractor> {
    try {
      return await api.post<Contractor>("/contractors", payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async update(id: string, patch: Partial<ContractorPayload>): Promise<Contractor> {
    try {
      return await api.patch<Contractor>(`/contractors/${id}`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.del(`/contractors/${id}`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};