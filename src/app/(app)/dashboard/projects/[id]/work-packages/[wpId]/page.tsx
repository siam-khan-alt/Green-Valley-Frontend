"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  ErrorState,
  LoadingState,
  Modal,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { KpiCard, Progress } from "@/features/projects";
import {
  WP_WRITE_ROLES,
  WorkPackageForm,
  WorkPackageStatusBadge,
  useDeleteWorkPackage,
  useUpdateWorkPackage,
  useWorkPackageSummary,
  useWorkPackages,
} from "@/features/work-packages";
import type { WorkPackagePayload } from "@/features/work-packages";
import {
  formatCurrency,
  formatDateRange,
  formatNumber,
} from "@/lib/format";

export default function WorkPackageDetailPage() {
  const params = useParams();
  const projectId = String(params.id);
  const wpId = String(params.wpId);
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const canWrite = !!user && WP_WRITE_ROLES.includes(user.role);

  const workPackagesQuery = useWorkPackages(projectId);
  const summaryQuery = useWorkPackageSummary(wpId);
  const updateWorkPackage = useUpdateWorkPackage();
  const deleteWorkPackage = useDeleteWorkPackage();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const wp = workPackagesQuery.data?.find((item) => item.id === wpId);

  async function handleUpdate(payload: WorkPackagePayload) {
    await updateWorkPackage.mutateAsync({ id: wpId, payload });
    setEditOpen(false);
    toast({ title: "Work package updated", variant: "success" });
  }

  async function handleDelete() {
    await deleteWorkPackage.mutateAsync(wpId);
    setDeleteOpen(false);
    toast({ title: "Work package deleted", variant: "success" });
    router.replace(`/dashboard/projects/${projectId}/work-packages`);
  }

  if (workPackagesQuery.isPending || summaryQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-4xl">
        <LoadingState label="Loading work package…" />
      </main>
    );
  }

  if (workPackagesQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-4xl">
        <ErrorState
          title="Could not load work packages"
          description={workPackagesQuery.error.message}
          retry={
            <Button variant="outline" onClick={() => workPackagesQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  if (!wp) {
    return (
      <main className="mx-auto w-full max-w-4xl">
        <ErrorState
          title="Work package not found"
          description="It may have been deleted."
          retry={
            <Button variant="outline" onClick={() => workPackagesQuery.refetch()}>
              Back to work packages
            </Button>
          }
        />
      </main>
    );
  }

  const summary = summaryQuery.data;

  const totalCost =
    (summary?.labor_cost ?? 0) + (summary?.po_cost ?? 0);
  const surplus =
    (summary?.boq_scope ?? 0) - totalCost;
  const surplusPct =
    summary && summary.boq_scope > 0
      ? (totalCost / summary.boq_scope) * 100
      : 0;

  return (
    <main className="mx-auto w-full max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{wp.code}</Badge>
            <h1 className="text-xl font-bold text-text">{wp.name}</h1>
            <WorkPackageStatusBadge status={wp.status} />
          </div>
          <p className="mt-1 text-sm text-text-muted">{wp.description}</p>
        </div>
        {canWrite && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setDeleteOpen(true)}
              loading={deleteWorkPackage.isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="BOQ scope"
          value={summary ? formatCurrency(summary.boq_scope) : "—"}
          tone="primary"
          sub="Budget baseline from BOQ"
        />
        <KpiCard
          label="Measured quantity"
          value={summary ? formatNumber(summary.measured_quantity) : "—"}
          tone="info"
          sub="From approved measurements"
        />
        <KpiCard
          label="Labor cost"
          value={summary ? formatCurrency(summary.labor_cost) : "—"}
          tone={summary && summary.labor_cost > 0 ? "warning" : "neutral"}
          sub="Muster roll & labor entries"
        />
        <KpiCard
          label="PO cost"
          value={summary ? formatCurrency(summary.po_cost) : "—"}
          tone={summary && summary.po_cost > 0 ? "warning" : "neutral"}
          sub="Purchase orders & GRNs"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Progress" />
          <CardBody>
            <Progress
              value={summary?.progress_pct ?? 0}
              tone={wp.status === "on_hold" ? "warning" : "success"}
            />
            <p className="mt-2 text-xs text-text-muted">
              Derived from DPRs and approved measurements.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Cost & RA bill" />
          <CardBody className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <DetailRow
              label="Total cost"
              value={
                <span className={surplus < 0 ? "text-danger" : "text-text"}>
                  {formatCurrency(totalCost)}
                </span>
              }
              sub={`${surplusPct.toFixed(0)}% of BOQ scope`}
            />
            <DetailRow
              label="Surplus vs scope"
              value={
                <span className={surplus >= 0 ? "text-success" : "text-danger"}>
                  {formatCurrency(surplus)}
                </span>
              }
            />
            <DetailRow
              label="RA bill value"
              value={formatCurrency(summary?.ra_bill_value ?? 0)}
            />
            <DetailRow label="Contractor" value={wp.contractor || "—"} />
            <DetailRow
              label="Planned window"
              value={formatDateRange(wp.planned_start, wp.planned_end)}
            />
            <DetailRow label="Status" value={<WorkPackageStatusBadge status={wp.status} />} />
          </CardBody>
        </Card>
      </div>

      <p className="mt-5 text-sm text-text-muted">
        <Link
          href={`/dashboard/projects/${projectId}/work-packages`}
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          ← Back to work packages
        </Link>
      </p>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit work package"
        size="lg"
      >
        {wp && (
          <WorkPackageForm
            initial={wp}
            submitLabel="Save changes"
            onCancel={() => setEditOpen(false)}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete work package"
        subtitle="Removes the package and its summary."
      >
        <p className="text-sm text-text">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{wp.code} · {wp.name}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteWorkPackage.isPending}
            onClick={handleDelete}
          >
            Delete package
          </Button>
        </div>
      </Modal>
    </main>
  );
}

function DetailRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
      <div>
        <span className="text-text-muted">{label}</span>
        {sub && <p className="mt-0.5 text-xs text-text-muted">{sub}</p>}
      </div>
      <span className="text-right font-medium text-text">{value}</span>
    </div>
  );
}