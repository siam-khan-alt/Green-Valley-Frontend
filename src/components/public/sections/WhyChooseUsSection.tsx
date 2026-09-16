import Image from "next/image";
import { whyUs } from "@/data/site";
import { IconBlock } from "@/components/public/icon-block";

export default function WhyChooseUsSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Eighteen Years of Building with Confidence
            </h2>
            <p className="mt-4 text-text-muted">
              We don&apos;t just build structures — we build trust. Every project is backed by data-driven
              cost control, on-time delivery guarantees, and a relentless focus on safety.
            </p>
            <ul className="mt-8 space-y-5">
              {whyUs.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <IconBlock icon={item.icon} label={item.title} />
                  <div>
                    <h3 className="font-semibold text-text">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://picsum.photos/seed/gv-team-arch/800/1000"
                alt="Modern construction architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-primary px-6 py-4 text-center shadow-xl shadow-primary/20">
              <p className="text-4xl font-extrabold text-primary-foreground">18+</p>
              <p className="text-sm font-medium text-primary-foreground">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}