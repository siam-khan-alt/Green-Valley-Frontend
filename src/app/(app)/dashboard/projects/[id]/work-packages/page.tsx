"use client";

import { useState } from "react";
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
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import {
  WP_WRITE_ROLES,
  WorkPackageForm,
  WorkPackageStatusBadge,
  useCreateWorkPackage,
  useWorkPackages,
} from "@/features/work-packages";
import type { WorkPackagePayload } from "@/features/work-packages";
import { formatDate } from "@/lib/format";

function codePrefix(): string {
  return `WP-`;
}

export default function WorkPackagesPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && WP_WRITE_ROLES.includes(user.role);

  const projectName = useProjectName(id);
  const workPackagesQuery = useWorkPackages(id);
  const createWorkPackage = useCreateWorkPackage();

  const [createOpen, setCreateOpen] = useState(false);

  async function handleCreate(payload: WorkPackagePayload) {
    await createWorkPackage.mutateAsync({ projectId: id, payload });
    setCreateOpen(false);
    toast({
      title: "Work package added",
      description: `${payload.code} · ${payload.name}`,
      variant: "success",
    });
  }

  if (workPackagesQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <LoadingState label="Loading work packages…" />
      </main>
    );
  }

  if (workPackagesQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-5xl">
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

  const workPackages = workPackagesQuery.data;

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Work packages</h1>
          <p className="mt-1 text-sm text-text-muted">
            {projectName ? `${projectName} — ` : ""}scope breakdown with cost and
            progress summaries.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreateOpen(true)}>Add work package</Button>
        )}
      </div>

      <div className="mt-6">
        {workPackages.length === 0 ? (
          <EmptyState
            title="No work packages yet"
            description="Break the project into scoped packages to track cost and progress."
            action={
              canWrite ? (
                <Button onClick={() => setCreateOpen(true)}>Add work package</Button>
              ) : undefined
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <ThCell>Code</ThCell>
                  <ThCell>Work package</ThCell>
                  <ThCell>Contractor</ThCell>
                  <ThCell>Status</ThCell>
                  <ThCell>Planned</ThCell>
                  <ThCell>‎</ThCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workPackages.map((wp) => (
                  <TableRow key={wp.id}>
                    <TdCell className="whitespace-nowrap font-semibold text-primary">
                      {wp.code}
                    </TdCell>
                    <TdCell>
                      <Link
                        href={`/dashboard/projects/${id}/work-packages/${wp.id}`}
                        className="font-medium text-text transition-colors hover:text-primary"
                      >
                        {wp.name}
                      </Link>
                    </TdCell>
                    <TdCell className="text-text-muted">{wp.contractor || "—"}</TdCell>
                    <TdCell>
                      <WorkPackageStatusBadge status={wp.status} />
                    </TdCell>
                    <TdCell className="whitespace-nowrap text-text-muted">
                      {formatDate(wp.planned_start)} – {formatDate(wp.planned_end)}
                    </TdCell>
                    <TdCell>
                      <Link
                        href={`/dashboard/projects/${id}/work-packages/${wp.id}`}
                        className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                      >
                        Summary
                      </Link>
                    </TdCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <p className="mt-5 text-sm text-text-muted">
        <Link
          href={`/dashboard/projects/${id}`}
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          ← Back to project
        </Link>
      </p>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add work package"
        subtitle="Define a scoped package with its planned window."
        size="lg"
      >
        <WorkPackageForm
          projectCodePrefix={codePrefix()}
          submitLabel="Add work package"
          onCancel={() => setCreateOpen(false)}
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