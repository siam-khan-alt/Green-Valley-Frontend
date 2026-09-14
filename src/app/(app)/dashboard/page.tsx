"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui";
import {
  ROLES,
  ROLE_CAPABILITIES,
  useAuth,
} from "@/features/auth";
import { api } from "@/services";

interface ApiMeta {
  service: string;
  mock: boolean;
  version: string;
}

export default function DashboardPage() {
  return <Dashboard />;
}

function Dashboard() {
  const { user } = useAuth();
  const metaQuery = useQuery({
    queryKey: ["api-meta"],
    queryFn: () => api.get<ApiMeta>("/meta"),
  });

  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">
            Session & role-based rendering — pick an account to explore.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader title="Signed in as" />
          <CardBody>
            <p className="text-lg font-semibold text-text">{user.name}</p>
            <p className="text-sm text-text-muted">{user.email}</p>
            <div className="mt-2">
              <Badge variant="primary" dot>
                {ROLES[user.role].label}
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={`What ${ROLES[user.role].label} can do`} />
          <CardBody>
            <ul className="flex flex-col gap-1.5">
              {ROLE_CAPABILITIES[user.role].map((cap) => (
                <li key={cap} className="flex items-start gap-2 text-sm text-text">
                  <svg className="mt-0.5 size-4 shrink-0 text-success" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {cap}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="API Core layer" />
          <CardBody>
            {metaQuery.isPending ? (
              <p className="text-sm text-text-muted">Verifying mock adapter…</p>
            ) : metaQuery.isError ? (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="danger" dot>
                    Adapter error
                  </Badge>
                  <p className="mt-1 text-xs text-text-muted">
                    {metaQuery.error.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="success" dot>
                    Mock adapter online
                  </Badge>
                  <p className="mt-1 text-xs text-text-muted">
                    GET /api/v1/meta · {metaQuery.data.service} v
                    {metaQuery.data.version}
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}