import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type { Supplier, SupplierPayload } from "../types";

export const suppliersApi = {
  async list(): Promise<Supplier[]> {
    try {
      return await api.get<Supplier[]>("/suppliers");
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async create(payload: SupplierPayload): Promise<Supplier> {
    try {
      return await api.post<Supplier>("/suppliers", payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async update(id: string, patch: Partial<SupplierPayload>): Promise<Supplier> {
    try {
      return await api.patch<Supplier>(`/suppliers/${id}`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.del(`/suppliers/${id}`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};