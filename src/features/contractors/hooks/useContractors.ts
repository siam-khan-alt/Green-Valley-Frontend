"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContractorPayload } from "../types";
import { contractorsApi } from "../services/contractors.api";

const contractorsKey = ["contractors"] as const;

export function useContractors() {
  return useQuery({ queryKey: contractorsKey, queryFn: () => contractorsApi.list() });
}

export function useCreateContractor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContractorPayload) => contractorsApi.create(payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: contractorsKey }),
  });
}

export function useUpdateContractor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ContractorPayload> }) =>
      contractorsApi.update(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: contractorsKey }),
  });
}

export function useDeleteContractor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contractorsApi.remove(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: contractorsKey }),
  });
}