"use client";

import { useMemo, useState } from "react";
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
import { KpiCard, useProject } from "@/features/projects";
import { useWorkPackages } from "@/features/work-packages";
import type { WorkPackage } from "@/features/work-packages";
import {
  CreatePoForm,
  GoodsReceiptForm,
  IndentForm,
  IndentStatusBadge,
  PROCUREMENT_WRITE_ROLES,
  PurchaseOrderStatusBadge,
  useCreateGoodsReceipt,
  useCreateIndent,
  useCreatePoFromIndent,
  useGoodsReceipts,
  useIndents,
  usePurchaseOrders,
  useUpdateIndent,
  useUpdatePurchaseOrder,
} from "@/features/procurement";
import type {
  CreatePoPayload,
  GrnPayload,
  Indent,
  IndentPayload,
  PurchaseOrder,
} from "@/features/procurement";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

type Tab = "indents" | "pos" | "grn";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "indents", label: "Indents" },
  { key: "pos", label: "Purchase orders" },
  { key: "grn", label: "Goods receipts" },
];

export default function ProcurementPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && PROCUREMENT_WRITE_ROLES.includes(user.role);

  const projectName = useProjectName(id);
  const workPackagesQuery = useWorkPackages(id);
  const indentsQuery = useIndents(id);
  const posQuery = usePurchaseOrders(id);
  const grnsQuery = useGoodsReceipts(id);

  const createIndent = useCreateIndent();
  const updateIndent = useUpdateIndent();
  const createPo = useCreatePoFromIndent();
  const updateOrder = useUpdatePurchaseOrder();
  const createGrn = useCreateGoodsReceipt();

  const [tab, setTab] = useState<Tab>("indents");
  const [indentCreateOpen, setIndentCreateOpen] = useState(false);
  const [indentEdit, setIndentEdit] = useState<Indent | null>(null);
  const [rejectOpen, setRejectOpen] = useState<Indent | null>(null);
  const [poCreate, setPoCreate] = useState<Indent | null>(null);
  const [grnFor, setGrnFor] = useState<PurchaseOrder | null>(null);
  const [closeFor, setCloseFor] = useState<PurchaseOrder | null>(null);
  const [busy, setBusy] = useState(false);

  const workPackages = useMemo(() => workPackagesQuery.data ?? [], [workPackagesQuery.data]);
  const indents = useMemo(() => indentsQuery.data ?? [], [indentsQuery.data]);
  const orders = useMemo(() => posQuery.data ?? [], [posQuery.data]);
  const receipts = useMemo(() => grnsQuery.data ?? [], [grnsQuery.data]);

  const wpIndex = useMemo(() => {
    const map = new Map<string, WorkPackage>();
    workPackages.forEach((wp) => map.set(wp.id, wp));
    return map;
  }, [workPackages]);

  const receivedByPo = useMemo(() => {
    const map = new Map<string, number>();
    for (const grn of receipts) {
      map.set(grn.po, (map.get(grn.po) ?? 0) + grn.received_quantity);
    }
    return map;
  }, [receipts]);

  const orderNumber = useMemo(() => {
    const map = new Map<string, PurchaseOrder>();
    for (const order of orders) map.set(order.id, order);
    return map;
  }, [orders]);

  const poForIndent = (indentId: string) =>
    orders.find((order) => order.indent === indentId);

  const awaitingApproval = indents.filter((i) => i.status === "submitted").length;
  const readyToOrder = indents.filter((i) => i.status === "approved").length;
  const committedCost = orders
    .filter((o) => o.status !== "closed")
    .reduce((sum, o) => sum + o.quantity * o.unit_price, 0);
  const totalReceivedValue = orders
    .filter((o) => o.status !== "closed")
    .reduce(
      (sum, o) => sum + (receivedByPo.get(o.id) ?? 0) * o.unit_price,
      0
    );

  if (
    indentsQuery.isPending ||
    posQuery.isPending ||
    grnsQuery.isPending ||
    workPackagesQuery.isPending
  ) {
    return (
      <main className="mx-auto w-full max-w-6xl">
        <LoadingState label="Loading procurement…" />
      </main>
    );
  }

  if (
    indentsQuery.isError ||
    posQuery.isError ||
    grnsQuery.isError ||
    workPackagesQuery.isError
  ) {
    return (
      <main className="mx-auto w-full max-w-6xl">
        <ErrorState
          title="Could not load procurement"
          description="Something went wrong while loading indents, POs and receipts."
          retry={
            <Button
              variant="outline"
              onClick={() => {
                void indentsQuery.refetch();
                void posQuery.refetch();
                void grnsQuery.refetch();
              }}
            >
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  async function handleCreateIndent(payload: IndentPayload) {
    await createIndent.mutateAsync({ projectId: id, payload });
    setIndentCreateOpen(false);
    toast({
      title: "Indent drafted",
      description: `${payload.material} created as a draft requisition.`,
      variant: "success",
    });
  }

  async function handleEditIndent(payload: IndentPayload) {
    if (!indentEdit) return;
    await updateIndent.mutateAsync({ id: indentEdit.id, patch: payload });
    setIndentEdit(null);
    toast({ title: "Indent updated", variant: "success" });
  }

  async function handleSubmit(indent: Indent) {
    await updateIndent.mutateAsync({ id: indent.id, patch: { status: "submitted" } });
    toast({
      title: "Indent submitted",
      description: `${indent.material} is now awaiting approval.`,
      variant: "success",
    });
  }

  async function handleApprove(indent: Indent) {
    await updateIndent.mutateAsync({ id: indent.id, patch: { status: "approved" } });
    toast({
      title: "Indent approved",
      description: `${indent.material} is ready to order.`,
      variant: "success",
    });
  }

  async function handleReject() {
    if (!rejectOpen) return;
    setBusy(true);
    try {
      await updateIndent.mutateAsync({
        id: rejectOpen.id,
        patch: { status: "rejected" },
      });
      toast({
        title: "Indent rejected",
        description: `${rejectOpen.material} was rejected.`,
        variant: "success",
      });
      setRejectOpen(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreatePo(payload: CreatePoPayload) {
    if (!poCreate) return;
    await createPo.mutateAsync({ indentId: poCreate.id, payload });
    setPoCreate(null);
    setTab("pos");
    toast({
      title: "Purchase order created",
      description: `${poCreate.material} has been ordered.`,
      variant: "success",
    });
  }

  async function handleGrn(payload: GrnPayload) {
    if (!grnFor) return;
    await createGrn.mutateAsync({ poId: grnFor.id, payload });
    setGrnFor(null);
    toast({
      title: "Goods receipt recorded",
      description: `${payload.received_quantity.toLocaleString("en-IN")} of ${grnFor.material} received.`,
      variant: "success",
    });
  }

  async function handleClose() {
    if (!closeFor) return;
    setBusy(true);
    try {
      await updateOrder.mutateAsync({ id: closeFor.id, patch: { status: "closed" } });
      toast({
        title: "Purchase order closed",
        description: `${closeFor.po_no} has been closed.`,
        variant: "success",
      });
      setCloseFor(null);
    } finally {
      setBusy(false);
    }
  }

  function wpName(wpId: string): string {
    const wp = wpIndex.get(wpId);
    return wp ? `${wp.code}` : wpId;
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Procurement</h1>
          <p className="mt-1 text-sm text-text-muted">
            {projectName ? `${projectName} — ` : ""}material workflow: indent →
            purchase order → goods receipt.
          </p>
        </div>
        {canWrite && tab === "indents" && (
          <Button onClick={() => setIndentCreateOpen(true)}>New indent</Button>
        )}
      </div>

      <div className="mt-5 flex gap-1 rounded-xl border border-border bg-surface p-1">
        {TABS.map(({ key, label }) => {
          const count =
            key === "indents"
              ? indents.length
              : key === "pos"
                ? orders.length
                : receipts.length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                tab === key
                  ? "bg-surface-muted text-text"
                  : "text-text-muted hover:text-text"
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                  tab === key ? "bg-primary-soft text-primary" : "bg-surface-muted text-text-muted"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "indents" && (
        <div className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Awaiting approval"
              value={awaitingApproval}
              tone={awaitingApproval > 0 ? "warning" : "neutral"}
              sub="submitted indents"
            />
            <KpiCard
              label="Ready to order"
              value={readyToOrder}
              tone={readyToOrder > 0 ? "success" : "neutral"}
              sub="approved indents"
            />
            <KpiCard label="Total indents" value={indents.length} tone="info" />
          </div>

          <Card className="mt-4">
            {indents.length === 0 ? (
              <EmptyState
                title="No indents yet"
                description="Raise a material requisition to start the procurement workflow."
                action={
                  canWrite ? (
                    <Button onClick={() => setIndentCreateOpen(true)}>New indent</Button>
                  ) : undefined
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <ThCell>Indent</ThCell>
                    <ThCell>Material</ThCell>
                    <ThCell>WP</ThCell>
                    <ThCell className="text-right">Required qty</ThCell>
                    <ThCell>Required by</ThCell>
                    <ThCell>Status</ThCell>
                    <ThCell>‎</ThCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indents.map((indent) => {
                    const po = poForIndent(indent.id);
                    return (
                      <TableRow key={indent.id}>
                        <TdCell className="whitespace-nowrap font-semibold text-primary">
                          {indent.id.toUpperCase()}
                        </TdCell>
                        <TdCell>
                          <p className="font-medium text-text">{indent.material}</p>
                          <p className="mt-0.5 text-xs text-text-muted">
                            Raised {formatDate(indent.created_at)}
                          </p>
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-text-muted">
                          {wpName(indent.work_package)}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums">
                          {indent.required_quantity.toLocaleString("en-IN")}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-text-muted">
                          {formatDate(indent.required_date)}
                        </TdCell>
                        <TdCell>
                          <IndentStatusBadge status={indent.status} />
                        </TdCell>
                        <TdCell>
                          <div className="flex items-center justify-end gap-2">
                            {indent.status === "ordered" && po && (
                              <span className="text-xs text-text-muted">
                                {po.po_no}
                              </span>
                            )}
                            {canWrite && indent.status === "drafted" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setIndentEdit(indent)}
                                  className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleSubmit(indent)}
                                  className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                                >
                                  Submit
                                </button>
                              </>
                            )}
                            {canWrite && indent.status === "submitted" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void handleApprove(indent)}
                                  className="text-xs font-medium text-success transition-colors hover:text-success-hover"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectOpen(indent)}
                                  className="text-xs font-medium text-danger transition-colors hover:text-danger-hover"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {canWrite && indent.status === "approved" && (
                              <button
                                type="button"
                                onClick={() => setPoCreate(indent)}
                                className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                              >
                                Create PO
                              </button>
                            )}
                          </div>
                        </TdCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}

      {tab === "pos" && (
        <div className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Committed cost"
              value={formatCurrency(committedCost)}
              tone="primary"
              sub="open purchase orders"
            />
            <KpiCard
              label="Received value"
              value={formatCurrency(totalReceivedValue)}
              tone="success"
              sub="goods received so far"
            />
            <KpiCard
              label="Open orders"
              value={orders.filter((o) => o.status !== "closed").length}
              tone="info"
            />
          </div>

          <Card className="mt-4">
            {orders.length === 0 ? (
              <EmptyState
                title="No purchase orders yet"
                description="Approve an indent first, then create a purchase order from it."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <ThCell>PO no</ThCell>
                    <ThCell>Supplier / material</ThCell>
                    <ThCell className="text-right">Qty</ThCell>
                    <ThCell className="text-right">Unit price</ThCell>
                    <ThCell className="text-right">Amount</ThCell>
                    <ThCell className="text-right">Received</ThCell>
                    <ThCell>Due</ThCell>
                    <ThCell>Status</ThCell>
                    <ThCell>‎</ThCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const received = receivedByPo.get(order.id) ?? 0;
                    const amount = order.quantity * order.unit_price;
                    return (
                      <TableRow key={order.id}>
                        <TdCell className="whitespace-nowrap font-semibold text-primary">
                          {order.po_no}
                        </TdCell>
                        <TdCell>
                          <p className="font-medium text-text">{order.supplier}</p>
                          <p className="mt-0.5 text-xs text-text-muted">
                            {order.material} · WP {wpName(order.work_package)}
                          </p>
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums">
                          {order.quantity.toLocaleString("en-IN")}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums">
                          ৳{order.unit_price.toLocaleString("en-IN")}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right font-semibold tabular-nums text-text">
                          {formatCurrency(amount)}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-right tabular-nums text-text-muted">
                          {received.toLocaleString("en-IN")} /{" "}
                          {order.quantity.toLocaleString("en-IN")}
                        </TdCell>
                        <TdCell className="whitespace-nowrap text-text-muted">
                          {formatDate(order.due_date)}
                        </TdCell>
                        <TdCell>
                          <PurchaseOrderStatusBadge status={order.status} />
                        </TdCell>
                        <TdCell>
                          <div className="flex items-center justify-end gap-2">
                            {canWrite &&
                              (order.status === "issued" ||
                                order.status === "partially_received") && (
                                <button
                                  type="button"
                                  onClick={() => setGrnFor(order)}
                                  className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                                >
                                  Receive
                                </button>
                              )}
                            {canWrite && order.status === "received" && (
                              <button
                                type="button"
                                onClick={() => setCloseFor(order)}
                                className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        </TdCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}

      {tab === "grn" && (
        <div className="mt-6">
          <Card>
            {receipts.length === 0 ? (
              <EmptyState
                title="No goods receipts yet"
                description="Record deliveries against a purchase order from the Purchase orders tab."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <ThCell>PO</ThCell>
                    <ThCell>Material</ThCell>
                    <ThCell className="text-right">Received qty</ThCell>
                    <ThCell>Date</ThCell>
                    <ThCell>Notes</ThCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((grn) => (
                    <TableRow key={grn.id}>
                      <TdCell className="whitespace-nowrap font-semibold text-primary">
                        {grn.po_no}
                      </TdCell>
                      <TdCell className="text-text">
                        {orderNumber.get(grn.po)?.material ?? grn.po_no}
                      </TdCell>
                      <TdCell className="whitespace-nowrap text-right tabular-nums">
                        {grn.received_quantity.toLocaleString("en-IN")}
                      </TdCell>
                      <TdCell className="whitespace-nowrap text-text-muted">
                        {formatDate(grn.received_date)}
                      </TdCell>
                      <TdCell className="text-text-muted">{grn.notes || "—"}</TdCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}

      <p className="mt-5 text-sm text-text-muted">
        <Link
          href={`/projects/${id}`}
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          ← Back to project
        </Link>
      </p>

      <Modal
        open={indentCreateOpen}
        onClose={() => setIndentCreateOpen(false)}
        title="New indent"
        subtitle="A draft requisition — submit it for approval when ready."
        size="lg"
      >
        <IndentForm
          workPackages={workPackages}
          submitLabel="Create indent"
          onCancel={() => setIndentCreateOpen(false)}
          onSubmit={handleCreateIndent}
        />
      </Modal>

      <Modal
        open={indentEdit !== null}
        onClose={() => setIndentEdit(null)}
        title="Edit indent"
        subtitle="Editable while drafted."
        size="lg"
      >
        {indentEdit && (
          <IndentForm
            key={indentEdit.id}
            workPackages={workPackages}
            initial={indentEdit}
            submitLabel="Save changes"
            onCancel={() => setIndentEdit(null)}
            onSubmit={handleEditIndent}
          />
        )}
      </Modal>

      <Modal
        open={rejectOpen !== null}
        onClose={() => setRejectOpen(null)}
        title="Reject indent"
        subtitle="The requisition will be moved to rejected status."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Reject indent{" "}
          <span className="font-semibold text-text">
            {rejectOpen?.id.toUpperCase()}
          </span>{" "}
          for <span className="font-semibold text-text">{rejectOpen?.material}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setRejectOpen(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={handleReject}>
            Reject indent
          </Button>
        </div>
      </Modal>

      <Modal
        open={poCreate !== null}
        onClose={() => setPoCreate(null)}
        title="Create purchase order"
        subtitle="The approved indent is converted into a PO (status: issued)."
        size="lg"
      >
        {poCreate && (
          <CreatePoForm
            indent={poCreate}
            onCancel={() => setPoCreate(null)}
            onSubmit={handleCreatePo}
          />
        )}
      </Modal>

      <Modal
        open={grnFor !== null}
        onClose={() => setGrnFor(null)}
        title="Receive goods"
        subtitle="Record partial or full delivery against the PO."
        size="lg"
      >
        {grnFor && (
          <GoodsReceiptForm
            order={grnFor}
            remaining={grnFor.quantity - (receivedByPo.get(grnFor.id) ?? 0)}
            onCancel={() => setGrnFor(null)}
            onSubmit={handleGrn}
          />
        )}
      </Modal>

      <Modal
        open={closeFor !== null}
        onClose={() => setCloseFor(null)}
        title="Close purchase order"
        subtitle="Closing is final for this PO."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Close{" "}
          <span className="font-semibold text-text">{closeFor?.po_no}</span> —{" "}
          <span className="font-medium text-text">{closeFor?.supplier}</span>? The PO
          will move from received to closed.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCloseFor(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={handleClose}>
            Close PO
          </Button>
        </div>
      </Modal>
    </main>
  );
}

function useProjectName(id: string) {
  const projectQuery = useProject(id);
  return projectQuery.data?.name ?? null;
}