import { api } from "@/services";
import type { WorkPackage, WorkPackagePayload, WorkPackageSummary } from "../types";

export const workPackagesApi = {
  list: (projectId: string) =>
    api.get<WorkPackage[]>(`/projects/${projectId}/work-packages`),
  create: (projectId: string, payload: WorkPackagePayload) =>
    api.post<WorkPackage>(`/projects/${projectId}/work-packages`, payload),
  update: (id: string, payload: Partial<WorkPackagePayload>) =>
    api.patch<WorkPackage>(`/work-packages/${id}`, payload),
  remove: (id: string) => api.del<null>(`/work-packages/${id}`),
  summary: (id: string) => api.get<WorkPackageSummary>(`/work-packages/${id}/summary`),
};