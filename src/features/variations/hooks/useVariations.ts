"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VariationPatch, VariationPayload } from "../types";
import { variationsApi } from "../services/variations.api";

function key(projectId: string) {
  return ["variations", projectId] as const;
}

export function useVariations(projectId: string) {
  return useQuery({
    queryKey: key(projectId),
    queryFn: () => variationsApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCreateVariation(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: VariationPayload) => variationsApi.create(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: key(projectId) }),
  });
}

export function useUpdateVariation(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: VariationPatch }) =>
      variationsApi.update(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: key(projectId) }),
  });
}