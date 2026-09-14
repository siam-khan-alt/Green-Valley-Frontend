"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DprPayload } from "../types";
import { dprApi } from "../services/dpr.api";
import { dprProgressApi } from "../services/dpr.progress.api";

function dprKey(projectId: string) {
  return ["dpr", projectId] as const;
}

function dprProgressKey(projectId: string) {
  return ["dpr-progress", projectId] as const;
}

export function useDprList(projectId: string) {
  return useQuery({
    queryKey: dprKey(projectId),
    queryFn: () => dprApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useDprProgress(projectId: string) {
  return useQuery({
    queryKey: dprProgressKey(projectId),
    queryFn: () => dprProgressApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCreateDpr(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: DprPayload) => dprApi.create(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: dprKey(projectId) }),
  });
}

export function useUpdateDpr(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<DprPayload> }) => dprApi.update(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: dprKey(projectId) }),
  });
}

export function useDeleteDpr(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dprApi.remove(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: dprKey(projectId) }),
  });
}