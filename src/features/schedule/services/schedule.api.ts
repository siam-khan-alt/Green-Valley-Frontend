import { api } from "@/services";
import type { Milestone, MilestonePayload } from "../types";

export const scheduleApi = {
  list: (projectId: string) =>
    api.get<Milestone[]>(`/projects/${projectId}/milestones`),
  create: (projectId: string, payload: MilestonePayload) =>
    api.post<Milestone>(`/projects/${projectId}/milestones`, payload),
  update: (id: string, payload: Partial<MilestonePayload>) =>
    api.patch<Milestone>(`/milestones/${id}`, payload),
};