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
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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
import { useCrud } from "@/hooks/use-crud";

export default function QualityPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = !!user && INSPECTION_WRITE_ROLES.includes(user.role);
  const canApprove = !!user && INSPECTION_APPROVE_ROLES.includes(user.role);
  const crud = useCrud<Inspection>({ resource: "inspection" });

  const projectQuery = useProject(id);
  const inspectionsQuery = useInspections(id);
  const createInspection = useCreateInspection(id);
  const updateInspection = useUpdateInspection(id);
  const deleteInspection = useDeleteInspection(id);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusEditing, setStatusEditing] = useState<Inspection | null>(null);
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
    crud.setFormOpen(false);
    crud.setEditing(null);
    toast({ title: "Inspection requested", variant: "success" });
  }

  async function handleStatusPatch(patch: InspectionPatch) {
    if (!statusEditing) return;
    await updateInspection.mutateAsync({ id: statusEditing.id, patch });
    setStatusOpen(false);
    setStatusEditing(null);
    toast({ title: "Inspection updated", variant: "success" });
  }

  function handleDelete() {
    void crud.confirmDelete(
      (insp) => deleteInspection.mutateAsync(insp.id),
      { successLabel: "Inspection deleted." }
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Quality Inspections"
        description={`${project.name} — inspection workflow`}
        actions={canWrite && <Button onClick={() => crud.startCreate()}>Request inspection</Button>}
      />

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
                    action={canWrite ? <Button onClick={() => crud.startCreate()}>Request inspection</Button> : undefined}
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
                                  setStatusEditing(insp);
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
                                    crud.setEditing(insp);
                                    crud.setFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => crud.requestDelete(insp, insp.id)}
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
        open={crud.formOpen}
        onClose={() => {
          crud.setFormOpen(false);
          crud.setEditing(null);
        }}
        title={crud.editing ? "Edit inspection" : "Request inspection"}
        subtitle={crud.editing ? undefined : "Request a QA inspection for a work package stage."}
        size="lg"
      >
        <InspectionForm
          key={crud.editing?.id ?? "new"}
          initial={crud.editing ?? undefined}
          projectId={id}
          submitLabel={crud.editing ? "Save changes" : "Request inspection"}
          onCancel={() => {
            crud.setFormOpen(false);
            crud.setEditing(null);
          }}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setStatusEditing(null);
        }}
        title="Update inspection status"
        subtitle="Schedule, pass or reject this inspection."
        size="lg"
      >
        {statusEditing && (
          <InspectionStatusForm
            inspection={statusEditing}
            onCancel={() => {
              setStatusOpen(false);
              setStatusEditing(null);
            }}
            onSubmit={handleStatusPatch}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        onClose={() => crud.setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete inspection"
        description={`Delete the ${INSPECTION_TYPES.find((t) => t.value === crud.deleteTarget?.type)?.label ?? "inspection"} inspection for ${crud.deleteTarget?.work_package_code}?`}
        busy={crud.busy}
      />
    </main>
  );
}