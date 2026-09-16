"use client";

import { useMemo, useState } from "react";
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
import { MODULE_ACCESS, RequireRole, useAuth } from "@/features/auth";
import { KpiCard } from "@/features/projects";
import {
  SUPPLIERS_WRITE_ROLES,
  SupplierForm,
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from "@/features/suppliers";
import type { Supplier, SupplierPayload } from "@/features/suppliers";

function SuppliersContent() {
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && SUPPLIERS_WRITE_ROLES.includes(user.role);

  const suppliersQuery = useSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
  const [busy, setBusy] = useState(false);

  const suppliers = useMemo(
    () => suppliersQuery.data ?? [],
    [suppliersQuery.data]
  );

  const withContact = suppliers.filter((s) => s.contact_info?.trim()).length;

  if (suppliersQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <LoadingState label="Loading suppliers…" />
      </main>
    );
  }

  if (suppliersQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <ErrorState
          title="Could not load suppliers"
          description={suppliersQuery.error.message}
          retry={
            <Button variant="outline" onClick={() => void suppliersQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  async function handleSave(payload: SupplierPayload) {
    if (editing) {
      await updateSupplier.mutateAsync({ id: editing.id, patch: payload });
      toast({ title: "Supplier updated", variant: "success" });
    } else {
      await createSupplier.mutateAsync(payload);
      toast({ title: "Supplier added", variant: "success" });
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteSupplier.mutateAsync(deleting.id);
      toast({ title: "Supplier removed", variant: "success" });
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Suppliers</h1>
          <p className="mt-1 text-sm text-text-muted">
            Vendors you raise purchase orders against, with contact details.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setFormOpen(true)}>Add supplier</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Suppliers" value={suppliers.length} tone="info" />
        <KpiCard
          label="With contact info"
          value={withContact}
          tone="success"
          sub={`${suppliers.length - withContact} need details`}
        />
        <KpiCard label="Catalog groups" value={2} tone="muted" sub="materials + suppliers" />
      </div>

      <div className="mt-6">
        {suppliers.length === 0 ? (
          <EmptyState
            title="No suppliers yet"
            description="Add the vendors you procure from so POs can reference them."
            action={
              canWrite ? (
                <Button onClick={() => setFormOpen(true)}>Add supplier</Button>
              ) : undefined
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <ThCell>Supplier</ThCell>
                  <ThCell>Contact information</ThCell>
                  <ThCell>‎</ThCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TdCell className="font-medium text-text">{supplier.name}</TdCell>
                    <TdCell className="text-text-muted">
                      {supplier.contact_info || "—"}
                    </TdCell>
                    <TdCell>
                      {canWrite && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(supplier);
                              setFormOpen(true);
                            }}
                            className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(supplier)}
                            className="text-xs font-medium text-danger transition-colors hover:text-danger-hover"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </TdCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit supplier" : "Add supplier"}
        subtitle="Suppliers are referenced from purchase orders."
        size="lg"
      >
        <SupplierForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          submitLabel={editing ? "Save changes" : "Add supplier"}
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
        title="Delete supplier"
        subtitle="Removing a vendor from the catalog."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Remove <span className="font-semibold text-text">{deleting?.name}</span> from
          the suppliers catalog? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={handleDelete}>
            Delete supplier
          </Button>
        </div>
      </Modal>
    </main>
  );
}

export default function SuppliersPage() {
  return (
    <RequireRole roles={MODULE_ACCESS.suppliers}>
      <SuppliersContent />
    </RequireRole>
  );
}