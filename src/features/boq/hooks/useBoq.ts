import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoqItem, BoqItemPayload } from "../types";
import { boqApi } from "../services/boq.api";

const BOQ_KEY = ["boq"] as const;

export function useBoq(projectId: string) {
  return useQuery({
    queryKey: [...BOQ_KEY, projectId],
    queryFn: () => boqApi.get(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateBoqItem(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: BoqItemPayload) => boqApi.addItem(projectId, payload),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: BOQ_KEY });
    },
  });
}

export function useUpdateBoqItem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<BoqItemPayload> }) =>
      boqApi.updateItem(id, patch),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: BOQ_KEY });
    },
  });
}

export function useDeleteBoqItem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boqApi.removeItem(id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: BOQ_KEY });
    },
  });
}

export type { BoqItem };