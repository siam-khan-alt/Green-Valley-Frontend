"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Badge, Button, Card, CardBody, CardHeader, Input } from "@/components/ui";
import { DEMO_USERS, ROLES, useAuth } from "@/features/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    setSubmitting(true);
    try {
      await login({ email, password });
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Sign in"
          subtitle="Green Valley Developers — BuildControl"
        />
        <CardBody>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              required
              autoComplete="email"
              placeholder="you@greenvalley.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <Input
              type="password"
              label="Password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(undefined);
              }}
              error={error}
            />
            <Button type="submit" loading={submitting} className="mt-2">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Demo accounts (password: password123)
            </p>
            <div className="flex flex-col gap-1.5">
              {DEMO_USERS.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-muted/60 px-3 py-1.5"
                >
                  <span className="text-sm text-text">{u.email}</span>
                  <Badge
                    variant={
                      u.role === "admin"
                        ? "danger"
                        : u.role === "finance"
                          ? "warning"
                          : u.role === "viewer"
                            ? "neutral"
                            : u.role === "site_staff"
                              ? "info"
                              : "primary"
                    }
                  >
                    {ROLES[u.role].label}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}