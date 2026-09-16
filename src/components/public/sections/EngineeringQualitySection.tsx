import { capabilities } from "@/data/site";
import { IconBlock, SectionHeading } from "@/components/public/icon-block";

export default function EngineeringQualitySection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Engineering & Quality"
          title="Built on Engineering Excellence"
          subtitle="Every structure meets the highest standards — structural safety, smart MEP, and rigorous cost discipline."
        />
        <div className="grid gap-6 bg-primary-soft/60 rounded-2xl p-8 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <div key={cap.title} className="rounded-xl bg-surface p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IconBlock icon={cap.icon} label={cap.title} />
              </div>
              <h3 className="mt-4 font-semibold text-text">{cap.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}