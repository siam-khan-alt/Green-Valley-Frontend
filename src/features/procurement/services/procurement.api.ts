import { api, toApiError } from "@/services/http";
import type { AxiosError } from "axios";
import type {
  GoodsReceipt,
  GrnPayload,
  Indent,
  IndentPayload,
  IndentStatus,
  PurchaseOrder,
  PoPayload,
  PoStatus,
} from "../types";

export const procurementApi = {
  async indents(projectId: string): Promise<Indent[]> {
    try {
      return await api.get<Indent[]>(`/api/v1/projects/${projectId}/indents/`);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createIndent(projectId: string, payload: IndentPayload): Promise<Indent> {
    try {
      return await api.post<Indent>(`/api/v1/projects/${projectId}/indents/`, payload);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async updateIndent(
    id: string,
    patch: Partial<IndentPayload> & { status?: IndentStatus }
  ): Promise<Indent> {
    try {
      return await api.patch<Indent>(`/api/v1/indents/${id}/`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createPoFromIndent(
    indentId: string,
    payload: { supplier: string; unit_price: number; po_date: string; due_date: string }
  ): Promise<PurchaseOrder> {
    try {
      return await api.post<PurchaseOrder>(
        `/api/v1/indents/${indentId}/create-po/`,
        payload
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async purchaseOrders(projectId: string): Promise<PurchaseOrder[]> {
    try {
      return await api.get<PurchaseOrder[]>(
        `/api/v1/projects/${projectId}/purchase-orders/`
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createPurchaseOrder(projectId: string, payload: PoPayload): Promise<PurchaseOrder> {
    try {
      return await api.post<PurchaseOrder>(
        `/api/v1/projects/${projectId}/purchase-orders/`,
        payload
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async updatePurchaseOrder(
    id: string,
    patch: Partial<PoPayload> & { status?: PoStatus }
  ): Promise<PurchaseOrder> {
    try {
      return await api.patch<PurchaseOrder>(`/api/v1/purchase-orders/${id}/`, patch);
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async createGoodsReceipt(poId: string, payload: GrnPayload): Promise<GoodsReceipt> {
    try {
      return await api.post<GoodsReceipt>(
        `/api/v1/purchase-orders/${poId}/goods-receipts/`,
        payload
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },

  async goodsReceipts(projectId: string): Promise<GoodsReceipt[]> {
    try {
      return await api.get<GoodsReceipt[]>(
        `/api/v1/projects/${projectId}/goods-receipts/`
      );
    } catch (error) {
      throw toApiError(error as AxiosError);
    }
  },
};