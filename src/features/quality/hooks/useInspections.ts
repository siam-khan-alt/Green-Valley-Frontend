"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InspectionPayload, InspectionPatch } from "../types";
import { inspectionsApi } from "../services/inspections.api";

function inspectionsKey(projectId: string) {
  return ["inspections", projectId] as const;
}

export function useInspections(projectId: string) {
  return useQuery({
    queryKey: inspectionsKey(projectId),
    queryFn: () => inspectionsApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCreateInspection(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: InspectionPayload) => inspectionsApi.create(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: inspectionsKey(projectId) }),
  });
}

export function useUpdateInspection(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: InspectionPatch }) => inspectionsApi.update(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: inspectionsKey(projectId) }),
  });
}

export function useDeleteInspection(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inspectionsApi.remove(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: inspectionsKey(projectId) }),
  });
}