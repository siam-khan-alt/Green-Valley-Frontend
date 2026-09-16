import { processSteps } from "@/data/site";
import { SectionHeading } from "@/components/public/icon-block";

export default function ProcessSection() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="How It Works"
          title="Our Proven Process"
          subtitle="A streamlined, four-stage approach that keeps your project on schedule and on budget from day one."
        />
        <div className="relative">
          <div className="hidden md:block">
            <div className="absolute left-1/2 top-1/2 h-1 -translate-y-1/2 w-full -translate-x-1/2 bg-border" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold ring-4 ring-surface-muted">
                  {step.number}
                </div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}