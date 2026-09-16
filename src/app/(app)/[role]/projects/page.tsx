"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Modal,
  Pagination,
  SkeletonRows,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TdCell,
  ThCell,
  useToast,
} from "@/components/ui";
import { roleSlug, useAuth } from "@/features/auth";
import {
  PROJECT_WRITE_ROLES,
  ProjectForm,
  ProjectStatusBadge,
  ProjectTypeBadge,
  useCreateProject,
  useProjects,
} from "@/features/projects";
import type { ProjectPayload } from "@/features/projects";
import { formatCurrency } from "@/lib/format";

const PAGE_SIZE = 6;

export default function ProjectsPage() {
  const { user } = useAuth();
  const slug = user ? roleSlug(user.role) : "";
  const canWrite = !!user && PROJECT_WRITE_ROLES.includes(user.role);
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const projectsQuery = useProjects({ page, page_size: PAGE_SIZE });
  const createProject = useCreateProject();

  const totalPages = projectsQuery.data
    ? Math.max(1, Math.ceil(projectsQuery.data.count / PAGE_SIZE))
    : 1;

  async function handleCreate(payload: ProjectPayload) {
    await createProject.mutateAsync(payload);
    setCreateOpen(false);
    toast({
      title: "Project created",
      description: `${payload.name} added to the portfolio.`,
      variant: "success",
    });
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Projects</h1>
          <p className="mt-1 text-sm text-text-muted">
            Portfolio overview — budget, cost, forecast & expected profit.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreateOpen(true)}>New project</Button>
        )}
      </div>

      <div className="mt-6">
        {projectsQuery.isPending ? (
          <Card>
            <div className="p-4">
              <SkeletonRows rows={PAGE_SIZE} columns={5} />
            </div>
          </Card>
        ) : projectsQuery.isError ? (
          <ErrorState
            title="Could not load projects"
            description={projectsQuery.error.message}
            retry={<Button variant="outline" onClick={() => projectsQuery.refetch()}>Retry</Button>}
          />
        ) : projectsQuery.data.results.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start tracking cost, progress and profitability."
            action={
              canWrite ? (
                <Button onClick={() => setCreateOpen(true)}>Create project</Button>
              ) : undefined
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <ThCell>Project</ThCell>
                  <ThCell>Type</ThCell>
                  <ThCell>Location</ThCell>
                  <ThCell>Status</ThCell>
                  <ThCell className="text-right">Budget</ThCell>
                  <ThCell>‎</ThCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsQuery.data.results.map((project) => (
                  <TableRow key={project.id}>
                    <TdCell>
                      <Link
                        href={`/${slug}/projects/${project.id}`}
                        className="font-semibold text-text transition-colors hover:text-primary"
                      >
                        {project.name}
                      </Link>
                    </TdCell>
                    <TdCell><ProjectTypeBadge type={project.type} /></TdCell>
                    <TdCell className="text-text-muted">{project.location}</TdCell>
                    <TdCell><ProjectStatusBadge status={project.status} /></TdCell>
                    <TdCell className="text-right font-medium tabular-nums">
                      {formatCurrency(project.budget)}
                    </TdCell>
                    <TdCell>
                      <Link
                        href={`/${slug}/projects/${project.id}`}
                        className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                      >
                        View
                      </Link>
                    </TdCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {!projectsQuery.isPending &&
        !projectsQuery.isError &&
        projectsQuery.data.count > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={projectsQuery.data.count}
            onPageChange={(next) => setPage(next)}
            className="mt-4"
          />
        )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create project"
        subtitle="Add a new construction project to the portfolio."
        size="lg"
      >
        <ProjectForm
          submitLabel="Create project"
          onCancel={() => setCreateOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>
    </main>
  );
}