import { api } from "@/services";
import type { User, UserPatch, UserPayload } from "../types";

export const usersApi = {
  listUsers: () => api.get<User[]>("/users"),
  createUser: (payload: UserPayload) => api.post<User>("/users", payload),
  updateUser: (id: string, patch: UserPatch) => api.patch<User>(`/users/${id}`, patch),
};