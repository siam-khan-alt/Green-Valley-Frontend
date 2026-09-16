"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Modal,
  Select,
  useToast,
} from "@/components/ui";
import { PageHeader } from "@/components/shared/PageHeader";
import { RequireRole, ROLES } from "@/features/auth";
import {
  USER_ROLE_LABELS,
  USER_ROLE_OPTIONS,
  UserForm,
  useCreateUser,
  useUpdateUser,
  useUsers,
} from "@/features/users";
import type { User, UserPayload } from "@/features/users";
import { exportCsv, formatDateForFile } from "@/lib/csv";
import { useCrud } from "@/hooks/use-crud";

function RoleBadge({ role }: { role: User["role"] }) {
  const variant =
    role === "admin"
      ? "danger"
      : role === "project_manager"
        ? "primary"
        : role === "finance"
          ? "warning"
          : role === "site_staff"
            ? "info"
            : "neutral";
  return <Badge variant={variant}>{USER_ROLE_LABELS[role]}</Badge>;
}

function UsersContent() {
  const toast = useToast();
  const crud = useCrud<User>({ resource: "user" });
  const usersQuery = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [search, setSearch] = useState("");
  const [lastEditError, setLastEditError] = useState<{ id: string; message: string } | null>(null);

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const visibleUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.id].some((field) => field.toLowerCase().includes(q))
    );
  }, [users, search]);

  if (usersQuery.isPending) {
    return <LoadingState label="Loading users…" />;
  }

  if (usersQuery.isError) {
    return (
      <ErrorState
        title="Could not load users"
        description={usersQuery.error?.message}
        retry={<Button variant="outline" onClick={() => void usersQuery.refetch()}>Retry</Button>}
      />
    );
  }

  function handleExport() {
    exportCsv({
      filename: `users-${formatDateForFile(new Date())}`,
      headers: ["Name", "Email", "Role", "Status"],
      rows: visibleUsers.map((u) => [
        u.name,
        u.email,
        USER_ROLE_LABELS[u.role],
        u.is_active ? "Active" : "Inactive",
      ]),
    });
  }

  async function handleCreate(payload: UserPayload) {
    await createUser.mutateAsync(payload);
    toast({ title: "User created", variant: "success" });
    crud.setFormOpen(false);
  }

  async function handleChangeRole(id: string, role: User["role"]) {
    setLastEditError(null);
    try {
      await updateUser.mutateAsync({ id, patch: { role } });
      toast({ title: "Role updated", variant: "success" });
    } catch (error) {
      setLastEditError({ id, message: error instanceof Error ? error.message : "Could not update role." });
      await usersQuery.refetch();
    }
  }

  async function handleToggleActive(user: User) {
    setLastEditError(null);
    try {
      await updateUser.mutateAsync({ id: user.id, patch: { is_active: !user.is_active } });
      toast({
        title: user.is_active ? "User deactivated" : "User activated",
        variant: "success",
      });
    } catch (error) {
      setLastEditError({ id: user.id, message: error instanceof Error ? error.message : "Could not update status." });
      await usersQuery.refetch();
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Users & Roles"
        description="Manage organization members, their roles and access status."
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
            <Button onClick={() => crud.startCreate()}>New user</Button>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {USER_ROLE_OPTIONS.map((r) => {
          const count = users.filter((u) => u.role === r.value && u.is_active).length;
          return (
            <Card key={r.value} className="p-4">
              <p className="text-sm font-medium text-text">{r.label}</p>
              <p className="text-2xl font-bold text-text">{count}</p>
              <p className="mt-1 text-xs text-text-muted">active members</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        {users.length === 0 ? (
          <EmptyState
            title="No users"
            description="Create the first user to start managing access."
            action={<Button onClick={() => crud.startCreate()}>New user</Button>}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 text-left text-xs text-text-muted">
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Role</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user) => {
                  const editError = lastEditError?.id === user.id;
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-border/60 last:border-b-0 ${!user.is_active ? "bg-surface-muted/30" : ""}`}
                    >
                      <td className="px-4 py-2">
                        <span className="font-medium text-text">{user.name}</span>
                      </td>
                      <td className="px-4 py-2 text-text-muted">{user.email}</td>
                      <td className="px-4 py-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-2">
                        {user.is_active ? (
                          <Badge variant="success" dot>
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="neutral" dot>
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editError && (
                          <p className="mb-1 text-xs text-danger">{lastEditError?.message}</p>
                        )}
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            aria-label="Change role"
                            value={user.role}
                            onChange={(e) => void handleChangeRole(user.id, e.target.value as User["role"])}
                            className="h-9 w-36"
                          >
                            {USER_ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </Select>
                          <Button
                            variant={user.is_active ? "ghost" : "outline"}
                            size="sm"
                            onClick={() => void handleToggleActive(user)}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-text-muted">
        Role guardrail: {ROLES.admin.label} — {ROLES.admin.description}
      </p>

      <Modal
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title="New user"
        subtitle="Create an organization account with a role and initial status."
        size="lg"
      >
        <UserForm
          onCancel={() => crud.setFormOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>
    </main>
  );
}

export default function UsersPage() {
  return (
    <RequireRole roles={["admin"]}>
      <UsersContent />
    </RequireRole>
  );
}