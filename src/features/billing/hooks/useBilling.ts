"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MeasurementPayload,
  MeasurementPatch,
  RaBillPayload,
  RaBillPatch,
} from "../types";
import { billingApi } from "../services/billing.api";

function measurementKey(projectId: string) {
  return ["measurements", projectId] as const;
}

function raBillKey(projectId: string) {
  return ["ra-bills", projectId] as const;
}

export function useMeasurements(projectId: string) {
  return useQuery({
    queryKey: measurementKey(projectId),
    queryFn: () => billingApi.listMeasurements(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMeasurement(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: MeasurementPayload) => billingApi.createMeasurement(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: measurementKey(projectId) }),
  });
}

export function useUpdateMeasurement(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: MeasurementPatch }) =>
      billingApi.updateMeasurement(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: measurementKey(projectId) }),
  });
}

export function useDeleteMeasurement(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingApi.removeMeasurement(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: measurementKey(projectId) }),
  });
}

export function useRaBills(projectId: string) {
  return useQuery({
    queryKey: raBillKey(projectId),
    queryFn: () => billingApi.listRaBills(projectId),
    enabled: !!projectId,
  });
}

export function useCreateRaBill(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: RaBillPayload) => billingApi.createRaBill(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: raBillKey(projectId) }),
  });
}

export function useGenerateRaBill(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingApi.generateRaBill(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: raBillKey(projectId) }),
  });
}

export function useUpdateRaBill(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: RaBillPatch }) =>
      billingApi.updateRaBill(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: raBillKey(projectId) }),
  });
}