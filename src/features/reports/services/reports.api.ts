import { api } from "@/services";
import type { PortfolioReport, ProjectReport } from "../types";

export const reportsApi = {
  portfolio: () => api.get<PortfolioReport>("/reports/portfolio"),
  project: (projectId: string) =>
    api.get<ProjectReport>(`/projects/${projectId}/reports`),
};