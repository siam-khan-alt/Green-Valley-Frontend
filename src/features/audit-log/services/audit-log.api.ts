import { api } from "@/services";
import type { AuditEntry, AuditLogQuery } from "../types";

export const auditLogApi = {
  list: (query: AuditLogQuery = {}) =>
    api.get<AuditEntry[]>("/audit-log", {
      params: {
        user: query.user || undefined,
        target_type: query.target_type || undefined,
        date: query.date || undefined,
      },
    }),
};