"use client";

import { useRouter } from "next/navigation";
import { Button, Dropdown } from "@/components/ui";
import { ROLES, roleSlug, useAuth } from "@/features/auth";
import { Breadcrumbs } from "./breadcrumbs";
import { IconMenu } from "./icons";
import { ThemeToggle } from "./theme-toggle";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <IconMenu />
        </Button>
        <div className="min-w-0 overflow-x-auto">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <Dropdown
          label="Account menu"
          align="end"
          trigger={
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface-muted"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {user ? initials(user.name) : "?"}
              </span>
              {user && (
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium leading-tight text-text">
                    {user.name}
                  </span>
                  <span className="block text-xs leading-tight text-text-muted">
                    {ROLES[user.role].label}
                  </span>
                </span>
              )}
            </button>
          }
          items={[
            { label: "Dashboard", onClick: () => router.push(user ? `/${roleSlug(user.role)}` : "/login") },
            { divider: true },
            { label: "Logout", danger: true, onClick: handleLogout },
          ]}
        />
      </div>
    </header>
  );
}