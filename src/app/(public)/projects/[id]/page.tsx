import Link from "next/link";
import Image from "next/image";
import { featuredProjects } from "@/data/site";
import { Button } from "@/components/ui/Button";

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

export default async function PublicProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = featuredProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
            <h1 className="text-2xl font-bold text-text">Project not found</h1>
            <p className="mt-2 text-text-muted">The project you&apos;re looking for doesn&apos;t exist or has been archived.</p>
            <Link href="/projects" className="mt-6 inline-flex">
              <Button variant="outline">Back to Projects</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary"
        >
          &larr; All Projects
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${project.id}/1600/700`}
              alt={project.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-text">{project.name}</h1>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="mt-2 text-text-muted">
                  {project.location} &middot; {project.type}
                </p>
              </div>
            </div>

            <p className="mt-6 text-text-muted leading-relaxed">{project.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-surface-muted p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Total Area</p>
                <p className="mt-1 text-xl font-bold text-text">{project.area}</p>
              </div>
              <div className="rounded-xl bg-surface-muted p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Project Budget</p>
                <p className="mt-1 text-xl font-bold text-text">{project.budget}</p>
              </div>
              <div className="rounded-xl bg-surface-muted p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Current Progress</p>
                <p className="mt-1 text-xl font-bold text-text">{project.progress}%</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-text-muted">
                <span>Construction progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(project.progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact">
                <Button>Discuss This Project</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Request a Site Visit</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}