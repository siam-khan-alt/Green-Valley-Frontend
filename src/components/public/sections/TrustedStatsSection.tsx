import { heroStats } from "@/data/site";

const statIcons = [
  {
    label: "Projects Delivered",
    path: "M3 21V8a1 1 0 0 1 1-1h6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h6a1 1 0 0 1 1 1v13M3 21h18M7 21v-6h4v6m4-6v6",
  },
  {
    label: "Sq Ft Completed",
    path: "M3 21h18M5 21V8l4-3v16M9 21V8l6-3v16M15 21V8l4 3v10",
  },
  {
    label: "Years Experience",
    path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2",
  },
  {
    label: "On-Time Handover",
    path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-10 2 2 4-4",
  },
];

export default function TrustedStatsSection() {
  return (
    <section className="bg-surface-muted py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-soft">
            In Numbers
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            A Track Record You Can Measure
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-4 text-text-muted">
            Two decades of disciplined delivery — measured in square feet,
            handovers, and repeat developers.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat) => {
            const icon = statIcons.find((s) => s.label === stat.label);
            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d={icon?.path ?? statIcons[0].path}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="mt-6 text-3xl font-extrabold tracking-tight text-text">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-text-muted">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}