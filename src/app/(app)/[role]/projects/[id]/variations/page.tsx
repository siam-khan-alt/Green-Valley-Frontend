"use client";

import { useMemo } from "react";
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
import { PageHeader } from "@/components/shared/PageHeader";
import { useCrud } from "@/hooks/use-crud";

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

  const crud = useCrud<Variation>({ resource: "variation" });

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
    if (crud.editing) {
      await updateVariation.mutateAsync({ id: crud.editing.id, patch: payload });
      toast({ title: "Variation updated", variant: "success" });
    } else {
      await createVariation.mutateAsync(payload);
      toast({ title: "Variation proposed", variant: "success" });
    }
    crud.setFormOpen(false);
    crud.setEditing(null);
  }

  async function handleStatus(v: Variation, status: "approved" | "rejected") {
    await updateVariation.mutateAsync({ id: v.id, patch: { status } });
    toast({ title: status === "approved" ? "Variation approved" : "Variation rejected", variant: status === "approved" ? "success" : "info" });
    crud.setEditing(null);
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Variations"
        description={`${project.name} — change orders & scope adjustments`}
        actions={canWrite && <Button onClick={() => crud.startCreate()}>Propose variation</Button>}
      />

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
            action={canWrite ? <Button onClick={() => crud.startCreate()}>Propose variation</Button> : undefined}
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
                        <Button variant="outline" size="sm" onClick={() => { void handleStatus(v, "approved"); }}>
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger hover:text-danger" onClick={() => { void handleStatus(v, "rejected"); }}>
                          Reject
                        </Button>
                      </>
                    )}
                    {canWrite && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { crud.setEditing(v); crud.setFormOpen(true); }}
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
        open={crud.formOpen}
        onClose={() => { crud.setFormOpen(false); crud.setEditing(null); }}
        title={crud.editing ? "Edit variation" : "Propose variation"}
        subtitle="Scope change with cost & schedule impact, tracked until approved."
        size="lg"
      >
        <VariationForm
          key={crud.editing?.id ?? "new"}
          initial={crud.editing ?? undefined}
          onCancel={() => { crud.setFormOpen(false); crud.setEditing(null); }}
          onSubmit={handleSave}
        />
      </Modal>
    </main>
  );
}