"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/kpi-card";
import { MODULE_ACCESS, RequireRole, useAuth } from "@/features/auth";
import {
  SUPPLIERS_WRITE_ROLES,
  SupplierForm,
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from "@/features/suppliers";
import type { Supplier, SupplierPayload } from "@/features/suppliers";
import { exportCsv, formatDateForFile } from "@/lib/csv";
import { useCrud } from "@/hooks/use-crud";

function SuppliersContent() {
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && SUPPLIERS_WRITE_ROLES.includes(user.role);
  const crud = useCrud<Supplier>({ resource: "supplier" });

  const suppliersQuery = useSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [search, setSearch] = useState("");

  const suppliers = useMemo(
    () => suppliersQuery.data ?? [],
    [suppliersQuery.data]
  );

  const visibleSuppliers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) =>
      [s.name, s.contact_info, s.id].some((field) => field.toLowerCase().includes(q))
    );
  }, [suppliers, search]);

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

  function handleExport() {
    exportCsv({
      filename: `suppliers-${formatDateForFile(new Date())}`,
      headers: ["Supplier", "Contact information"],
      rows: visibleSuppliers.map((s) => [s.name, s.contact_info]),
    });
  }

  async function handleSave(payload: SupplierPayload) {
    if (crud.editing) {
      await updateSupplier.mutateAsync({ id: crud.editing.id, patch: payload });
      toast({ title: "Supplier updated", variant: "success" });
    } else {
      await createSupplier.mutateAsync(payload);
      toast({ title: "Supplier added", variant: "success" });
    }
    crud.setFormOpen(false);
    crud.setEditing(null);
  }

  function handleDelete() {
    void crud.confirmDelete(
      (supplier) => deleteSupplier.mutateAsync(supplier.id),
      { successLabel: "Supplier removed." }
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Suppliers"
        description="Vendors you raise purchase orders against, with contact details."
        actions={
          <>
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 lg:w-56"
            />
            <Button variant="outline" onClick={handleExport}>
              Export CSV
            </Button>
            {canWrite && <Button onClick={() => crud.startCreate()}>Add supplier</Button>}
          </>
        }
      />

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
                <Button onClick={() => crud.startCreate()}>Add supplier</Button>
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
                {visibleSuppliers.map((supplier) => (
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
                            onClick={() => crud.startEdit(supplier)}
                            className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => crud.requestDelete(supplier, supplier.id)}
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
        open={crud.formOpen}
        onClose={() => {
          crud.setFormOpen(false);
          crud.setEditing(null);
        }}
        title={crud.editing ? "Edit supplier" : "Add supplier"}
        subtitle="Suppliers are referenced from purchase orders."
        size="lg"
      >
        <SupplierForm
          key={crud.editing?.id ?? "new"}
          initial={crud.editing ?? undefined}
          submitLabel={crud.editing ? "Save changes" : "Add supplier"}
          onCancel={() => {
            crud.setFormOpen(false);
            crud.setEditing(null);
          }}
          onSubmit={handleSave}
        />
      </Modal>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        onClose={() => crud.setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete supplier"
        description={`Remove ${crud.deleteTarget?.name} from the suppliers catalog? This cannot be undone.`}
        busy={crud.busy}
      />
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