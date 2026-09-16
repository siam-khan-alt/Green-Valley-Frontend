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
import { formatCurrency, formatDate } from "@/lib/format";

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
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);

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
    if (editingExpense) {
      await updateExpense.mutateAsync({ id: editingExpense.id, patch: payload });
      toast({ title: "Expense updated", variant: "success" });
    } else {
      await createExpense.mutateAsync(payload);
      toast({ title: "Expense recorded", variant: "success" });
    }
    setExpenseFormOpen(false);
    setEditingExpense(null);
  }

  async function handleExpenseDelete() {
    if (!deletingExpense) return;
    await deleteExpense.mutateAsync(deletingExpense.id);
    toast({ title: "Expense deleted", variant: "success" });
    setDeletingExpense(null);
  }

  async function handlePaymentSave(payload: PaymentPayload) {
    if (editingPayment) {
      await updatePayment.mutateAsync({ id: editingPayment.id, patch: payload });
      toast({ title: "Payment updated", variant: "success" });
    } else {
      await createPayment.mutateAsync(payload);
      toast({ title: "Payment recorded", variant: "success" });
    }
    setPaymentFormOpen(false);
    setEditingPayment(null);
  }

  async function handlePaymentDelete() {
    if (!deletingPayment) return;
    await deletePayment.mutateAsync(deletingPayment.id);
    toast({ title: "Payment deleted", variant: "success" });
    setDeletingPayment(null);
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Expenses & Payments</h1>
          <p className="mt-1 text-sm text-text-muted">{project.name}</p>
        </div>
      </div>

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
                    <Button onClick={() => setExpenseFormOpen(true)}>Record expense</Button>
                  )}
                </div>
                {expenses.length === 0 ? (
                  <EmptyState
                    title="No expenses recorded"
                    description="Log project spend by category to track cash outflow."
                    action={canWrite ? <Button onClick={() => setExpenseFormOpen(true)}>Record expense</Button> : undefined}
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
                                    setEditingExpense(e);
                                    setExpenseFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => setDeletingExpense(e)}
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
                    <Button onClick={() => setPaymentFormOpen(true)}>Record payment</Button>
                  )}
                </div>
                {payments.length === 0 ? (
                  <EmptyState
                    title="No payments recorded"
                    description="Record outgoing payments to suppliers, contractors and staff."
                    action={canWrite ? <Button onClick={() => setPaymentFormOpen(true)}>Record payment</Button> : undefined}
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
                                    setEditingPayment(p);
                                    setPaymentFormOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-danger hover:text-danger"
                                  onClick={() => setDeletingPayment(p)}
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
        open={expenseFormOpen}
        onClose={() => {
          setExpenseFormOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? "Edit expense" : "Record expense"}
        subtitle="Log project spend by category."
        size="lg"
      >
        <ExpenseForm
          key={editingExpense?.id ?? "new"}
          initial={editingExpense ?? undefined}
          onCancel={() => {
            setExpenseFormOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleExpenseSave}
        />
      </Modal>

      <Modal
        open={deletingExpense !== null}
        onClose={() => setDeletingExpense(null)}
        title="Delete expense"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Delete the {deletingExpense?.category} expense of{" "}
          <span className="font-semibold text-text">{deletingExpense ? formatCurrency(deletingExpense.amount) : ""}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingExpense(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => void handleExpenseDelete()}>Delete expense</Button>
        </div>
      </Modal>

      <Modal
        open={paymentFormOpen}
        onClose={() => {
          setPaymentFormOpen(false);
          setEditingPayment(null);
        }}
        title={editingPayment ? "Edit payment" : "Record payment"}
        subtitle="Record outgoing payments against suppliers, contractors or RA bills."
        size="lg"
      >
        <PaymentForm
          key={editingPayment?.id ?? "new"}
          initial={editingPayment ?? undefined}
          onCancel={() => {
            setPaymentFormOpen(false);
            setEditingPayment(null);
          }}
          onSubmit={handlePaymentSave}
        />
      </Modal>

      <Modal
        open={deletingPayment !== null}
        onClose={() => setDeletingPayment(null)}
        title="Delete payment"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Delete the {formatCurrency(deletingPayment?.amount ?? 0)} payment to{" "}
          <span className="font-semibold text-text">{deletingPayment?.payee}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingPayment(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => void handlePaymentDelete()}>Delete payment</Button>
        </div>
      </Modal>
    </main>
  );
}