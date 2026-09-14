"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkPackagePayload } from "../types";
import { workPackagesApi } from "../services/work-packages.api";

const wpKey = ["work-packages"] as const;

export function useWorkPackages(projectId: string) {
  return useQuery({
    queryKey: [...wpKey, projectId],
    queryFn: () => workPackagesApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useWorkPackageSummary(wpId: string) {
  return useQuery({
    queryKey: [...wpKey, "summary", wpId],
    queryFn: () => workPackagesApi.summary(wpId),
    enabled: !!wpId,
  });
}

export function useCreateWorkPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: WorkPackagePayload }) =>
      workPackagesApi.create(projectId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wpKey }),
  });
}

export function useUpdateWorkPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WorkPackagePayload> }) =>
      workPackagesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wpKey }),
  });
}

export function useDeleteWorkPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workPackagesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wpKey }),
  });
}