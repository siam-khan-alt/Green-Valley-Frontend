"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MilestonePayload } from "../types";
import { scheduleApi } from "../services/schedule.api";

const milestonesKey = ["milestones"] as const;

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: [...milestonesKey, projectId],
    queryFn: () => scheduleApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: MilestonePayload }) =>
      scheduleApi.create(projectId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: milestonesKey }),
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MilestonePayload> }) =>
      scheduleApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: milestonesKey }),
  });
}