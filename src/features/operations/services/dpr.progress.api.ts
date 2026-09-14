import { api } from "@/services";
import type { ProgressReport } from "../types";

export const dprProgressApi = {
  list: (projectId: string) =>
    api.get<ProgressReport[]>(`/api/v1/projects/${projectId}/progress/`),
};