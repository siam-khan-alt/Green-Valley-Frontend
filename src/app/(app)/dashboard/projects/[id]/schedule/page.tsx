"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import {
  MilestoneForm,
  SCHEDULE_WRITE_ROLES,
  StatBox,
  Timeline,
  useCreateMilestone,
  useMilestones,
  useUpdateMilestone,
  milestoneOverdue,
} from "@/features/schedule";
import type { Milestone, MilestonePayload } from "@/features/schedule";

export default function SchedulePage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && SCHEDULE_WRITE_ROLES.includes(user.role);

  const projectName = useProjectName(id);

  const milestonesQuery = useMilestones(id);
  const createMilestone = useCreateMilestone();
  const updateMilestone = useUpdateMilestone();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);

  async function handleCreate(payload: MilestonePayload) {
    await createMilestone.mutateAsync({ projectId: id, payload });
    setCreateOpen(false);
    toast({ title: "Milestone added", variant: "success" });
  }

  async function handleUpdate(payload: MilestonePayload) {
    if (!editing) return;
    await updateMilestone.mutateAsync({ id: editing.id, payload });
    setEditing(null);
    toast({ title: "Milestone updated", variant: "success" });
  }

  if (milestonesQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-4xl">
        <LoadingState label="Loading schedule…" />
      </main>
    );
  }

  if (milestonesQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-4xl">
        <ErrorState
          title="Could not load schedule"
          description={milestonesQuery.error.message}
          retry={
            <Button variant="outline" onClick={() => milestonesQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  const milestones = milestonesQuery.data;
  const today = new Date();
  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.filter((m) => m.status === "in_progress").length;
  const delayed = milestones.filter(
    (m) => m.status === "delayed" || milestoneOverdue(m, today) !== null
  ).length;
  const pending = milestones.filter((m) => m.status === "not_started").length;

  return (
    <main className="mx-auto w-full max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Schedule</h1>
          <p className="mt-1 text-sm text-text-muted">
            {projectName ? `${projectName} — ` : ""}milestone timeline with
            planned vs actual tracking.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreateOpen(true)}>Add milestone</Button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Total" value={milestones.length} />
        <StatBox label="Completed" value={completed} tone="success" />
        <StatBox label="In progress" value={inProgress} tone="info" />
        <StatBox label="Behind schedule" value={delayed} tone={delayed > 0 ? "warning" : "neutral"} />
      </div>

      <Card className="mt-5">
        <CardHeader
          title="Milestones"
          subtitle={`${pending} not started · planned vs actual shown per step`}
        />
        <CardBody>
          {milestones.length === 0 ? (
            <EmptyState
              title="No milestones yet"
              description="Build the construction schedule to track dates and delays."
              action={
                canWrite ? (
                  <Button onClick={() => setCreateOpen(true)}>Add milestone</Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <Timeline milestones={milestones} />
              {canWrite && (
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-medium text-text">Update status</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {milestones.map((milestone) => (
                      <Button
                        key={milestone.id}
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditing(milestone)}
                      >
                        {milestone.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

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
        title="Add milestone"
        subtitle="Define a schedule step with its planned date."
      >
        <MilestoneForm
          onCancel={() => setCreateOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Update milestone"
        subtitle="Adjust dates or status; actual date drives the comparison."
      >
        {editing && (
          <MilestoneForm
            initial={editing}
            submitLabel="Save changes"
            onCancel={() => setEditing(null)}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
    </main>
  );
}

function useProjectName(id: string) {
  const projectQuery = useProject(id);
  return projectQuery.data?.name ?? null;
}