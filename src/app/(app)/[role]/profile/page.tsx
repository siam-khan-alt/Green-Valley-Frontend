"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Badge, Button, Card, CardBody, CardHeader, Input, useToast } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import { ROLES, useAuth } from "@/features/auth";
import { toApiError } from "@/services";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toErrorMessage(error: unknown): string {
  const api = toApiError(error);
  const entries = Object.values(api.fields ?? {});
  return api.message || (entries.length ? String(entries[0]) : (error instanceof Error ? error.message : "Something went wrong."));
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();

  const [profileForm, setProfileForm] = useState({ name: user?.name ?? "", title: user?.title ?? "", phone: user?.phone ?? "" });
  const [profileError, setProfileError] = useState<string | undefined>(undefined);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

  async function handleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError(undefined);
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        title: profileForm.title.trim() || undefined,
        phone: profileForm.phone.trim() || undefined,
      });
      toast({ title: "Profile updated", variant: "success" });
    } catch (error) {
      setProfileError(toErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(undefined);
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(passwordForm.current, passwordForm.next);
      setPasswordForm({ current: "", next: "", confirm: "" });
      toast({ title: "Password changed", description: "Use your new password next time you sign in.", variant: "success" });
    } catch (error) {
      setPasswordError(toErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text">My Profile</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your personal details and account credentials.
        </p>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-primary">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-lg font-bold text-text">
              {user.name}
              <Badge variant={roleBadgeVariant(user.role)}>{ROLES[user.role].label}</Badge>
            </p>
            <p className="text-sm text-text-muted">{user.email}</p>
          </div>
          <span className={cn("ml-auto rounded-md border border-border bg-surface-muted px-2 py-1 text-xs text-text-muted")}>
            Member ID: {user.id}
          </span>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Personal details" subtitle="Update your name or identity information shown across the workspace." />
        <CardBody>
          <form onSubmit={handleProfile} className="grid gap-4 sm:grid-cols-2">
            {profileError && (
              <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger sm:col-span-2">{profileError}</p>
            )}
            <Input
              label="Full name"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Designation"
              placeholder="e.g. Site Engineer"
              value={profileForm.title}
              onChange={(e) => setProfileForm((f) => ({ ...f, title: e.target.value }))}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              disabled
              value={user.email}
            />
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" loading={savingProfile}>
                Save changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Change password"
          subtitle="Reset your login password. You will use the new password next time you sign in."
        />
        <CardBody>
          <form onSubmit={handlePassword} className="grid gap-4 sm:grid-cols-2">
            {passwordError && (
              <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger sm:col-span-2">{passwordError}</p>
            )}
            <Input
              label="Current password"
              type="password"
              required
              autoComplete="current-password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
            />
            <div className="hidden sm:block" />
            <Input
              label="New password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={passwordForm.next}
              onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
            />
            <Input
              label="Confirm new password"
              type="password"
              required
              autoComplete="new-password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
            />
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" loading={savingPassword}>
                Change password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

function roleBadgeVariant(role: string): BadgeVariant {
  return role === "admin"
    ? "danger"
    : role === "project_manager"
      ? "primary"
      : role === "finance"
        ? "warning"
        : role === "site_staff"
          ? "info"
          : "neutral";
}