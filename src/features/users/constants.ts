import { ROLES } from "@/features/auth";
import type { Role } from "./types";

export const USER_ROLE_OPTIONS: { value: Role; label: string }[] = (
  Object.keys(ROLES) as Role[]
).map((role) => ({ value: role, label: ROLES[role].label }));

export const USER_ROLE_LABELS: Record<Role, string> = USER_ROLE_OPTIONS.reduce(
  (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
  {} as Record<Role, string>
);