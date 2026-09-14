"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupplierPayload } from "../types";
import { suppliersApi } from "../services/suppliers.api";

const suppliersKey = ["suppliers"] as const;

export function useSuppliers() {
  return useQuery({ queryKey: suppliersKey, queryFn: () => suppliersApi.list() });
}

export function useCreateSupplier() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupplierPayload) => suppliersApi.create(payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: suppliersKey }),
  });
}

export function useUpdateSupplier() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<SupplierPayload> }) =>
      suppliersApi.update(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: suppliersKey }),
  });
}

export function useDeleteSupplier() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suppliersApi.remove(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: suppliersKey }),
  });
}