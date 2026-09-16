import Link from "next/link";
import Image from "next/image";
import { safetyRows } from "@/data/site";
import { SectionHeading } from "@/components/public/icon-block";

export default function SafetySustainabilitySection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Quality & Sustainability"
          title="Rigorous QA and a Greener Future"
          subtitle="Stage-gate inspections meet modern sustainability — every project balances durability with environmental responsibility."
        />
        <div className="space-y-12">
          {safetyRows.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-1 gap-8 items-center rounded-2xl overflow-hidden lg:grid-cols-2"
            >
              <div className={`relative aspect-[16/9] overflow-hidden rounded-xl ${row.reversed ? "lg:order-2" : ""}`}>
                <Image
                  src={`https://picsum.photos/seed/${row.imageSeed}/900/500`}
                  alt={row.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">{row.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-text">{row.title}</h3>
                <p className="mt-3 text-text-muted">{row.desc}</p>
                <Link href="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  Read more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}