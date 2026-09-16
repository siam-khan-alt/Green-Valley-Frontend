"use client";

import { useMemo, useState } from "react";
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
  EXPENSE_CATEGORY_META,
  ExpenseForm,
  FINANCE_WRITE_ROLES,
  PaymentForm,
  useCreateExpense,
  useCreatePayment,
  useDeleteExpense,
  useDeletePayment,
  useExpenses,
  usePayments,
  useUpdateExpense,
  useUpdatePayment,
} from "@/features/expenses";
import type { Expense, ExpensePayload, Payment, PaymentPayload } from "@/features/expenses";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency, formatDate } from "@/lib/format";
import { exportCsv, formatDateForFile } from "@/lib/csv";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useCrud } from "@/hooks/use-crud";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Bank transfer",
  cash: "Cash",
  cheque: "Cheque",
};

export default function ExpensesPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = !!user && FINANCE_WRITE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const expensesQuery = useExpenses(id);
  const paymentsQuery = usePayments(id);

  const createExpense = useCreateExpense(id);
  const updateExpense = useUpdateExpense(id);
  const deleteExpense = useDeleteExpense(id);
  const createPayment = useCreatePayment(id);
  const updatePayment = useUpdatePayment(id);
  const deletePayment = useDeletePayment(id);

  const [activeTab, setActiveTab] = useState("expenses");
  const expenseCrud = useCrud<Expense>({ resource: "expense" });
  const paymentCrud = useCrud<Payment>({ resource: "payment" });

  const kpis = useMemo(() => {
    const expenses = expensesQuery.data ?? [];
    const payments = paymentsQuery.data ?? [];
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const materials = expenses
      .filter((e) => e.category === "materials")
      .reduce((sum, e) => sum + e.amount, 0);
    const labor = expenses
      .filter((e) => e.category === "labor")
      .reduce((sum, e) => sum + e.amount, 0);
    return { totalExpense, totalPaid, materials, labor };
  }, [expensesQuery.data, paymentsQuery.data]);

  if (projectQuery.isPending || expensesQuery.isPending || paymentsQuery.isPending) {
    return <LoadingState label="Loading expenses…" />;
  }

  if (projectQuery.isError || expensesQuery.isError || paymentsQuery.isError) {
    return (
      <ErrorState
        title="Could not load expenses"
        description={projectQuery.error?.message ?? expensesQuery.error?.message ?? paymentsQuery.error?.message}
        retry={
          <Button
            variant="outline"
            onClick={() => {
              void expensesQuery.refetch();
              void paymentsQuery.refetch();
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

  const expenses = expensesQuery.data ?? [];
  const payments = paymentsQuery.data ?? [];

  async function handleExpenseSave(payload: ExpensePayload) {
    if (expenseCrud.editing) {
      await updateExpense.mutateAsync({ id: expenseCrud.editing.id, patch: payload });
      toast({ title: "Expense updated", variant: "success" });
    } else {
      await createExpense.mutateAsync(payload);
      toast({ title: "Expense recorded", variant: "success" });
    }
    expenseCrud.setFormOpen(false);
    expenseCrud.setEditing(null);
  }

  function handleExpenseDelete() {
    void expenseCrud.confirmDelete(
      (e) => deleteExpense.mutateAsync(e.id),
      { successLabel: "Expense deleted." }
    );
  }

  async function handlePaymentSave(payload: PaymentPayload) {
    if (paymentCrud.editing) {
      await updatePayment.mutateAsync({ id: paymentCrud.editing.id, patch: payload });
      toast({ title: "Payment updated", variant: "success" });
    } else {
      await createPayment.mutateAsync(payload);
      toast({ title: "Payment recorded", variant: "success" });
    }
    paymentCrud.setFormOpen(false);
    paymentCrud.setEditing(null);
  }

  function handlePaymentDelete() {
    void paymentCrud.confirmDelete(
      (p) => deletePayment.mutateAsync(p.id),
      { successLabel: "Payment deleted." }
    );
  }

  function handleExport() {
    if (activeTab === "payments") {
      exportCsv({
        filename: `payments-${id}-${formatDateForFile(new Date())}`,
        headers: ["Payee", "Method", "Date", "Amount"],
        rows: payments.map((p) => [p.payee, PAYMENT_METHOD_LABEL[p.method] ?? p.method, p.date, p.amount]),
      });
    } else {
      exportCsv({
        filename: `expenses-${id}-${formatDateForFile(new Date())}`,
        headers: ["Date", "Category", "Description", "Amount", "Purchase order"],
        rows: expenses.map((e) => [e.date, EXPENSE_CATEGORY_META[e.category].label, e.description, e.amount, e.purchase_order ?? ""]),
      });
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Expenses & Payments"
        description={project.name}
        actions={<Button variant="outline" onClick={handleExport}>Export CSV</Button>}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Total expenses</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(kpis.totalExpense)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Total paid</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(kpis.totalPaid)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Materials spend</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(kpis.materials)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Labor & contractor</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(kpis.labor)}</p>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: "expenses", label: "Expenses" },
            { value: "payments", label: "Payments" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        >
          {(tab) =>
            tab === "expenses" ? (
              <div className="mt-1">
                <div className="flex justify-end">
                  {canWrite && (
                    <Button onClick={() => expenseCrud.startCreate()}>Record expense</Button>
                  )}
                </div>
                {expenses.length === 0 ? (
                  <EmptyState
                    title="No expenses recorded"
                    description="Log project spend by category to track cash outflow."
                    action={canWrite ? <Button onClick={() => expenseCrud.startCreate()}>Record expense</Button> : undefined}
                  />
                ) : (
                  <div className="mt-4 space-y-3">
                    {expenses.map((e) => (
                      <Card key={e.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[220px] flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={EXPENSE_CATEGORY_META[e.category].badge}>
                                {EXPENSE_CATEGORY_META[e.category].label}
                              </Badge>
                              <span className="text-sm text-text-muted">{formatDate(e.date)}</span>
                              {e.purchase_order && (
                                <span className="text-xs text-text-muted">PO {e.purchase_order}</span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-text">{e.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text">{formatCurrency(e.amount)}</span>
                            {canWrite && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    expenseCrud.setEditing(e);
                                    expenseCrud.setFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => expenseCrud.requestDelete(e, e.id)}
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
                  {canWrite && (
                    <Button onClick={() => paymentCrud.startCreate()}>Record payment</Button>
                  )}
                </div>
                {payments.length === 0 ? (
                  <EmptyState
                    title="No payments recorded"
                    description="Record outgoing payments to suppliers, contractors and staff."
                    action={canWrite ? <Button onClick={() => paymentCrud.startCreate()}>Record payment</Button> : undefined}
                  />
                ) : (
                  <div className="mt-4 space-y-3">
                    {payments.map((p) => (
                      <Card key={p.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[220px] flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-text">{p.payee}</span>
                              <Badge variant="neutral">{PAYMENT_METHOD_LABEL[p.method]}</Badge>
                              <span className="text-sm text-text-muted">{formatDate(p.date)}</span>
                            </div>
                            <p className="mt-1 text-xs text-text-muted">
                              {p.purchase_order && <>PO {p.purchase_order} · </>}
                              {p.ra_bill && <>RA {p.ra_bill} · </>}
                              {p.related_expense && <>for {p.related_expense} · </>}
                              {p.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{formatCurrency(p.amount)}</span>
                            {canWrite && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    paymentCrud.setEditing(p);
                                    paymentCrud.setFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => paymentCrud.requestDelete(p, p.id)}
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
            )
          }
        </Tabs>
      </div>

      <Modal
        open={expenseCrud.formOpen}
        onClose={() => {
          expenseCrud.setFormOpen(false);
          expenseCrud.setEditing(null);
        }}
        title={expenseCrud.editing ? "Edit expense" : "Record expense"}
        subtitle="Log project spend by category."
        size="lg"
      >
        <ExpenseForm
          key={expenseCrud.editing?.id ?? "new"}
          initial={expenseCrud.editing ?? undefined}
          onCancel={() => {
            expenseCrud.setFormOpen(false);
            expenseCrud.setEditing(null);
          }}
          onSubmit={handleExpenseSave}
        />
      </Modal>

      <ConfirmDialog
        open={expenseCrud.deleteTarget !== null}
        onClose={() => expenseCrud.setDeleteTarget(null)}
        onConfirm={handleExpenseDelete}
        title="Delete expense"
        description={
          expenseCrud.deleteTarget ? (
            <>
              Delete the {expenseCrud.deleteTarget.category} expense of{" "}
              <span className="font-semibold text-text">
                {formatCurrency(expenseCrud.deleteTarget.amount)}
              </span>
              ?
            </>
          ) : undefined
        }
        busy={expenseCrud.busy}
      />

      <Modal
        open={paymentCrud.formOpen}
        onClose={() => {
          paymentCrud.setFormOpen(false);
          paymentCrud.setEditing(null);
        }}
        title={paymentCrud.editing ? "Edit payment" : "Record payment"}
        subtitle="Record outgoing payments against suppliers, contractors or RA bills."
        size="lg"
      >
        <PaymentForm
          key={paymentCrud.editing?.id ?? "new"}
          initial={paymentCrud.editing ?? undefined}
          onCancel={() => {
            paymentCrud.setFormOpen(false);
            paymentCrud.setEditing(null);
          }}
          onSubmit={handlePaymentSave}
        />
      </Modal>

      <ConfirmDialog
        open={paymentCrud.deleteTarget !== null}
        onClose={() => paymentCrud.setDeleteTarget(null)}
        onConfirm={handlePaymentDelete}
        title="Delete payment"
        description={
          paymentCrud.deleteTarget ? (
            <>
              Delete the {formatCurrency(paymentCrud.deleteTarget.amount)} payment to{" "}
              <span className="font-semibold text-text">{paymentCrud.deleteTarget.payee}</span>?
            </>
          ) : undefined
        }
        busy={paymentCrud.busy}
      />
    </main>
  );
}