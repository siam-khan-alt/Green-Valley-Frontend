import { partners } from "@/data/site";

export default function PartnersSection() {
  return (
    <section className="border-t border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Trusted by leading institutions and authorities
        </p>
        <div className="mx-auto mt-8 flex flex-wrap justify-center gap-6 sm:gap-12">
          {partners.map((p) => (
            <span key={p} className="text-xl font-bold text-text-muted tracking-wide">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}