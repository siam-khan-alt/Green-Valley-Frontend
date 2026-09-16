import Link from "next/link";
import Image from "next/image";
import { values, history, team } from "@/data/site";
import { IconBlock, SectionHeading } from "@/components/public/icon-block";

export default function PublicAboutPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
<Image
          src="https://picsum.photos/seed/gv-banner-about/1400/700"
          alt="Green Valley Developers about banner"
          fill
          sizes="100vw"
          className="object-cover"
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-3xl font-extrabold sm:text-4xl">About Green Valley Developers</h1>
            <p className="mt-3 max-w-xl text-white/80">
              Since 2008, we have transformed skylines and communities across Bangladesh — one project at a time.
            </p>
          </div>
        </div>

        <section className="my-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-text">Our Story</h2>
            <p className="mt-4 text-text-muted">
              Founded in Uttara, Dhaka in 2008, Green Valley Developers began as a small team with a big
              vision: to deliver high-quality construction projects with full cost transparency and on-time
              delivery. Over the years, we have grown into a multidisciplinary firm trusted by developers,
              banks, and government bodies alike.
            </p>
            <p className="mt-4 text-text-muted">
              Our proprietary BOQ-versus-budget tracking platform, launched in 2021, gives clients real-time
              visibility into project finances — eliminating surprises and building lasting partnerships.
            </p>
          </div>
          <div className="space-y-6">
            {history.map((h) => (
              <div key={h.year} className="flex gap-4">
                <span className="shrink-0 text-xl font-extrabold text-primary">{h.year}</span>
                <div>
                  <h3 className="font-semibold text-text">{h.title}</h3>
                  <p className="text-sm text-text-muted">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-16">
          <SectionHeading kicker="Our Values" title="The Principles We Build On" subtitle="Integrity, safety, craftsmanship, and collaboration guide every decision we make." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-surface p-6">
                <IconBlock icon={v.icon} label={v.title} />
                <h3 className="mt-4 font-semibold text-text">{v.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-16">
          <SectionHeading kicker="Leadership" title="Meet the Team" subtitle="Experienced leaders guiding your project from concept to completion." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={`https://i.pravatar.cc/600?img=${m.imageSeed}`}
                    alt={m.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-text">{m.name}</h3>
                  <p className="text-sm text-primary">{m.role}</p>
                  <p className="mt-2 text-sm text-text-muted">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-primary-soft/60 p-8 text-center">
          <h2 className="text-2xl font-bold text-text">Let&apos;s Build Your Vision Together</h2>
          <p className="mt-3 text-text-muted">Have a project in mind? Reach out for a free consultation.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}