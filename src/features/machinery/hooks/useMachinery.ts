"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MachineryPayload, MachineryUsagePayload } from "../types";
import { machineryApi } from "../services/machinery.api";

const machineryKey = ["machinery"] as const;
const usageKey = ["machinery-usage"] as const;

export function useMachineryList() {
  return useQuery({
    queryKey: machineryKey,
    queryFn: () => machineryApi.listMachinery(),
  });
}

export function useCreateMachinery() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: MachineryPayload) => machineryApi.createMachinery(payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: machineryKey }),
  });
}

export function useUpdateMachinery() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MachineryPayload> }) =>
      machineryApi.updateMachinery(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: machineryKey }),
  });
}

export function useDeleteMachinery() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => machineryApi.removeMachinery(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: machineryKey }),
  });
}

export function useMachineryUsage(projectId: string) {
  return useQuery({
    queryKey: [...usageKey, projectId],
    queryFn: () => machineryApi.listUsage(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMachineryUsage() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: MachineryUsagePayload }) =>
      machineryApi.createUsage(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: usageKey }),
  });
}