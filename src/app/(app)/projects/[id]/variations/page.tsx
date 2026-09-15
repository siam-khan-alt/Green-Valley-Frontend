"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import {
  VARIATION_APPROVE_ROLES,
  VARIATION_WRITE_ROLES,
  VariationForm,
  VariationStatusBadge,
  useCreateVariation,
  useUpdateVariation,
  useVariations,
} from "@/features/variations";
import type { Variation, VariationPayload } from "@/features/variations";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export default function VariationsPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = !!user && VARIATION_WRITE_ROLES.includes(user.role);
  const canApprove = !!user && VARIATION_APPROVE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const variationsQuery = useVariations(id);
  const createVariation = useCreateVariation(id);
  const updateVariation = useUpdateVariation(id);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Variation | null>(null);

  const kpis = useMemo(() => {
    const variations = variationsQuery.data ?? [];
    const approved = variations.filter((v) => v.status === "approved");
    const totalImpact = approved.reduce((sum, v) => sum + v.cost_impact, 0);
    const totalDays = approved.reduce((sum, v) => sum + v.schedule_impact_days, 0);
    return {
      openCount: variations.filter((v) => v.status === "proposed").length,
      approvedCount: approved.length,
      totalImpact,
      totalDays,
    };
  }, [variationsQuery.data]);

  if (projectQuery.isPending || variationsQuery.isPending) {
    return <LoadingState label="Loading variations…" />;
  }

  if (projectQuery.isError || variationsQuery.isError) {
    return (
      <ErrorState
        title="Could not load variations"
        description={projectQuery.error?.message ?? variationsQuery.error?.message}
        retry={
          <Button variant="outline" onClick={() => void variationsQuery.refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  const project = projectQuery.data;
  if (!project) return null;

  const variations = variationsQuery.data ?? [];

  async function handleSave(payload: VariationPayload) {
    if (editing) {
      await updateVariation.mutateAsync({ id: editing.id, patch: payload });
      toast({ title: "Variation updated", variant: "success" });
    } else {
      await createVariation.mutateAsync(payload);
      toast({ title: "Variation proposed", variant: "success" });
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleStatus(status: "approved" | "rejected") {
    if (!editing) return;
    await updateVariation.mutateAsync({ id: editing.id, patch: { status } });
    toast({ title: status === "approved" ? "Variation approved" : "Variation rejected", variant: status === "approved" ? "success" : "info" });
    setEditing(null);
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Variations</h1>
          <p className="mt-1 text-sm text-text-muted">
            {project.name} — change orders & scope adjustments
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setFormOpen(true)}>Propose variation</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Pending review</p>
          <p className="text-2xl font-bold text-text">{kpis.openCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Approved</p>
          <p className="text-2xl font-bold text-text">{kpis.approvedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Cost impact</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(kpis.totalImpact)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Schedule impact</p>
          <p className="text-2xl font-bold text-text">{formatNumber(kpis.totalDays)} days</p>
        </Card>
      </div>

      <div className="mt-6">
        {variations.length === 0 ? (
          <EmptyState
            title="No variations yet"
            description="Propose a change order when the client alters scope, and track its cost & schedule impact."
            action={canWrite ? <Button onClick={() => setFormOpen(true)}>Propose variation</Button> : undefined}
          />
        ) : (
          <div className="space-y-3">
            {variations.map((v) => (
              <Card key={v.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-text">{v.description}</span>
                      <VariationStatusBadge status={v.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <span className="text-text-muted">
                        Cost impact{" "}
                        <span className={`font-medium ${v.cost_impact >= 0 ? "text-text" : "text-success"}`}>
                          {v.cost_impact >= 0 ? "+" : ""}{formatCurrency(v.cost_impact)}
                        </span>
                      </span>
                      <span className="text-text-muted">
                        Schedule <span className="font-medium text-text">+{formatNumber(v.schedule_impact_days)} days</span>
                      </span>
                      <span className="text-xs text-text-muted">{formatDate(v.created_at)}</span>
                    </div>
                    {v.notes && <p className="mt-2 text-sm text-text-muted">{v.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {canApprove && v.status === "proposed" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => { setEditing(v); void handleStatus("approved"); }}>
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger hover:text-danger" onClick={() => { setEditing(v); void handleStatus("rejected"); }}>
                          Reject
                        </Button>
                      </>
                    )}
                    {canWrite && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditing(v); setFormOpen(true); }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit variation" : "Propose variation"}
        subtitle="Scope change with cost & schedule impact, tracked until approved."
        size="lg"
      >
        <VariationForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
          onSubmit={handleSave}
        />
      </Modal>
    </main>
  );
}