import { SectionHeading } from "@/components/Section";
import { testimonials } from "@/lib/data";

function Stars() {
  return (
    <div className="flex gap-0.5 text-rindu-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="m12 2 2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 6 20.4l1.4-6.8L2.3 9l6.9-.7L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimoni" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-coal-800/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Kata Mereka"
          title="Rindu yang selalu kembali"
          description="Lebih dari sekadar makanan, kami menghadirkan kenangan yang membuat tamu kami terus kembali."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="reveal flex h-full flex-col rounded-2xl border border-rindu-900/50 bg-coal-800/40 p-7 transition-colors hover:border-rindu-700/70"
              data-delay={`${i * 110}`}
            >
              <Stars />
              <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed text-rindu-50/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-rindu-900/60 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rindu-500/20 font-display text-sm font-semibold text-rindu-300">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-rindu-50">{t.name}</p>
                  <p className="text-xs text-rindu-100/60">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
