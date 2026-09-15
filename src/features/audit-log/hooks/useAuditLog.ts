"use client";

import { useQuery } from "@tanstack/react-query";
import type { AuditLogQuery } from "../types";
import { auditLogApi } from "../services/audit-log.api";

export function useAuditLog(query: AuditLogQuery) {
  return useQuery({
    queryKey: ["audit-log", query] as const,
    queryFn: () => auditLogApi.list(query),
  });
}