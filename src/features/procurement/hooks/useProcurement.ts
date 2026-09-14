"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GrnPayload,
  IndentPayload,
  IndentStatus,
  PurchaseOrder,
  PoStatus,
} from "../types";
import { procurementApi } from "../services/procurement.api";

const indentsKey = ["indents"] as const;
const posKey = ["purchase-orders"] as const;
const grnsKey = ["goods-receipts"] as const;

export function useIndents(projectId: string) {
  return useQuery({
    queryKey: [...indentsKey, projectId],
    queryFn: () => procurementApi.indents(projectId),
    enabled: !!projectId,
  });
}

export function useCreateIndent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: IndentPayload }) =>
      procurementApi.createIndent(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: indentsKey }),
  });
}

export function useUpdateIndent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<IndentPayload> & { status?: IndentStatus };
    }) => procurementApi.updateIndent(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: indentsKey }),
  });
}

export function useCreatePoFromIndent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      indentId,
      payload,
    }: {
      indentId: string;
      payload: { supplier: string; unit_price: number; po_date: string; due_date: string };
    }) => procurementApi.createPoFromIndent(indentId, payload),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: indentsKey });
      void client.invalidateQueries({ queryKey: posKey });
    },
  });
}

export function usePurchaseOrders(projectId: string) {
  return useQuery({
    queryKey: [...posKey, projectId],
    queryFn: () => procurementApi.purchaseOrders(projectId),
    enabled: !!projectId,
  });
}

export function useUpdatePurchaseOrder() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<PurchaseOrder> & { status?: PoStatus };
    }) => procurementApi.updatePurchaseOrder(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: posKey }),
  });
}

export function useCreateGoodsReceipt() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ poId, payload }: { poId: string; payload: GrnPayload }) =>
      procurementApi.createGoodsReceipt(poId, payload),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: posKey });
      void client.invalidateQueries({ queryKey: grnsKey });
    },
  });
}

export function useGoodsReceipts(projectId: string) {
  return useQuery({
    queryKey: [...grnsKey, projectId],
    queryFn: () => procurementApi.goodsReceipts(projectId),
    enabled: !!projectId,
  });
}