"use client";

import { usePathname } from "next/navigation";
import { parseProjectSubmodule, resolveProjectSubmoduleRoles, RequireRole } from "@/features/auth";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const submodule = parseProjectSubmodule(pathname);
  const roles = resolveProjectSubmoduleRoles(submodule);

  return <RequireRole roles={roles}>{children}</RequireRole>;
}