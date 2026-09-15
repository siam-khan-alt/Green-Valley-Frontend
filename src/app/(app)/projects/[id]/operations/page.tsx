"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Select,
  Modal,
  Tabs,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import { useWorkPackages } from "@/features/work-packages";
import {
  DPR_WRITE_ROLES,
  DprForm,
  DprProgressChart,
  useCreateDpr,
  useDeleteDpr,
  useDprList,
  useUpdateDpr,
} from "@/features/operations";
import type { DailyProgressReport, DprPayload } from "@/features/operations";

export default function OperationsPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = !!user && DPR_WRITE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const wpQuery = useWorkPackages(id);
  const dprQuery = useDprList(id);
  const createDpr = useCreateDpr(id);
  const updateDpr = useUpdateDpr(id);
  const deleteDpr = useDeleteDpr(id);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DailyProgressReport | null>(null);
  const [deleting, setDeleting] = useState<DailyProgressReport | null>(null);
  const [chartWpId, setChartWpId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("feed");
  const projectId = id;

  const dprs = dprQuery.data ?? [];

  const summary = useMemo(
    () => {
      return dprs.reduce(
        (acc, d) => {
          const laborCost = d.labor_entries.reduce(
            (sum, e) => sum + e.head_count * e.hours_worked * e.rate,
            0
          );
          const machineryCost = d.machinery_entries.reduce(
            (sum, e) => sum + e.hours_used * e.rate,
            0
          );
          return {
            totalReports: acc.totalReports + 1,
            totalQuantity: acc.totalQuantity + d.quantity_achieved,
            totalLaborCost: acc.totalLaborCost + laborCost,
            totalMachineryCost: acc.totalMachineryCost + machineryCost,
          };
        },
        { totalReports: 0, totalQuantity: 0, totalLaborCost: 0, totalMachineryCost: 0 }
      );
    },
    [dprs]
  );

  const workPackages = wpQuery.data ?? [];

  if (projectQuery.isPending || dprQuery.isPending || wpQuery.isPending) {
    return <LoadingState label="Loading project data…" />;
  }

  if (projectQuery.isError || dprQuery.isError || wpQuery.isError) {
    return (
      <ErrorState
        title="Could not load project data"
        description={projectQuery.error?.message ?? dprQuery.error?.message ?? wpQuery.error?.message}
        retry={
          <Button variant="outline" onClick={() => projectQuery.refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  const project = projectQuery.data;
  if (!project) return null;

  const sortedDprs = useMemo(
    () => [...dprs].sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at)),
    [dprs]
  );

  async function handleSave(payload: DprPayload) {
    if (editing) {
      await updateDpr.mutateAsync({ id: editing.id, patch: payload });
      toast({ title: "DPR updated", variant: "success" });
    } else {
      await createDpr.mutateAsync(payload);
      toast({ title: "DPR added", variant: "success" });
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    await deleteDpr.mutateAsync(deleting.id);
    toast({ title: "DPR deleted", variant: "success" });
    setDeleting(null);
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Daily Progress Reports</h1>
          <p className="mt-1 text-sm text-text-muted">{project.name} — Operations log</p>
        </div>
        {canWrite && (
          <Button onClick={() => setFormOpen(true)}>Add DPR</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Total reports</p>
          <p className="text-2xl font-bold text-text">{summary.totalReports}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Total quantity</p>
          <p className="text-2xl font-bold text-text">{summary.totalQuantity.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Labor cost</p>
          <p className="text-2xl font-bold text-text">৳{summary.totalLaborCost.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Machinery cost</p>
          <p className="text-2xl font-bold text-text">৳{summary.totalMachineryCost.toLocaleString()}</p>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: "feed", label: "DPR Feed" },
            { value: "progress", label: "Progress Chart" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        >
          {(tab) =>
            tab === "feed" ? (
              <div className="mt-1">
                {sortedDprs.length === 0 ? (
                  <EmptyState
                    title="No daily reports yet"
                    description="Log daily progress, labor, and machinery to track site activity."
                    action={canWrite ? <Button onClick={() => setFormOpen(true)}>Add DPR</Button> : undefined}
                  />
                ) : (
                  <div className="space-y-3">
                    {sortedDprs.map((dpr) => (
                      <Card key={dpr.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-text">{dpr.work_package_code}</span>
                              <Badge variant="neutral">{dpr.work_package_name}</Badge>
                              <Badge variant="info">{dpr.weather}</Badge>
                            </div>
                            <p className="text-sm text-text-muted">{dpr.work_done}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                              <span>Qty: <span className="font-medium text-text">{dpr.quantity_achieved}</span></span>
                              <span>
                                Labor: ৳{dpr.labor_entries
                                  .reduce((s, e) => s + e.head_count * e.hours_worked * e.rate, 0)
                                  .toLocaleString()}
                              </span>
                              <span>
                                Machinery: ৳{dpr.machinery_entries.reduce((s, e) => s + e.hours_used * e.rate, 0).toLocaleString()}
                              </span>
                              <span>By {dpr.created_by}</span>
                            </div>
                            {dpr.notes && <p className="mt-2 text-sm text-text-muted">{dpr.notes}</p>}
                          </div>
                          <div className="flex gap-2">
                            <span className="self-center text-xs text-text-muted">
                              {new Date(dpr.date).toLocaleDateString("en-GB")}
                            </span>
                            {canWrite && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditing(dpr);
                                    setFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => setDeleting(dpr)}
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
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-text">Select work package</label>
                    <Select
                      value={chartWpId}
                      onChange={(e) => setChartWpId(e.target.value)}
                    >
                      <option value="">Select…</option>
                      {workPackages.map((wp) => (
                        <option key={wp.id} value={wp.id}>
                          {wp.code} — {wp.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  {chartWpId ? (
                    <DprProgressChart dprs={sortedDprs} workPackageId={chartWpId} />
                  ) : (
                    <p className="text-center py-8 text-text-muted">
                      Select a work package to view its progress trend.
                    </p>
                  )}
                </div>
              </div>
            )
          }
        </Tabs>
      </div>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit DPR" : "Add Daily Progress Report"}
        subtitle="Record site progress, labor, and machinery usage."
        size="lg"
      >
        <DprForm
          key={editing?.id ?? "new"}
          projectId={projectId}
          initial={editing ? { date: editing.date, work_package_id: editing.work_package_id } : undefined}
          submitLabel={editing ? "Save changes" : "Add DPR"}
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
        title="Delete DPR"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Delete the report for <span className="font-semibold text-text">
            {deleting?.work_package_code}</span> on
            <span className="font-semibold text-text">
              {new Date(deleting!.date).toLocaleDateString("en-GB")}
            </span>
          ?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete DPR</Button>
        </div>
      </Modal>
    </main>
  );
}