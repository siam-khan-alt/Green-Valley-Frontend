"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Tabs,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import {
  INSPECTION_APPROVE_ROLES,
  INSPECTION_TYPES,
  INSPECTION_WRITE_ROLES,
  InspectionForm,
  InspectionStatusForm,
  InspectionStatusBadge,
  useCreateInspection,
  useDeleteInspection,
  useInspections,
  useUpdateInspection,
} from "@/features/quality";
import type { Inspection, InspectionPayload, InspectionPatch } from "@/features/quality";
import { formatDate } from "@/lib/format";

export default function QualityPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = !!user && INSPECTION_WRITE_ROLES.includes(user.role);
  const canApprove = !!user && INSPECTION_APPROVE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const inspectionsQuery = useInspections(id);
  const createInspection = useCreateInspection(id);
  const updateInspection = useUpdateInspection(id);
  const deleteInspection = useDeleteInspection(id);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Inspection | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleting, setDeleting] = useState<Inspection | null>(null);
  const [activeTab, setActiveTab] = useState("open");

  if (projectQuery.isPending || inspectionsQuery.isPending) {
    return <LoadingState label="Loading inspections…" />;
  }

  if (projectQuery.isError || inspectionsQuery.isError) {
    return (
      <ErrorState
        title="Could not load inspections"
        description={projectQuery.error?.message ?? inspectionsQuery.error?.message}
        retry={
          <Button variant="outline" onClick={() => inspectionsQuery.refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  const project = projectQuery.data;
  if (!project) return null;

  const inspections = inspectionsQuery.data ?? [];
  const openInspections = inspections.filter((i) => i.status === "requested" || i.status === "scheduled");
  const closedInspections = inspections.filter((i) => i.status === "passed" || i.status === "rejected" || i.status === "cancelled");

  const passedCount = inspections.filter((i) => i.status === "passed").length;
  const rejectedCount = inspections.filter((i) => i.status === "rejected").length;
  const passRate = inspections.length > 0 ? Math.round((passedCount / inspections.length) * 100) : 0;

  async function handleCreate(payload: InspectionPayload) {
    await createInspection.mutateAsync(payload);
    setFormOpen(false);
    setEditing(null);
    toast({ title: "Inspection requested", variant: "success" });
  }

  async function handleStatusPatch(patch: InspectionPatch) {
    if (!editing) return;
    await updateInspection.mutateAsync({ id: editing.id, patch });
    setStatusOpen(false);
    setEditing(null);
    toast({ title: "Inspection updated", variant: "success" });
  }

  async function handleDelete() {
    if (!deleting) return;
    await deleteInspection.mutateAsync(deleting.id);
    setDeleting(null);
    toast({ title: "Inspection deleted", variant: "success" });
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Quality Inspections</h1>
          <p className="mt-1 text-sm text-text-muted">{project.name} — inspection workflow</p>
        </div>
        {canWrite && (
          <Button onClick={() => setFormOpen(true)}>Request inspection</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Open</p>
          <p className="text-2xl font-bold text-text">{openInspections.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Passed</p>
          <p className="text-2xl font-bold text-text">{passedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Rejected</p>
          <p className="text-2xl font-bold text-text">{rejectedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Pass rate</p>
          <p className="text-2xl font-bold text-text">{passRate}%</p>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: "open", label: `Open (${openInspections.length})` },
            { value: "closed", label: `Closed (${closedInspections.length})` },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        >
          {(activeValue) => (
            activeValue === "open" ? (
              <div className="mt-1">
                {openInspections.length === 0 ? (
                  <EmptyState
                    title="No open inspections"
                    description="All inspections have been resolved. Request a new inspection when a stage is ready for review."
                    action={canWrite ? <Button onClick={() => setFormOpen(true)}>Request inspection</Button> : undefined}
                  />
                ) : (
                  <div className="space-y-3">
                    {openInspections.map((insp) => (
                      <Card key={insp.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-text">{insp.work_package_code}</span>
                              <Badge variant="neutral">{insp.work_package_name}</Badge>
                              <Badge variant="info">{INSPECTION_TYPES.find((t) => t.value === insp.type)?.label ?? insp.type}</Badge>
                              <InspectionStatusBadge status={insp.status} />
                            </div>
                            <p className="text-sm text-text-muted">
                              Requested by {insp.requested_by} · scheduled {formatDate(insp.scheduled_date)}
                            </p>
                            {insp.remarks && <p className="mt-2 text-sm text-text-muted">{insp.remarks}</p>}
                          </div>
                          <div className="flex gap-2">
                            {canApprove && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditing(insp);
                                  setStatusOpen(true);
                                }}
                              >
                                Update status
                              </Button>
                            )}
                            {canWrite && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditing(insp);
                                    setFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => setDeleting(insp)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-1">
                {closedInspections.length === 0 ? (
                  <EmptyState title="No closed inspections" description="Resolved inspections will appear here." />
                ) : (
                  <div className="space-y-3">
                    {closedInspections.map((insp) => (
                      <Card key={insp.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-text">{insp.work_package_code}</span>
                              <Badge variant="neutral">{insp.work_package_name}</Badge>
                              <Badge variant="info">{INSPECTION_TYPES.find((t) => t.value === insp.type)?.label ?? insp.type}</Badge>
                              <InspectionStatusBadge status={insp.status} />
                            </div>
                            <p className="text-sm text-text-muted">
                              Requested by {insp.requested_by} · {formatDate(insp.scheduled_date)}
                            </p>
                            {insp.remarks && <p className="mt-2 text-sm text-text-muted">{insp.remarks}</p>}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </Tabs>
      </div>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit inspection" : "Request inspection"}
        subtitle={editing ? undefined : "Request a QA inspection for a work package stage."}
        size="lg"
      >
        <InspectionForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          projectId={id}
          submitLabel={editing ? "Save changes" : "Request inspection"}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setEditing(null);
        }}
        title="Update inspection status"
        subtitle="Schedule, pass or reject this inspection."
        size="lg"
      >
        {editing && (
          <InspectionStatusForm
            inspection={editing}
            onCancel={() => {
              setStatusOpen(false);
              setEditing(null);
            }}
            onSubmit={handleStatusPatch}
          />
        )}
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete inspection"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Delete the {INSPECTION_TYPES.find((t) => t.value === deleting?.type)?.label ?? "inspection"} inspection for{" "}
          <span className="font-semibold text-text">{deleting?.work_package_code}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete inspection</Button>
        </div>
      </Modal>
    </main>
  );
}