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
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useWorkPackages } from "@/features/work-packages";
import type { WorkPackage } from "@/features/work-packages";
import {
  MACHINE_TYPES,
  MACHINERY_WRITE_ROLES,
  MachineryForm,
  MachineryUsageForm,
  useCreateMachinery,
  useCreateMachineryUsage,
  useDeleteMachinery,
  useMachineryList,
  useMachineryUsage,
  useUpdateMachinery,
} from "@/features/machinery";
import type {
  Machinery,
  MachineryPayload,
  MachineryUsagePayload,
} from "@/features/machinery";
import { formatCurrency, formatDate } from "@/lib/format";
import { useCrud } from "@/hooks/use-crud";

const typeLabel = (type: string) =>
  MACHINE_TYPES.find((t) => t.value === type)?.label ?? type;

export default function MachineryPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const slug = user ? roleSlug(user.role) : "";
  const toast = useToast();
  const canWrite = !!user && MACHINERY_WRITE_ROLES.includes(user.role);

  const projectName = useProjectName(id);
  const machineryQuery = useMachineryList();
  const usageQuery = useMachineryUsage(id);
  const workPackagesQuery = useWorkPackages(id);

  const createMachinery = useCreateMachinery();
  const updateMachinery = useUpdateMachinery();
  const deleteMachinery = useDeleteMachinery();
  const createUsage = useCreateMachineryUsage();

  const crud = useCrud<Machinery>({ resource: "machinery" });
  const [usageOpen, setUsageOpen] = useState(false);

  const machinery = useMemo(() => machineryQuery.data ?? [], [machineryQuery.data]);
  const usage = useMemo(() => usageQuery.data ?? [], [usageQuery.data]);
  const workPackages = useMemo(
    () => workPackagesQuery.data ?? [],
    [workPackagesQuery.data]
  );

  const machineIndex = useMemo(() => {
    const map = new Map<string, Machinery>();
    machinery.forEach((m) => map.set(m.id, m));
    return map;
  }, [machinery]);

  const wpIndex = useMemo(() => {
    const map = new Map<string, WorkPackage>();
    workPackages.forEach((wp) => map.set(wp.id, wp));
    return map;
  }, [workPackages]);

  const totalUsageCost = useMemo(
    () => usage.reduce((sum, row) => sum + row.amount, 0),
    [usage]
  );
  const totalHours = useMemo(
    () => usage.reduce((sum, row) => sum + row.hours_used, 0),
    [usage]
  );

  if (machineryQuery.isPending || usageQuery.isPending || workPackagesQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl">
        <LoadingState label="Loading machinery…" />
      </main>
    );
  }

  if (machineryQuery.isError || usageQuery.isError || workPackagesQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-6xl">
        <ErrorState
          title="Could not load machinery"
          description="Something went wrong while loading the machinery register and usage log."
          retry={
            <Button variant="outline" onClick={() => void machineryQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  async function handleSaveMachinery(payload: MachineryPayload) {
    if (crud.editing) {
      await updateMachinery.mutateAsync({ id: crud.editing.id, patch: payload });
      toast({ title: "Machinery updated", variant: "success" });
    } else {
      await createMachinery.mutateAsync(payload);
      toast({ title: "Machinery added", variant: "success" });
    }
    crud.setFormOpen(false);
    crud.setEditing(null);
  }

  function handleDelete() {
    void crud.confirmDelete(
      (mach) => deleteMachinery.mutateAsync(mach.id),
      { successLabel: "Machinery removed." }
    );
  }

  async function handleCreateUsage(payload: MachineryUsagePayload) {
    await createUsage.mutateAsync({ projectId: id, payload });
    setUsageOpen(false);
    const machine = machineIndex.get(payload.machinery);
    toast({
      title: "Usage recorded",
      description: `${machine?.name ?? "Machinery"} · ${payload.hours_used}h on ${payload.date}.`,
      variant: "success",
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Machinery"
        description={
          projectName
            ? `${projectName} — asset register and daily usage log feeding actual cost.`
            : "Asset register and daily usage log feeding actual cost."
        }
        actions={
          canWrite && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => crud.startCreate()}>
                Add machinery
              </Button>
              {machinery.length > 0 && workPackages.length > 0 && (
                <Button onClick={() => setUsageOpen(true)}>Record usage</Button>
              )}
            </div>
          )
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total usage cost"
          value={formatCurrency(totalUsageCost)}
          tone="primary"
          sub="derived hours × rate"
        />
        <KpiCard
          label="Machine hours"
          value={totalHours.toLocaleString("en-IN")}
          tone="info"
        />
        <KpiCard label="Assets on register" value={machinery.length} tone="neutral" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-text">Register</h2>
      <Card className="mt-2">
        {machinery.length === 0 ? (
          <EmptyState
            title="No machinery registered"
            description="Add the construction machinery to the shared register."
            action={
              canWrite ? (
                <Button onClick={() => crud.startCreate()}>Add machinery</Button>
              ) : undefined
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <ThCell>Asset</ThCell>
                <ThCell>Type</ThCell>
                <ThCell>Asset no</ThCell>
                <ThCell className="text-right">Daily rate</ThCell>
                <ThCell>‎</ThCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machinery.map((machine) => (
                <TableRow key={machine.id}>
                  <TdCell className="font-medium text-text">{machine.name}</TdCell>
                  <TdCell className="text-text-muted">{typeLabel(machine.type)}</TdCell>
                  <TdCell className="whitespace-nowrap text-text-muted">
                    {machine.asset_no}
                  </TdCell>
                  <TdCell className="whitespace-nowrap text-right tabular-nums">
                    ৳{machine.daily_rate.toLocaleString("en-IN")}
                  </TdCell>
                  <TdCell>
                    {canWrite && (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            crud.setEditing(machine);
                            crud.setFormOpen(true);
                          }}
                          className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => crud.requestDelete(machine, machine.id)}
                          className="text-xs font-medium text-danger transition-colors hover:text-danger-hover"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </TdCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <h2 className="mt-8 text-lg font-semibold text-text">Usage log</h2>
      <Card className="mt-2">
        {usage.length === 0 ? (
          <EmptyState
            title="No usage recorded"
            description={
              canWrite && machinery.length > 0 && workPackages.length > 0
                ? "Log machinery hours against a work package."
                : "Add machinery and work packages before logging usage."
            }
            action={
              canWrite && machinery.length > 0 && workPackages.length > 0 ? (
                <Button onClick={() => setUsageOpen(true)}>Record usage</Button>
              ) : undefined
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <ThCell>Date</ThCell>
                <ThCell>Machinery</ThCell>
                <ThCell>WP</ThCell>
                <ThCell>Operator</ThCell>
                <ThCell className="text-right">Hours</ThCell>
                <ThCell className="text-right">Rate/hr</ThCell>
                <ThCell className="text-right">Cost (derived)</ThCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.map((row) => (
                <TableRow key={row.id}>
                  <TdCell className="whitespace-nowrap text-text-muted">
                    {formatDate(row.date)}
                  </TdCell>
                  <TdCell>
                    <p className="font-medium text-text">
                      {machineIndex.get(row.machinery)?.name ?? row.machinery}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {machineIndex.get(row.machinery)?.asset_no ?? ""}
                    </p>
                  </TdCell>
                  <TdCell className="whitespace-nowrap text-text-muted">
                    {wpIndex.get(row.work_package)?.code ?? row.work_package}
                  </TdCell>
                  <TdCell className="text-text-muted">{row.operator || "—"}</TdCell>
                  <TdCell className="whitespace-nowrap text-right tabular-nums">
                    {row.hours_used}
                  </TdCell>
                  <TdCell className="whitespace-nowrap text-right tabular-nums text-text-muted">
                    {row.rate.toLocaleString("en-IN")}
                  </TdCell>
                  <TdCell className="whitespace-nowrap text-right font-semibold tabular-nums text-text">
                    {formatCurrency(row.amount)}
                  </TdCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <p className="mt-5 text-sm text-text-muted">
        <Link
          href={`/${slug}/projects/${id}`}
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          ← Back to project
        </Link>
      </p>

      <Modal
        open={crud.formOpen}
        onClose={() => {
          crud.setFormOpen(false);
          crud.setEditing(null);
        }}
        title={crud.editing ? "Edit machinery" : "Add machinery"}
        subtitle="Register belongs to the shared catalog used by all projects."
        size="lg"
      >
        <MachineryForm
          key={crud.editing?.id ?? "new"}
          initial={crud.editing ?? undefined}
          submitLabel={crud.editing ? "Save changes" : "Add machinery"}
          onCancel={() => {
            crud.setFormOpen(false);
            crud.setEditing(null);
          }}
          onSubmit={handleSaveMachinery}
        />
      </Modal>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        onClose={() => crud.setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete machinery"
        description={
          crud.deleteTarget ? (
            <>
              Remove <span className="font-semibold text-text">{crud.deleteTarget.name}</span> (
              {crud.deleteTarget.asset_no}) from the register? Existing usage records are kept.
            </>
          ) : undefined
        }
        busy={crud.busy}
      />

      <Modal
        open={usageOpen}
        onClose={() => setUsageOpen(false)}
        title="Record usage"
        subtitle="Daily machinery hire against a work package. Cost is derived."
        size="lg"
      >
        <MachineryUsageForm
          workPackages={workPackages}
          machinery={machinery}
          submitLabel="Record usage"
          onCancel={() => setUsageOpen(false)}
          onSubmit={handleCreateUsage}
        />
      </Modal>
    </main>
  );
}

function useProjectName(id: string) {
  const projectQuery = useProject(id);
  return projectQuery.data?.name ?? null;
}