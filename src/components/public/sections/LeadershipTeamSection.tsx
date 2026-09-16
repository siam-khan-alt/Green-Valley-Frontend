import Image from "next/image";
import { team } from "@/data/site";
import { SectionHeading } from "@/components/public/icon-block";

export default function LeadershipTeamSection() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Leadership"
          title="The Team Behind the Trust"
          subtitle="Veteran leaders with decades of experience across residential, commercial, and infrastructure development."
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={member.image ?? `https://i.pravatar.cc/600?img=${member.imageSeed}`}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-text">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-text-muted">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}