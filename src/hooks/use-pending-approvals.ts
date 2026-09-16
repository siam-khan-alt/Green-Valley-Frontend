"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { projectsApi } from "@/features/projects/services/projects.api";
import { procurementApi } from "@/features/procurement/services/procurement.api";
import { billingApi } from "@/features/billing/services/billing.api";
import { variationsApi } from "@/features/variations/services/variations.api";

export interface PendingItem {
  type: "indent" | "ra_bill" | "variation";
  projectId: string;
  projectName: string;
  id: string;
  label: string;
  status: string;
  url: string;
}

export function usePendingApprovals() {
  const projectsQuery = useQueries({
    queries: [{ queryKey: ["projects"], queryFn: () => projectsApi.list({ page_size: 100 }) }],
    combine: (results) => results[0],
  });

  const projects = useMemo(() => projectsQuery.data?.results ?? [], [projectsQuery.data]);
  const projectIds = useMemo(() => projects.map((p) => p.id), [projects]);
  const projectMap = useMemo(() => {
    const m = new Map<string, { id: string; name: string }>();
    projects.forEach((p) => m.set(p.id, { id: p.id, name: p.name }));
    return m;
  }, [projects]);

  const indentsQueries = useQueries({
    queries: projectIds.map((pid) => ({
      queryKey: ["indents", pid],
      queryFn: () => procurementApi.indents(pid),
      enabled: !!pid,
    })),
    combine: (results) => results,
  });

  const billsQueries = useQueries({
    queries: projectIds.map((pid) => ({
      queryKey: ["ra-bills", pid],
      queryFn: () => billingApi.listRaBills(pid),
      enabled: !!pid,
    })),
    combine: (results) => results,
  });

  const variationsQueries = useQueries({
    queries: projectIds.map((pid) => ({
      queryKey: ["variations", pid],
      queryFn: () => variationsApi.list(pid),
      enabled: !!pid,
    })),
    combine: (results) => results,
  });

  const items = useMemo(() => {
    const result: PendingItem[] = [];

    indentsQueries.forEach((q, i) => {
      if (!q.data) return;
      const pid = projectIds[i];
      const pname = projectMap.get(pid)?.name ?? pid;
      q.data
        .filter((ind) => ind.status === "submitted")
        .forEach((ind) => {
          result.push({
            type: "indent",
            projectId: pid,
            projectName: pname,
            id: ind.id,
            label: `${ind.material} (qty ${ind.required_quantity.toLocaleString("en-IN")})`,
            status: ind.status,
            url: `projects/${pid}/procurement`,
          });
        });
    });

    billsQueries.forEach((q, i) => {
      if (!q.data) return;
      const pid = projectIds[i];
      const pname = projectMap.get(pid)?.name ?? pid;
      q.data
        .filter((bill) => bill.status === "draft" || bill.status === "submitted")
        .forEach((bill) => {
          result.push({
            type: "ra_bill",
            projectId: pid,
            projectName: pname,
            id: bill.id,
            label: `Bill ${bill.bill_no} — ৳${bill.net_payable.toLocaleString("en-IN")}`,
            status: bill.status,
            url: `projects/${pid}/billing`,
          });
        });
    });

    variationsQueries.forEach((q, i) => {
      if (!q.data) return;
      const pid = projectIds[i];
      const pname = projectMap.get(pid)?.name ?? pid;
      q.data
        .filter((v) => v.status === "proposed")
        .forEach((v) => {
          result.push({
            type: "variation",
            projectId: pid,
            projectName: pname,
            id: v.id,
            label: `${v.description.slice(0, 60)}${v.description.length > 60 ? "…" : ""} — ৳${v.cost_impact.toLocaleString("en-IN")}`,
            status: v.status,
            url: `projects/${pid}/variations`,
          });
        });
    });

    return result;
  }, [indentsQueries, billsQueries, variationsQueries, projectIds, projectMap]);

  const isPending = projectsQuery.isPending || indentsQueries.some((q) => q.isPending) || billsQueries.some((q) => q.isPending) || variationsQueries.some((q) => q.isPending);
  const isError = projectsQuery.isError || indentsQueries.some((q) => q.isError) || billsQueries.some((q) => q.isError) || variationsQueries.some((q) => q.isError);

  return { items, isPending, isError };
}
