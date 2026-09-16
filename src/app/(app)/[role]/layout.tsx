"use client";

import { usePathname } from "next/navigation";
import { Badge, Card, LoadingState } from "@/components/ui";
import {
  ALL_ROLES,
  MODULE_ACCESS,
  parseRolePath,
  resolveProjectSubmoduleRoles,
  useAuth,
} from "@/features/auth";

const SLUG_LABELS: Record<string, string> = {
  admin: "Admin",
  pm: "Project Manager",
  site: "Site Staff",
  finance: "Finance",
  viewer: "Viewer",
};

function roleLabel(role: string): string {
  return SLUG_LABELS[role] ?? role;
}

function areaRoles(area: string | undefined, subarea: string | undefined): string[] {
  if (!area) return ALL_ROLES;
  if (area === "projects") {
    return subarea ? resolveProjectSubmoduleRoles(subarea) : ALL_ROLES;
  }
  return MODULE_ACCESS[area] ?? [];
}

export default function RoleLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return <LoadingState label="Checking session…" className="mx-auto w-full max-w-2xl" />;
  }

  const parsed = parseRolePath(pathname);

  if (!parsed || !parsed.role) {
    return (
      <Card className="mx-auto w-full max-w-md p-8 text-center">
        <Badge variant="danger" dot>
          Access denied
        </Badge>
        <p className="mt-3 text-sm text-text-muted">Invalid application area.</p>
      </Card>
    );
  }

  if (parsed.role !== user.role) {
    return (
      <Card className="mx-auto w-full max-w-md p-8 text-center">
        <Badge variant="danger" dot>
          Access denied
        </Badge>
        <p className="mt-3 text-sm text-text-muted">
          This area is for {roleLabel(parsed.slug)} accounts. Your role ({roleLabel(user.role)}){" "}
          cannot open <span className="font-semibold text-text">{pathname}</span>.
        </p>
      </Card>
    );
  }

  if (parsed.area || parsed.subarea) {
    if (!areaRoles(parsed.area, parsed.subarea).includes(user.role)) {
      return (
        <Card className="mx-auto w-full max-w-md p-8 text-center">
          <Badge variant="danger" dot>
            Access denied
          </Badge>
          <p className="mt-3 text-sm text-text-muted">
            This module is outside your team&apos;s flow.
          </p>
        </Card>
      );
    }
  }

  return <>{children}</>;
}