import Link from "next/link";
import Image from "next/image";
import { featuredProjects } from "@/data/site";
import { SectionHeading } from "@/components/public/icon-block";

export default function FeaturedProjectsSection() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Our Work"
          title="Featured Projects"
          subtitle="A portfolio spanning residential heights to industrial logistics — built with precision and care."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 3).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {featuredProjects.slice(3, 6).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    id: string;
    name: string;
    type: string;
    location: string;
    status: string;
    imageSeed: string;
  };
}) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl"
    >
      <Image
        src={`https://picsum.photos/seed/${project.imageSeed}/800/600`}
        alt={project.name}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block rounded-md bg-primary/90 px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {project.status}
        </span>
        <h3 className="mt-2 text-xl font-bold text-white">{project.name}</h3>
        <p className="text-sm text-white/80">{project.location} &middot; {project.type}</p>
      </div>
    </Link>
  );
}