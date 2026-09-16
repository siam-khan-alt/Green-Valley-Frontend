import Link from "next/link";
import Image from "next/image";

export default function CtaBannerSection() {
  return (
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
  );
}