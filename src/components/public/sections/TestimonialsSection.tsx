import { testimonials } from "@/data/site";
import { SectionHeading } from "@/components/public/icon-block";

export default function TestimonialsSection() {
  return (
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
  );
}