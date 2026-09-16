"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Select,
} from "@/components/ui";
import { PageHeader } from "@/components/shared/PageHeader";
import { RequireRole } from "@/features/auth";
import {
  AUDIT_TARGET_BADGE,
  AUDIT_TARGET_OPTIONS,
  useAuditLog,
} from "@/features/audit-log";
import type { AuditEntry, AuditLogQuery, AuditTargetType } from "@/features/audit-log";
import { useUsers } from "@/features/users";
import { formatDate } from "@/lib/format";
import { exportCsv, formatDateForFile } from "@/lib/csv";

function AuditLogContent() {
  const [filters, setFilters] = useState<AuditLogQuery>({});
  const [search, setSearch] = useState("");
  const auditQuery = useAuditLog(filters);
  const usersQuery = useUsers();

  const entries = useMemo(() => auditQuery.data ?? [], [auditQuery.data]);

  const visibleEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const details = Object.entries(entry.metadata).map(([k, v]) => `${k} ${v}`).join(" ");
      return [
        entry.user,
        entry.user_email,
        entry.action,
        entry.target_type,
        entry.target_id,
        details,
      ].some((field) => field.toLowerCase().includes(q));
    });
  }, [entries, search]);

  const hasFilters = !!(filters.user || filters.target_type || filters.date);

  function update(next: Partial<AuditLogQuery>) {
    setFilters((current) => {
      const merged = { ...current, ...next };
      return {
        user: merged.user || null,
        target_type: merged.target_type || null,
        date: merged.date || null,
      };
    });
  }

  if (auditQuery.isPending) {
    return <LoadingState label="Loading audit log…" />;
  }

  if (auditQuery.isError) {
    return (
      <ErrorState
        title="Could not load audit log"
        description={auditQuery.error?.message}
        retry={<Button variant="outline" onClick={() => void auditQuery.refetch()}>Retry</Button>}
      />
    );
  }

  const users = usersQuery.data ?? [];

  function handleExport() {
    exportCsv({
      filename: `audit-log-${formatDateForFile(new Date())}`,
      headers: ["When", "User", "Action", "Target", "Details"],
      rows: visibleEntries.map((entry: AuditEntry) => [
        entry.timestamp,
        `${entry.user} (${entry.user_email})`,
        entry.action,
        `${entry.target_type} (${entry.target_id})`,
        Object.entries(entry.metadata)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; "),
      ]),
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Audit Log"
        description="Chronological record of who changed what across the organization."
        actions={
          <>
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 lg:w-56"
            />
            <Button variant="outline" onClick={handleExport}>
              Export CSV
            </Button>
          </>
        }
      />

      <Card className="mt-6 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="User"
            value={filters.user ?? ""}
            onChange={(e) => update({ user: e.target.value || null })}
          >
            <option value="">All users</option>
            {users.map((u) => (
              <option key={u.id} value={u.email}>
                {u.name} ({u.email})
              </option>
            ))}
          </Select>
          <Select
            label="Target type"
            value={filters.target_type ?? ""}
            onChange={(e) => update({ target_type: (e.target.value || null) as AuditTargetType | null })}
          >
            <option value="">All types</option>
            {AUDIT_TARGET_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
          <Input
            label="Date"
            type="date"
            value={filters.date ?? ""}
            onChange={(e) => update({ date: e.target.value || null })}
          />
          <div className="flex items-end justify-end gap-2">
            <Button
              variant="outline"
              disabled={!hasFilters}
              onClick={() => setFilters({})}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-4 text-sm text-text-muted">
        {visibleEntries.length} {visibleEntries.length === 1 ? "entry" : "entries"}
        {hasFilters ? " matching filters" : ""}
      </div>

      <div className="mt-2">
        {visibleEntries.length === 0 ? (
          <EmptyState
            title="No audit entries"
            description={hasFilters ? "Try clearing the filters for a broader view." : "Actions will be recorded here as they happen."}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 text-left text-xs text-text-muted">
                  <th className="px-4 py-2 font-medium">When</th>
                  <th className="px-4 py-2 font-medium">User</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                  <th className="px-4 py-2 font-medium">Target</th>
                  <th className="px-4 py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {visibleEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/60 last:border-b-0 align-top">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-text">{formatDate(entry.timestamp)}</span>
                      <span className="ml-1 text-xs text-text-muted">{entry.timestamp.slice(11, 16)}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-medium text-text">{entry.user}</span>
                      <div className="text-xs text-text-muted">{entry.user_email}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={entry.action === "deactivated" ? "danger" : entry.action === "approved" ? "success" : "neutral"}>
                        {entry.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant={AUDIT_TARGET_BADGE[entry.target_type]}>
                          {entry.target_type}
                        </Badge>
                        <span className="font-mono text-xs text-text-muted">{entry.target_id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {Object.keys(entry.metadata).length === 0 ? (
                        <span className="text-xs text-text-muted">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(entry.metadata).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-1.5 py-0.5 text-xs text-text-muted"
                            >
                              <span className="text-text-muted/70">{key}:</span>
                              <span className="font-medium text-text">{value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AuditLogPage() {
  return (
    <RequireRole roles={["admin"]}>
      <AuditLogContent />
    </RequireRole>
  );
}