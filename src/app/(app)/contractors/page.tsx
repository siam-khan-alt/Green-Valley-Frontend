"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Badge,
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
import { MODULE_ACCESS, RequireRole, useAuth } from "@/features/auth";
import { KpiCard, useProjects } from "@/features/projects";
import { workPackagesApi } from "@/features/work-packages";
import {
  CONTRACTORS_WRITE_ROLES,
  ContractorForm,
  ContractorTypeBadge,
  useContractors,
  useCreateContractor,
  useDeleteContractor,
  useUpdateContractor,
} from "@/features/contractors";
import type { Contractor, ContractorPayload } from "@/features/contractors";

interface Assignment {
  projectName: string;
  wpCode: string;
  wpName: string;
}

function ContractorsContent() {
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && CONTRACTORS_WRITE_ROLES.includes(user.role);

  const contractorsQuery = useContractors();
  const createContractor = useCreateContractor();
  const updateContractor = useUpdateContractor();
  const deleteContractor = useDeleteContractor();

  const projectsQuery = useProjects();
  const projects = useMemo(
    () => projectsQuery.data?.results ?? [],
    [projectsQuery.data]
  );

  const wpQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["work-packages", project.id],
      queryFn: () => workPackagesApi.list(project.id),
    })),
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contractor | null>(null);
  const [deleting, setDeleting] = useState<Contractor | null>(null);
  const [assigning, setAssigning] = useState<Contractor | null>(null);
  const [busy, setBusy] = useState(false);

  const contractors = useMemo(
    () => contractorsQuery.data ?? [],
    [contractorsQuery.data]
  );

  const assignments = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    projects.forEach((project, index) => {
      const workPackages = wpQueries[index]?.data ?? [];
      for (const wp of workPackages) {
        if (!wp.contractor?.trim()) continue;
        const list = map.get(wp.contractor) ?? [];
        list.push({ projectName: project.name, wpCode: wp.code, wpName: wp.name });
        map.set(wp.contractor, list);
      }
    });
    return map;
  }, [projects, wpQueries]);

  const assignedWps = useMemo(
    () => [...assignments.values()].reduce((sum, list) => sum + list.length, 0),
    [assignments]
  );

  if (contractorsQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <LoadingState label="Loading contractors…" />
      </main>
    );
  }

  if (contractorsQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <ErrorState
          title="Could not load contractors"
          description={contractorsQuery.error.message}
          retry={
            <Button variant="outline" onClick={() => void contractorsQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  const subcontractors = contractors.filter((c) => c.type === "subcontractor").length;

  const pendingAssignments = wpQueries.some((q) => q.isPending);

  async function handleSave(payload: ContractorPayload) {
    if (editing) {
      await updateContractor.mutateAsync({ id: editing.id, patch: payload });
      toast({ title: "Contractor updated", variant: "success" });
    } else {
      await createContractor.mutateAsync(payload);
      toast({ title: "Contractor added", variant: "success" });
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteContractor.mutateAsync(deleting.id);
      toast({ title: "Contractor removed", variant: "success" });
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Contractors</h1>
          <p className="mt-1 text-sm text-text-muted">
            Your contracting partners and their assigned work packages.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setFormOpen(true)}>Add contractor</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Contractors" value={contractors.length} tone="info" />
        <KpiCard
          label="Subcontractors"
          value={subcontractors}
          tone="success"
          sub={`${contractors.length - subcontractors} general contractors`}
        />
        <KpiCard
          label="Assigned work packages"
          value={assignedWps}
          tone="primary"
          sub="matched via the WP Contractor field"
        />
      </div>

      <div className="mt-6">
        {contractors.length === 0 ? (
          <EmptyState
            title="No contractors yet"
            description="Add the companies executing your work packages."
            action={
              canWrite ? (
                <Button onClick={() => setFormOpen(true)}>Add contractor</Button>
              ) : undefined
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <ThCell>Contractor</ThCell>
                  <ThCell>Type</ThCell>
                  <ThCell>Contact information</ThCell>
                  <ThCell>Assigned WPs</ThCell>
                  <ThCell>‎</ThCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractors.map((contractor) => {
                  const count = assignments.get(contractor.name)?.length ?? 0;
                  return (
                    <TableRow key={contractor.id}>
                      <TdCell className="font-medium text-text">{contractor.name}</TdCell>
                      <TdCell>
                        <ContractorTypeBadge type={contractor.type} />
                      </TdCell>
                      <TdCell className="text-text-muted">
                        {contractor.contact_info || "—"}
                      </TdCell>
                      <TdCell className="text-text-muted">{count}</TdCell>
                      <TdCell>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setAssigning(contractor)}
                            className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                          >
                            Assignments
                          </button>
                          {canWrite && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditing(contractor);
                                  setFormOpen(true);
                                }}
                                className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleting(contractor)}
                                className="text-xs font-medium text-danger transition-colors hover:text-danger-hover"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </TdCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit contractor" : "Add contractor"}
        subtitle="Used in the work package Contractor field."
        size="lg"
      >
        <ContractorForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          submitLabel={editing ? "Save changes" : "Add contractor"}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSave}
        />
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete contractor"
        subtitle="Removing a contractor from the roster."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Remove <span className="font-semibold text-text">{deleting?.name}</span> from the
          contractor roster? Existing work package references will keep the name.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={handleDelete}>
            Delete contractor
          </Button>
        </div>
      </Modal>

      <Modal
        open={assigning !== null}
        onClose={() => setAssigning(null)}
        title="Assigned work packages"
        subtitle={assigning ? `Assigned to ${assigning.name}` : undefined}
        size="lg"
      >
        {pendingAssignments ? (
          <LoadingState label="Loading assignments…" />
        ) : (
          <div className="space-y-2">
            {(assignments.get(assigning?.name ?? "") ?? []).length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">
                No work packages assigned yet. Pick this contractor in the Contractor field of a work
                package and it will show up here.
              </p>
            ) : (
              (assignments.get(assigning?.name ?? "") ?? []).map((assignment, index) => (
                <div
                  key={`${assignment.projectName}-${assignment.wpCode}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-md bg-surface px-3 py-2 text-sm"
                >
                  <span className="font-medium text-text">
                    {assignment.projectName}
                    <span className="ml-2 text-text-muted">— {assignment.wpName}</span>
                  </span>
                  <Badge variant="neutral">{assignment.wpCode}</Badge>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </main>
  );
}

export default function ContractorsPage() {
  return (
    <RequireRole roles={MODULE_ACCESS.contractors}>
      <ContractorsContent />
    </RequireRole>
  );
}