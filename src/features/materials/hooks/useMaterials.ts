"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MaterialPayload } from "../types";
import { materialsApi } from "../services/materials.api";

const materialsKey = ["materials"] as const;

export function useMaterials() {
  return useQuery({ queryKey: materialsKey, queryFn: () => materialsApi.list() });
}

export function useCreateMaterial() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: MaterialPayload) => materialsApi.create(payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: materialsKey }),
  });
}

export function useUpdateMaterial() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MaterialPayload> }) =>
      materialsApi.update(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: materialsKey }),
  });
}

export function useDeleteMaterial() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => materialsApi.remove(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: materialsKey }),
  });
}