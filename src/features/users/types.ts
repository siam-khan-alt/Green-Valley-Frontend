import type { Role } from "@/features/auth";

export type { Role };

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
}

export type UserPayload = {
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
};

export type UserPatch = Partial<Pick<UserPayload, "role" | "is_active">>;