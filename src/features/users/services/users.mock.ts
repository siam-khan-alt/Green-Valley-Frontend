import { registerMock } from "@/services/mock/adapter";
import { DEMO_USERS } from "@/features/auth/services/auth.mock";
import type { User, UserPatch, UserPayload } from "../types";

const store: User[] = DEMO_USERS.map((u) => ({ ...u }));

function wait<T>(result: { status: number; data: T }): Promise<{ status: number; data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 120 + Math.random() * 180);
  });
}

function findUser(id: string) {
  return store.find((u) => u.id === id);
}

registerMock("get", "/users", async () =>
  wait({ status: 200, data: store.map((u) => ({ ...u })) })
);

registerMock("post", "/users", async (config) => {
  const payload = ((config.data as UserPayload) ?? {}) as UserPayload;
  const emailTaken = (() => {
    if (!payload.email?.trim()) return false;
    const normalized = payload.email.trim().toLowerCase();
    return store.some((u) => u.email.toLowerCase() === normalized);
  })();
  const fields: Record<string, string[]> = {};
  if (!payload.name?.trim()) fields.name = ["Name is required."];
  if (!payload.email?.trim()) {
    fields.email = ["Email is required."];
  } else if (emailTaken) {
    fields.email = ["A user with this email already exists."];
  }
  if (!payload.role) fields.role = ["Role is required."];
  if (Object.keys(fields).length > 0) return wait({ status: 400, data: fields });
  const user: User = {
    id: `u_${payload.email.replace(/[^a-z0-9]/gi, "").toLowerCase()}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role,
    is_active: payload.is_active ?? true,
  };
  if (store.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return wait({ status: 400, data: { email: ["A user with this email already exists."] } });
  }
  store.push(user);
  return wait({ status: 201, data: { ...user } });
});

registerMock("patch", "/users/{id}", async (config, params) => {
  const user = findUser(params.id);
  if (!user) return wait({ status: 404, data: { detail: "User not found." } });
  const patch = ((config.data as UserPatch) ?? {}) as UserPatch;
  const fields: Record<string, string[]> = {};
  if (patch.role !== undefined && !patch.role) fields.role = ["Role is required."];
  if (patch.is_active !== undefined && typeof patch.is_active !== "boolean") {
    fields.is_active = ["is_active must be boolean."];
  }
  if (Object.keys(fields).length > 0) return wait({ status: 400, data: fields });
  const updated: User = { ...user, ...patch };
  Object.assign(user, updated);
  return wait({ status: 200, data: { ...updated } });
});