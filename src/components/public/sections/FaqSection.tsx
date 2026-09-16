import { faqs } from "@/data/site";
import { SectionHeading } from "@/components/public/icon-block";

export default function FaqSection() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about working with Green Valley Developers."
        />
        <div className="divide-y divide-border">
          {faqs.map((faq) => (
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
  );
}