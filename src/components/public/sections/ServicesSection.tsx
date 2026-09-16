import Link from "next/link";
import { services } from "@/data/site";
import { IconBlock, SectionHeading } from "@/components/public/icon-block";

export default function ServicesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="What We Build"
          title="Six Core Services"
          subtitle="From residential towers and commercial complexes to industrial logistics hubs — we own the entire lifecycle."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <div key={svc.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4">
                <IconBlock icon={svc.icon} label={svc.title} />
              </div>
              <h3 className="text-lg font-semibold text-text">{svc.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{svc.desc}</p>
              <ul className="mt-4 space-y-2">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4">
                <Link href="/projects" className="text-sm font-semibold text-primary group-hover:underline">
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}