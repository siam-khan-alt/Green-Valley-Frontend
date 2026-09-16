"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MusterPayload } from "../types";
import { laborApi } from "../services/labor.api";

const musterKey = ["muster"] as const;

export function useMuster(projectId: string) {
  return useQuery({
    queryKey: [...musterKey, projectId],
    queryFn: () => laborApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMusterEntry() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: MusterPayload }) =>
      laborApi.create(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: musterKey }),
  });
}

export function useDeleteMusterEntry() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => laborApi.delete(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: musterKey }),
  });
}