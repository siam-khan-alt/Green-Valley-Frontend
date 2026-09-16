import { api } from "@/services";
import type { Page, PaginationQuery } from "@/types/api";
import type { Project, ProjectPayload, ProjectSummary } from "../types";

export interface ProjectsListParams extends PaginationQuery {
  status?: string;
}

export const projectsApi = {
  list: (params?: ProjectsListParams) =>
    api.get<Page<ProjectSummary>>("/projects", params),
  detail: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (payload: ProjectPayload) =>
    api.post<Project>("/projects", payload),
  update: (id: string, payload: Partial<ProjectPayload>) =>
    api.patch<Project>(`/projects/${id}`, payload),
  remove: (id: string) => api.del<void>(`/projects/${id}`),
};