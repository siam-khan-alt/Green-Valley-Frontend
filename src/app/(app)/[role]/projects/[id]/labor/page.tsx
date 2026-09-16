"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TdCell,
  ThCell,
  useToast,
} from "@/components/ui";
import { roleSlug, useAuth } from "@/features/auth";
import { KpiCard, useProject } from "@/features/projects";
import { useWorkPackages } from "@/features/work-packages";
import type { WorkPackage } from "@/features/work-packages";
import {
  LABOR_TYPES,
  LABOR_WRITE_ROLES,
  MusterEntryForm,
  useCreateMusterEntry,
  useMuster,
} from "@/features/labor";
import type { MusterEntry, MusterPayload } from "@/features/labor";
import { formatCurrency } from "@/lib/format";

export default function LaborPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const slug = user ? roleSlug(user.role) : "";
  const toast = useToast();
  const canWrite = !!user && LABOR_WRITE_ROLES.includes(user.role);

  const projectName = useProjectName(id);
  const musterQuery = useMuster(id);
  const workPackagesQuery = useWorkPackages(id);
  const createEntry = useCreateMusterEntry();

  const [formOpen, setFormOpen] = useState(false);

  const workPackages = useMemo(
    () => workPackagesQuery.data ?? [],
    [workPackagesQuery.data]
  );
  const entries = useMemo(() => musterQuery.data ?? [], [musterQuery.data]);

  const wpIndex = useMemo(() => {
    const map = new Map<string, WorkPackage>();
    workPackages.forEach((wp) => map.set(wp.id, wp));
    return map;
  }, [workPackages]);

  const typeLabel = (type: MusterEntry["labor_type"]) =>
    LABOR_TYPES.find((t) => t.value === type)?.label ?? type;

  const dailyGroups = useMemo(() => {
    const map = new Map<string, MusterEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  const totalCost = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.amount, 0),
    [entries]
  );
  const totalHeads = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.head_count, 0),
    [entries]
  );
  const activeDays = dailyGroups.length;

  if (musterQuery.isPending || workPackagesQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl">
        <LoadingState label="Loading muster…" />
      </main>
    );
  }

  if (musterQuery.isError || workPackagesQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-6xl">
        <ErrorState
          title="Could not load muster roll"
          description={musterQuery.error?.message ?? workPackagesQuery.error?.message ?? "Unknown error"}
          retry={
            <Button variant="outline" onClick={() => void musterQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  async function handleCreate(payload: MusterPayload) {
    await createEntry.mutateAsync({ projectId: id, payload });
    setFormOpen(false);
    toast({
      title: "Muster recorded",
      description: `${payload.head_count} × ${payload.hours_worked}h on ${payload.date}.`,
      variant: "success",
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Labor — muster roll</h1>
          <p className="mt-1 text-sm text-text-muted">
            {projectName ? `${projectName} — ` : ""}daily attendance with labor cost
            derived from head count × hours × rate.
          </p>
        </div>
        {canWrite && workPackages.length > 0 && (
          <Button onClick={() => setFormOpen(true)}>Record muster</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total labor cost"
          value={formatCurrency(totalCost)}
          tone="primary"
          sub="derived from muster entries"
        />
        <KpiCard label="Head count recorded" value={totalHeads.toLocaleString("en-IN")} tone="info" />
        <KpiCard label="Active days" value={activeDays} tone="neutral" />
      </div>

      <div className="mt-6">
        {entries.length === 0 ? (
          <EmptyState
            title="No muster recorded yet"
            description={
              workPackages.length === 0
                ? "Create work packages first to record attendance against them."
                : "Record daily attendance to build the labor cost register."
            }
            action={
              canWrite && workPackages.length > 0 ? (
                <Button onClick={() => setFormOpen(true)}>Record muster</Button>
              ) : undefined
            }
          />
        ) : (
          dailyGroups.map(([date, dayEntries]) => {
            const dayTotal = dayEntries.reduce((sum, e) => sum + e.amount, 0);
            return (
              <Card key={date} className="mb-4">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-sm font-semibold text-text">{date}</span>
                  <span className="text-sm font-semibold text-primary">
                    {formatCurrency(dayTotal)}
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <ThCell>Work package</ThCell>
                      <ThCell>Labor type</ThCell>
                      <ThCell className="text-right">Heads</ThCell>
                      <ThCell className="text-right">Hours</ThCell>
                      <ThCell className="text-right">Rate/hr</ThCell>
                      <ThCell className="text-right">Cost (derived)</ThCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TdCell className="whitespace-nowrap text-text-muted">
                          {wpIndex.get(entry.work_package)?.code ?? entry.work_package}
                        </TdCell>
                        <TdCell className="font-medium text-text">
                          {typeLabel(entry.labor_type)}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums">
                          {entry.head_count}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums">
                          {entry.hours_worked}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums text-text-muted">
                          {entry.rate.toLocaleString("en-IN")}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right font-semibold tabular-nums text-text">
                          {formatCurrency(entry.amount)}
                        </TdCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            );
          })
        )}
      </div>

      <p className="mt-5 text-sm text-text-muted">
        <Link
          href={`/${slug}/projects/${id}`}
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          ← Back to project
        </Link>
      </p>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Record muster"
        subtitle="Daily labor attendance against a work package. Cost is derived."
        size="lg"
      >
        <MusterEntryForm
          workPackages={workPackages}
          submitLabel="Record muster"
          onCancel={() => setFormOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>
    </main>
  );
}

function useProjectName(id: string) {
  const projectQuery = useProject(id);
  return projectQuery.data?.name ?? null;
}