import Link from "next/link";
import {
  heroStats,
  services,
  featuredProjects,
  whyUs,
  processSteps,
  capabilities,
  safetyRows,
  team,
  testimonials,
  faqs,
  partners,
  history,
  values,
} from "@/data/site";
import { Button } from "@/components/ui/Button";
import { IconBlock, SectionHeading } from "@/components/public/icon-block";
import Image from "next/image";

export default function PublicLandingPage() {
  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          {/* Decorative abstract shape for visual interest */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full opacity-30 rotate-6" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-soft">
            Est. 2008 &middot; Trusted by 120+ Developers
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Build with{" "}
            <span className="text-primary-foreground">Certainty</span>
            , Deliver with{" "}
            <span className="text-primary-foreground">Pride</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            We combine rigorous cost control, transparent scheduling, and world-class craftsmanship
            to deliver landmark projects on time and within budget.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-bold text-primary-foreground hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              View Our Projects
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-md border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 2: Trusted stats ── */}
      <section className="bg-surface-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 rounded-2xl bg-surface p-8 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M22 4L12 14.01l-3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Services grid ── */}
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

      {/* ── Section 4: Featured projects bento ── */}
      <section className="bg-surface-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Our Work"
            title="Featured Projects"
            subtitle="A portfolio spanning residential heights to industrial logistics — built with precision and care."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={`https://picsum.photos/seed/${p.imageSeed}/800/600`}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block rounded-md bg-primary/90 px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {p.status}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-200">{p.location} &middot; {p.type}</p>
                </div>
              </Link>
            ))}
            {featuredProjects.slice(3, 6).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={`https://picsum.photos/seed/${p.imageSeed}/800/600`}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block rounded-md bg-primary/90 px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {p.status}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-200">{p.location} &middot; {p.type}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Why choose us split ── */}
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
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
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

      {/* ── Section 6: Process horizontal timeline ── */}
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
              {processSteps.map((step, idx) => (
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

      {/* ── Section 7: Engineering & Quality (dark) ── */}
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

      {/* ── Section 8: Safety & Sustainability alternating rows ── */}
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
                className={`grid grid-cols-1 gap-8 items-center rounded-2xl overflow-hidden ${row.reversed ? "lg:grid-cols-2" : "lg:grid-cols-2"}`}
              >
                <div className={`aspect-[16/9] overflow-hidden rounded-xl ${row.reversed ? "lg:order-2" : ""}`}>
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

      {/* ── Section 9: Leadership team ── */}
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
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={`https://i.pravatar.cc/600?img=${member.imageSeed}`}
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

      {/* ── Section 10: Testimonials ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Client Voices"
            title="What Our Partners Say"
            subtitle="Trusted by developers and property groups across Bangladesh for transparency and timely delivery."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.project} className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6">
                <div>
                  <div className="flex gap-0.5 text-yellow-500" aria-label={`${t.stars} out of 5 stars`}>
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-text-muted">&quot;{t.quote}&quot;</p>
                </div>
                <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-sm">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <cite className="not-italic text-sm font-semibold text-text">{t.author}</cite>
                    <p className="text-xs text-text-muted">{t.role}</p>
                    <p className="text-xs text-primary">{t.project}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 11: FAQ accordion ── */}
      <section className="bg-surface-muted py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about working with Green Valley Developers."
          />
          <div className="divide-y divide-border">
            {faqs.map((faq, idx) => (
              <details key={faq.q} className="py-5 first:pt-0">
                <summary className="cursor-pointer list-none text-lg font-semibold text-text">
                  {faq.q}
                </summary>
                <p className="mt-3 text-text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 12: CTA banner ── */}
      <section className="relative overflow-hidden py-20">
<Image
          src="https://picsum.photos/seed/gv-banner-main/1920/1080"
          alt="Green Valley Developers construction banner"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="mt-5 text-lg text-primary-foreground/90">
            Let&apos;s discuss your next project — from feasibility study to final handover.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-md bg-surface px-8 py-4 text-base font-bold text-primary hover:bg-primary-soft transition-colors">
              Schedule a Consultation
            </Link>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-md border-2 border-white/40 px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-white/10 transition-colors">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 13: Partners & commitment ── */}
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
    </div>
  );
}