type IconProps = { icon: string; label: string };

const iconPaths: Record<string, string> = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  building: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
  factory: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
  city: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
  hammer: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7.5 7.5C7.5 7.5 7.5 7.5 7.5 7.5",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  "shield-check": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock: "circle cx='12' cy='12' r='10'",
  award: "circle cx='12' cy='8' r='7'",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
  "building-2": "rect x='3' y='3' width='18' height='18' rx='2'",
  cpu: "rect x='4' y='4' width='16' height='16' rx='2'",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "bar-chart-2": "M12 20v-6M6 20V10M18 20V4",
  "heart-handshake": "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z",
  gem: "M6 3h12l4 8-6 6-4-4-2 2-2-2 4-4-6-6z",
};

export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-text-muted">{subtitle}</p>
    </div>
  );
}

export function IconBlock({ icon, label }: IconProps) {
  const d = iconPaths[icon] || iconPaths.home;
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" role="img" aria-label={label}>
        <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}