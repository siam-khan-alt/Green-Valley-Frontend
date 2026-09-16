import Image from "next/image";
import { heroStats } from "@/data/site";
import { cn } from "@/lib/cn";

export default function TrustedStatsSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a1e33]">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&h=1080&q=80"
          alt="Active construction site"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e33] via-[#0a1e33]/85 to-[#0a1e33]/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-soft">
            In Numbers
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            A Track Record You Can Measure
          </h2>
          <p className="mt-3 text-white/70">
            Two decades of disciplined delivery — measured in square feet,
            handovers, and repeat developers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "lg:border-l lg:border-white/15 lg:px-8",
                i === 0 && "lg:border-l-0 lg:pl-0",
              )}
            >
              <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}