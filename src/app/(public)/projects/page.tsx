import Link from "next/link";
import Image from "next/image";
import { featuredProjects, services } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

function statusColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success";
    case "Completed":
      return "bg-primary/10 text-primary";
    case "Delayed":
      return "bg-warning/10 text-warning";
    case "Planning":
      return "bg-text-muted/10 text-text-muted";
    default:
      return "bg-surface-muted text-text-muted";
  }
}

function matchesType(type: string, filter: string): boolean {
  if (!filter) return true;
  const t = type.toLowerCase();
  const f = filter.toLowerCase();
  return t === f || t.includes(f) || f.includes(t);
}

export default async function PublicProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const projects = featuredProjects.filter((p) => matchesType(p.type, type ?? ""));

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/projects"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !type
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-text-muted hover:border-primary hover:text-text",
            )}
          >
            All Projects
          </Link>
          {services.map((svc) => {
            const active = (type ?? "").toLowerCase() === svc.id;
            return (
              <Link
                key={svc.id}
                href={`/projects?type=${svc.id}`}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-text-muted hover:border-primary hover:text-text",
                )}
              >
                {svc.title}
              </Link>
            );
          })}
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/${p.id}/800/450`}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-text">{p.name}</h3>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{p.location} &middot; {p.type}</p>
                  <p className="mt-3 text-sm text-text-muted">{p.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{p.area}</span>
                      <span>{p.budget}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(p.progress, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-text-muted">{p.progress}% progress</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
            <h3 className="text-lg font-semibold text-text">No projects in this category yet</h3>
            <p className="mt-2 text-sm text-text-muted">
              We&apos;re actively developing this area. Contact us to discuss your requirements.
            </p>
            <Link href="/contact" className="mt-6 inline-flex">
              <Button variant="outline">Request a Consultation</Button>
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Request a Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}