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
  Tabs,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import {
  MEASUREMENT_VERIFY_ROLES,
  MEASUREMENT_WRITE_ROLES,
  MeasurementForm,
  MeasurementStatusBadge,
  RA_BILL_APPROVE_ROLES,
  RA_BILL_WRITE_ROLES,
  RaBillForm,
  RaBillStatusBadge,
  RaDeductionsForm,
  useCreateMeasurement,
  useCreateRaBill,
  useDeleteMeasurement,
  useGenerateRaBill,
  useMeasurements,
  useRaBills,
  useUpdateMeasurement,
  useUpdateRaBill,
} from "@/features/billing";
import type {
  Measurement,
  MeasurementPatch,
  MeasurementPayload,
  RaBill,
  RaBillPatch,
  RaBillPayload,
} from "@/features/billing";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BillingPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();

  const canWriteMeasure = !!user && MEASUREMENT_WRITE_ROLES.includes(user.role);
  const canVerify = !!user && MEASUREMENT_VERIFY_ROLES.includes(user.role);
  const canWriteBill = !!user && RA_BILL_WRITE_ROLES.includes(user.role);
  const canApproveBill = !!user && RA_BILL_APPROVE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const measurementsQuery = useMeasurements(id);
  const raBillsQuery = useRaBills(id);

  const createMeasurement = useCreateMeasurement(id);
  const updateMeasurement = useUpdateMeasurement(id);
  const deleteMeasurement = useDeleteMeasurement(id);
  const createRaBill = useCreateRaBill(id);
  const generateRaBill = useGenerateRaBill(id);
  const updateRaBill = useUpdateRaBill(id);

  const [activeTab, setActiveTab] = useState("measurements");
  const [measureFormOpen, setMeasureFormOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [deletingMeasurement, setDeletingMeasurement] = useState<Measurement | null>(null);
  const [billFormOpen, setBillFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<RaBill | null>(null);
  const [deductionsBill, setDeductionsBill] = useState<RaBill | null>(null);

  const kpis = useMemo(() => {
    const measurements = measurementsQuery.data ?? [];
    const bills = raBillsQuery.data ?? [];
    const approvedQty = measurements
      .filter((m) => m.status === "approved")
      .reduce((sum, m) => sum + m.measured_quantity, 0);
    const pendingVerify = measurements.filter((m) => m.status === "draft").length;
    const totalGross = bills.reduce((sum, b) => sum + b.gross_amount, 0);
    const totalNet = bills.reduce((sum, b) => sum + b.net_payable, 0);
    return { approvedQty, pendingVerify, totalGross, totalNet };
  }, [measurementsQuery.data, raBillsQuery.data]);

  if (projectQuery.isPending || measurementsQuery.isPending || raBillsQuery.isPending) {
    return <LoadingState label="Loading billing data…" />;
  }

  if (projectQuery.isError || measurementsQuery.isError || raBillsQuery.isError) {
    return (
      <ErrorState
        title="Could not load billing data"
        description={projectQuery.error?.message ?? measurementsQuery.error?.message ?? raBillsQuery.error?.message}
        retry={
          <Button
            variant="outline"
            onClick={() => {
              void measurementsQuery.refetch();
              void raBillsQuery.refetch();
            }}
          >
            Retry
          </Button>
        }
      />
    );
  }

  const project = projectQuery.data;
  if (!project) return null;

  const measurements = measurementsQuery.data ?? [];
  const bills = raBillsQuery.data ?? [];

  async function handleMeasurementSave(payload: MeasurementPayload) {
    if (editingMeasurement) {
      await updateMeasurement.mutateAsync({ id: editingMeasurement.id, patch: payload });
      toast({ title: "Measurement updated", variant: "success" });
    } else {
      await createMeasurement.mutateAsync(payload);
      toast({ title: "Measurement added", variant: "success" });
    }
    setMeasureFormOpen(false);
    setEditingMeasurement(null);
  }

  async function handleMeasurementStatus(patch: MeasurementPatch) {
    if (!editingMeasurement) return;
    await updateMeasurement.mutateAsync({ id: editingMeasurement.id, patch });
    toast({ title: "Measurement status updated", variant: "success" });
    setEditingMeasurement(null);
  }

  async function handleMeasurementDelete() {
    if (!deletingMeasurement) return;
    await deleteMeasurement.mutateAsync(deletingMeasurement.id);
    toast({ title: "Measurement deleted", variant: "success" });
    setDeletingMeasurement(null);
  }

  async function handleBillCreate(payload: RaBillPayload) {
    await createRaBill.mutateAsync(payload);
    toast({ title: "RA bill created", variant: "success" });
    setBillFormOpen(false);
  }

  async function handleBillEdit(patch: RaBillPatch) {
    if (!editingBill) return;
    await updateRaBill.mutateAsync({ id: editingBill.id, patch });
    toast({ title: "RA bill updated", variant: "success" });
    setEditingBill(null);
  }

  async function handleGenerate(bill: RaBill) {
    await generateRaBill.mutateAsync(bill.id);
    toast({ title: "RA bill generated", description: "Lines rebuilt from approved measurements at BOQ rates.", variant: "success" });
  }

  async function handleDeductions(patch: RaBillPatch) {
    if (!deductionsBill) return;
    await updateRaBill.mutateAsync({ id: deductionsBill.id, patch });
    toast({ title: "Deductions saved", variant: "success" });
    setDeductionsBill(null);
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Billing</h1>
          <p className="mt-1 text-sm text-text-muted">
            {project.name} — Measurement Book & RA bills
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Approved quantity</p>
          <p className="text-2xl font-bold text-text">{kpis.approvedQty.toLocaleString("en-IN")}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Pending verification</p>
          <p className="text-2xl font-bold text-text">{kpis.pendingVerify}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Bills gross</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(kpis.totalGross)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Bills net payable</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(kpis.totalNet)}</p>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: "measurements", label: "Measurement Book" },
            { value: "ra-bills", label: "RA Bills" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        >
          {(tab) =>
            tab === "measurements" ? (
              <div className="mt-1">
                <div className="flex justify-end">
                  {canWriteMeasure && (
                    <Button onClick={() => setMeasureFormOpen(true)}>Add measurement</Button>
                  )}
                </div>
                {measurements.length === 0 ? (
                  <EmptyState
                    title="No measurements yet"
                    description="Record measured quantities against BOQ items to start billing."
                    action={canWriteMeasure ? <Button onClick={() => setMeasureFormOpen(true)}>Add measurement</Button> : undefined}
                  />
                ) : (
                  <div className="mt-4 space-y-3">
                    {measurements.map((m) => (
                      <Card key={m.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[220px] flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-text">{m.work_package_code}</span>
                              <span className="text-sm text-text-muted">{m.work_package_name}</span>
                              <MeasurementStatusBadge status={m.status} />
                            </div>
                            <p className="mt-1 text-sm text-text">{m.boq_item_description}</p>
                            <p className="mt-1 text-xs text-text-muted">
                              {m.measured_quantity.toLocaleString("en-IN")} {m.unit} · {formatDate(m.measurement_date)} · by {m.id}
                            </p>
                            {m.notes && <p className="mt-1 text-sm text-text-muted">{m.notes}</p>}
                          </div>
                          <div className="flex gap-2">
                            {canVerify && m.status !== "approved" && (
                              <>
                                {m.status === "draft" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingMeasurement(m);
                                      void handleMeasurementStatus({ status: "verified" });
                                    }}
                                  >
                                    Verify
                                  </Button>
                                )}
                                {m.status === "verified" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingMeasurement(m);
                                      void handleMeasurementStatus({ status: "approved" });
                                    }}
                                  >
                                    Approve
                                  </Button>
                                )}
                              </>
                            )}
                            {canWriteMeasure && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingMeasurement(m);
                                    setMeasureFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => setDeletingMeasurement(m)}
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
                <div className="flex justify-end">
                  {canWriteBill && (
                    <Button onClick={() => setBillFormOpen(true)}>New RA bill</Button>
                  )}
                </div>
                {bills.length === 0 ? (
                  <EmptyState
                    title="No RA bills yet"
                    description="Create a bill for a billing period, then generate its lines from approved measurements."
                    action={canWriteBill ? <Button onClick={() => setBillFormOpen(true)}>New RA bill</Button> : undefined}
                  />
                ) : (
                  <div className="mt-4 space-y-3">
                    {bills.map((bill) => (
                      <Card key={bill.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[220px] flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-text">{bill.bill_no}</span>
                              <RaBillStatusBadge status={bill.status} />
                              <span className="text-xs text-text-muted">
                                {formatDate(bill.bill_date)} · {formatDate(bill.period_from)} – {formatDate(bill.period_to)}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm">
                              <span className="text-text-muted">
                                Gross <span className="font-medium text-text">{formatCurrency(bill.gross_amount)}</span>
                              </span>
                              <span className="text-text-muted">
                                Net payable <span className="font-semibold text-primary">{formatCurrency(bill.net_payable)}</span>
                              </span>
                              <span className="text-text-muted">{bill.lines.length} lines</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {bill.lines.length === 0 && canWriteBill && (
                              <Button
                                variant="outline"
                                size="sm"
                                loading={generateRaBill.isPending}
                                onClick={() => void handleGenerate(bill)}
                              >
                                Generate
                              </Button>
                            )}
                            {canWriteBill && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeductionsBill(bill)}
                              >
                                Deductions
                              </Button>
                            )}
                            {canApproveBill && bill.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingBill(bill);
                                  void handleBillEdit({ status: bill.status === "draft" ? "submitted" : "approved" });
                                }}
                              >
                                {bill.status === "draft" ? "Submit" : "Approve"}
                              </Button>
                            )}
                          </div>
                        </div>
                        {bill.lines.length > 0 && (
                          <div className="mt-3 overflow-x-auto rounded-md border border-border">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-surface-muted/50 text-left text-xs text-text-muted">
                                  <th className="px-3 py-2 font-medium">Item</th>
                                  <th className="px-3 py-2 font-medium">WP</th>
                                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bill.lines.map((l, i) => (
                                  <tr key={i} className="border-b border-border/60">
                                    <td className="px-3 py-2">{l.boq_item_description}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-text-muted">{l.work_package_code}</td>
                                    <td className="px-3 py-2 text-right tabular-nums">{l.measured_quantity.toLocaleString("en-IN")} {l.unit}</td>
                                    <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(l.rate)}</td>
                                    <td className="px-3 py-2 text-right font-medium tabular-nums">{formatCurrency(l.amount)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          }
        </Tabs>
      </div>

      <Modal
        open={measureFormOpen}
        onClose={() => {
          setMeasureFormOpen(false);
          setEditingMeasurement(null);
        }}
        title={editingMeasurement ? "Edit measurement" : "Add measurement"}
        subtitle="Record measured quantity against a BOQ item."
        size="lg"
      >
        <MeasurementForm
          key={editingMeasurement?.id ?? "new"}
          projectId={id}
          initial={editingMeasurement ?? undefined}
          onCancel={() => {
            setMeasureFormOpen(false);
            setEditingMeasurement(null);
          }}
          onSubmit={handleMeasurementSave}
        />
      </Modal>

      <Modal
        open={deletingMeasurement !== null}
        onClose={() => setDeletingMeasurement(null)}
        title="Delete measurement"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Delete the {deletingMeasurement?.boq_item_description} measurement for{" "}
          <span className="font-semibold text-text">{deletingMeasurement?.work_package_code}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingMeasurement(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleMeasurementDelete}>Delete measurement</Button>
        </div>
      </Modal>

      <Modal
        open={billFormOpen}
        onClose={() => setBillFormOpen(false)}
        title="New RA bill"
        subtitle="Create a bill for a billing period, then generate lines from approved measurements."
        size="lg"
      >
        <RaBillForm
          onCancel={() => setBillFormOpen(false)}
          onSubmit={handleBillCreate}
        />
      </Modal>

      <Modal
        open={deductionsBill !== null}
        onClose={() => setDeductionsBill(null)}
        title="Deductions"
        subtitle="Adjust advance, retention, material issue and penalty."
        size="lg"
      >
        {deductionsBill && (
          <RaDeductionsForm
            bill={deductionsBill}
            onCancel={() => setDeductionsBill(null)}
            onSubmit={handleDeductions}
          />
        )}
      </Modal>
    </main>
  );
}