"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Badge, Card, LoadingState } from "@/components/ui";
import { ROLES } from "../constants";
import { useAuth } from "../context/auth-context";
import type { Role } from "../types";

export function RequireAuth({
  children,
  redirectTo = "/login",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`${redirectTo}?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, redirectTo, pathname]);

  if (isLoading || !user) {
    return <LoadingState label="Checking session…" className="mx-auto w-full max-w-2xl" />;
  }

  return <>{children}</>;
}

export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  const allowed = user && roles.includes(user.role);

  if (!allowed) {
    return (
      <Card className="mx-auto w-full max-w-md p-8 text-center">
        <Badge variant="danger" dot>
          Access denied
        </Badge>
        <p className="mt-3 text-sm text-text-muted">
          This area is restricted to{" "}
          {roles.map((r) => ROLES[r].label).join(" / ")}. Your current role
          {user ? ` (${ROLES[user.role].label})` : ""} does not have permission
          to view it.
        </p>
      </Card>
    );
  }

  return <>{children}</>;
}