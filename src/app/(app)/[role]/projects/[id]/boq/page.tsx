"use client";

import { useMemo } from "react";
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
import {
  BOQ_WRITE_ROLES,
  BoqItemForm,
  useBoq,
  useCreateBoqItem,
  useDeleteBoqItem,
  useUpdateBoqItem,
} from "@/features/boq";
import type { BoqItem, BoqItemPayload } from "@/features/boq";
import { useWorkPackages, WorkPackageStatusBadge } from "@/features/work-packages";
import type { WorkPackage } from "@/features/work-packages";
import { formatCurrency } from "@/lib/format";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCrud } from "@/hooks/use-crud";

export default function BoqPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const slug = user ? roleSlug(user.role) : "";
  const toast = useToast();
  const canWrite = !!user && BOQ_WRITE_ROLES.includes(user.role);

  const projectName = useProjectName(id);
  const boqQuery = useBoq(id);
  const workPackagesQuery = useWorkPackages(id);
  const createItem = useCreateBoqItem(id);
  const updateItem = useUpdateBoqItem();
  const deleteItem = useDeleteBoqItem();

  const crud = useCrud<BoqItem>({ resource: "boq" });

  const groups = useMemo(() => {
    const items = boqQuery.data?.items ?? [];
    const packages = workPackagesQuery.data ?? [];
    const byPackage = new Map<string, BoqItem[]>();
    for (const item of items) {
      const list = byPackage.get(item.work_package) ?? [];
      list.push(item);
      byPackage.set(item.work_package, list);
    }
    const included = new Set(items.map((i) => i.work_package));
    return packages
      .filter((wp) => included.has(wp.id))
      .map((wp) => ({ workPackage: wp, items: byPackage.get(wp.id) ?? [] }));
  }, [boqQuery.data, workPackagesQuery.data]);

  const total = useMemo(
    () =>
      (boqQuery.data?.items ?? []).reduce((sum, item) => sum + item.amount, 0),
    [boqQuery.data]
  );

  const largest = useMemo(() => {
    const items = boqQuery.data?.items ?? [];
    return items.reduce<BoqItem | null>(
      (max, item) => (max === null || item.amount > max.amount ? item : max),
      null
    );
  }, [boqQuery.data]);

  if (boqQuery.isPending || workPackagesQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <LoadingState label="Loading BOQ…" />
      </main>
    );
  }

  if (boqQuery.isError || workPackagesQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <ErrorState
          title="Could not load BOQ"
          description={
            boqQuery.error?.message ?? workPackagesQuery.error?.message ?? "Unknown error"
          }
          retry={
            <Button
              variant="outline"
              onClick={() => {
                void boqQuery.refetch();
                void workPackagesQuery.refetch();
              }}
            >
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  const boq = boqQuery.data;
  const workPackages = workPackagesQuery.data;

  async function handleSave(payload: BoqItemPayload) {
    if (crud.editing) {
      await updateItem.mutateAsync({ id: crud.editing.id, patch: payload });
      toast({
        title: "Item updated",
        description: payload.material,
        variant: "success",
      });
    } else {
      await createItem.mutateAsync(payload);
      toast({
        title: "Item added",
        description: payload.material,
        variant: "success",
      });
    }
    crud.setFormOpen(false);
    crud.setEditing(null);
  }

  function handleDelete() {
    void crud.confirmDelete(
      (item) => deleteItem.mutateAsync(item.id),
      { successLabel: "Item removed from the BOQ." }
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <PageHeader
        title={
          <>
            Bill of quantities
            <span className="ml-2 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted">
              {boq.version}
            </span>
          </>
        }
        description={
          projectName
            ? `${projectName} — itemized cost baseline with running totals grouped by work package.`
            : "Itemized cost baseline with running totals grouped by work package."
        }
        actions={
          canWrite && boq.items.length > 0 ? (
            <Button variant="outline" onClick={() => crud.startCreate()}>
              Add item
            </Button>
          ) : undefined
        }
      />

      {boq.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={
              workPackages.length === 0
                ? "No work packages yet"
                : "No BOQ items yet"
            }
            description={
              workPackages.length === 0
                ? "Add work packages first, then itemize the cost of each package in the BOQ."
                : "Itemize quantities and rates to build the project cost baseline."
            }
            action={
              canWrite && workPackages.length > 0 ? (
                <Button onClick={() => crud.startCreate()}>Add first item</Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Budget baseline"
              value={formatCurrency(total)}
              tone="primary"
              sub={`${boq.items.length} item${boq.items.length === 1 ? "" : "s"} measured`}
            />
            <KpiCard
              label="Packages measured"
              value={groups.length}
              tone="info"
              sub={`of ${workPackages.length} work packages`}
            />
            <KpiCard
              label="Largest item"
              value={largest ? formatCurrency(largest.amount) : "—"}
              tone="neutral"
              sub={largest?.material}
            />
            <KpiCard
              label="Average item rate"
              value={
                boq.items.length > 0
                  ? formatCurrency(Math.round(total / boq.items.length))
                  : "—"
              }
              tone="muted"
            />
          </div>

          <Card className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <ThCell>Item / material</ThCell>
                  <ThCell>Work package</ThCell>
                  <ThCell className="text-right">Quantity</ThCell>
                  <ThCell className="text-right">Rate</ThCell>
                  <ThCell className="text-right">Amount</ThCell>
                  <ThCell>‎</ThCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map(({ workPackage, items }) => (
                  <WorkPackageGroup
                    key={workPackage.id}
                    workPackage={workPackage}
                    items={items}
                    canWrite={canWrite}
                    onEdit={(item) => {
                      crud.setEditing(item);
                      crud.setFormOpen(true);
                    }}
                    onDelete={(item) => crud.requestDelete(item, item.id)}
                  />
                ))}
                <TableRow className="bg-surface font-semibold">
                  <TdCell colSpan={4} className="text-right text-text">
                    Total ({boq.items.length} items)
                  </TdCell>
                  <TdCell className="text-right text-primary">
                    {formatCurrency(total)}
                  </TdCell>
                  <TdCell>‎</TdCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          <p className="mt-2 text-xs text-text-muted">
            Amount is derived as quantity × rate. Rates are exclusive of VAT.
          </p>
        </>
      )}

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
        title={crud.editing ? "Edit BOQ item" : "Add BOQ item"}
        subtitle="Quantity and rate must be greater than zero; amount is derived."
        size="lg"
      >
        <BoqItemForm
          key={crud.editing?.id ?? "new"}
          workPackages={workPackages}
          initial={crud.editing ?? undefined}
          submitLabel={crud.editing ? "Save changes" : "Add item"}
          onCancel={() => {
            crud.setFormOpen(false);
            crud.setEditing(null);
          }}
          onSubmit={handleSave}
        />
      </Modal>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        onClose={() => crud.setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete BOQ item"
        description={
          crud.deleteTarget ? (
            <>
              Remove{" "}
              <span className="font-semibold text-text">{crud.deleteTarget.material}</span>{" "}
              ({formatCurrency(crud.deleteTarget.amount)}) from this project&apos;s
              BOQ? This cannot be undone.
            </>
          ) : undefined
        }
        busy={crud.busy}
      />
    </main>
  );
}

function WorkPackageGroup({
  workPackage,
  items,
  canWrite,
  onEdit,
  onDelete,
}: {
  workPackage: WorkPackage;
  items: BoqItem[];
  canWrite: boolean;
  onEdit: (item: BoqItem) => void;
  onDelete: (item: BoqItem) => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  return (
    <>
      <TableRow className="bg-surface">
        <TdCell colSpan={2} className="font-semibold text-text">
          {workPackage.code}
        </TdCell>
        <TdCell className="text-xs font-medium text-text-muted">
          {workPackage.name}
        </TdCell>
        <TdCell>
          <WorkPackageStatusBadge status={workPackage.status} />
        </TdCell>
        <TdCell className="font-semibold text-text">→ {formatCurrency(subtotal)}</TdCell>
        <TdCell>‎</TdCell>
      </TableRow>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TdCell>
            <p className="font-medium text-text">{item.material}</p>
            {item.description && (
              <p className="mt-0.5 text-xs text-text-muted">{item.description}</p>
            )}
          </TdCell>
          <TdCell className="whitespace-nowrap text-text-muted">
            {item.unit}
          </TdCell>
          <TdCell className="whitespace-nowrap text-right tabular-nums">
            {item.quantity.toLocaleString("en-IN")}
          </TdCell>
          <TdCell className="whitespace-nowrap text-right tabular-nums">
            ৳{Math.round(item.rate).toLocaleString("en-IN")}
          </TdCell>
          <TdCell className="whitespace-nowrap text-right font-semibold tabular-nums text-text">
            {formatCurrency(item.amount)}
          </TdCell>
          <TdCell>
            {canWrite && (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="text-xs font-medium text-danger transition-colors hover:text-danger-hover"
                >
                  Delete
                </button>
              </div>
            )}
          </TdCell>
        </TableRow>
      ))}
    </>
  );
}

function useProjectName(id: string) {
  const projectQuery = useProject(id);
  return projectQuery.data?.name ?? null;
}