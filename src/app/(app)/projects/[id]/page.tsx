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
import {
  KpiCard,
  PROJECT_WRITE_ROLES,
  ProjectForm,
  ProjectStatusBadge,
  ProjectTypeBadge,
  Progress,
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "@/features/projects";
import type { ProjectPayload } from "@/features/projects";
import {
  formatCurrency,
  formatDateRange,
  formatNumber,
  formatPercent,
} from "@/lib/format";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const canWrite = !!user && PROJECT_WRITE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleUpdate(payload: ProjectPayload) {
    await updateProject.mutateAsync({ id, payload });
    setEditOpen(false);
    toast({
      title: "Project updated",
      description: "Portfolio figures refreshed.",
      variant: "success",
    });
  }

  async function handleDelete() {
    await deleteProject.mutateAsync(id);
    setDeleteOpen(false);
    toast({
      title: "Project deleted",
      description: "Project removed from the portfolio.",
      variant: "success",
    });
    router.replace("/projects");
  }

  if (projectQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <LoadingState label="Loading project…" />
      </main>
    );
  }

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <ErrorState
          title="Could not load project"
          description={projectQuery.error?.message ?? "Project not found."}
          retry={
            <Button variant="outline" onClick={() => projectQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  const project = projectQuery.data;
  const spentPct =
    project.budget > 0 ? (project.actual_cost / project.budget) * 100 : 0;
  const spentTone =
    spentPct >= 100 ? "danger" : spentPct >= 85 ? "warning" : "success";
  const forecastTone =
    project.forecast_final_cost > project.budget ? "warning" : "success";
  const profitTone = project.expected_profit >= 0 ? "success" : "danger";

  const progressTone =
    project.status === "delayed"
      ? "warning"
      : project.status === "completed"
        ? "primary"
        : "success";

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-text">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-1 text-sm text-text-muted">{project.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/projects/${id}/schedule`}>
            <Button variant="outline">Schedule</Button>
          </Link>
          <Link href={`/projects/${id}/work-packages`}>
            <Button variant="outline">Work packages</Button>
          </Link>
          <Link href={`/projects/${id}/boq`}>
            <Button variant="outline">BOQ</Button>
          </Link>
          <Link href={`/projects/${id}/procurement`}>
            <Button variant="outline">Procurement</Button>
          </Link>
          <Link href={`/projects/${id}/labor`}>
            <Button variant="outline">Labor</Button>
          </Link>
          <Link href={`/projects/${id}/machinery`}>
            <Button variant="outline">Machinery</Button>
          </Link>
          <Link href={`/projects/${id}/operations`}>
            <Button variant="outline">Operations (DPR)</Button>
          </Link>
          <Link href={`/projects/${id}/quality`}>
            <Button variant="outline">Quality</Button>
          </Link>
          <Link href={`/projects/${id}/billing`}>
            <Button variant="outline">Billing</Button>
          </Link>
          {canWrite && (
            <>
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteOpen(true)}
                loading={deleteProject.isPending}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Budget"
          value={formatCurrency(project.budget)}
          tone="primary"
        />
        <KpiCard
          label="Actual cost"
          value={formatCurrency(project.actual_cost)}
          tone={spentTone}
          sub={`${formatPercent(spentPct)} of budget spent`}
        />
        <KpiCard
          label="Forecast final cost"
          value={formatCurrency(project.forecast_final_cost)}
          tone={forecastTone}
          sub={forecastTone === "warning" ? "Over original budget" : "Within budget"}
        />
        <KpiCard
          label="Expected profit"
          value={formatCurrency(project.expected_profit)}
          tone={profitTone}
          sub={project.expected_profit >= 0 ? "Est. at completion" : "Loss at completion"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Progress" />
          <CardBody>
            <Progress value={project.progress_pct} tone={progressTone} />
            <p className="mt-2 text-xs text-text-muted">
              Derived from DPRs, measurements & work packages (never free-typed).
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Project details" />
          <CardBody className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <DetailRow label="Type" value={<ProjectTypeBadge type={project.type} />} />
            <DetailRow label="Location" value={project.location} />
            <DetailRow label="Client" value={project.client} />
            <DetailRow label="Timeline" value={formatDateRange(project.start_date, project.end_date)} />
            <DetailRow label="Built-up area" value={`${formatNumber(project.area_sqft)} sq ft`} />
            <DetailRow label="Units" value={formatNumber(project.units)} />
            <DetailRow label="Status" value={<ProjectStatusBadge status={project.status} />} />
            <DetailRow label="Project ID" value={<Badge variant="neutral">{project.id}</Badge>} />
          </CardBody>
        </Card>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit project"
        subtitle="Updates may shift forecast & expected profit."
        size="lg"
      >
        <ProjectForm
          initial={project}
          submitLabel="Save changes"
          onCancel={() => setEditOpen(false)}
          onSubmit={handleUpdate}
        />
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete project"
        subtitle="This will permanently remove the project and all attached records."
      >
        <p className="text-sm text-text">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{project.name}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleteProject.isPending} onClick={handleDelete}>
            Delete project
          </Button>
        </div>
      </Modal>

      <p className="mt-6 text-sm text-text-muted">
        <Link href="/projects" className="font-medium text-primary transition-colors hover:text-primary-hover">
          ← Back to projects
        </Link>
      </p>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium text-text">{value}</span>
    </div>
  );
}