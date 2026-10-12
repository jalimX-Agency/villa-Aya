import type { Dictionary } from "@/content";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

const isArabic = (s: string) => /[؀-ۿ]/.test(s);

// Guest reviews copied from the villa's Booking.com listing, with the author and country as shown there.
// Deliberately NOT marked up as Review/AggregateRating: Google ignores self-hosted ratings for a business's own site.
export function Reviews({ d }: { d: Dictionary }) {
  const r = d.reviews;
  return (
    <section className="bg-sand" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <h2 id="reviews-title" className="label text-muted">{r.title}</h2>
            <p className="display mt-4 text-[clamp(6rem,14vw,12rem)] leading-none">{r.score}<span className="ms-2 text-[0.3em] text-muted">/ 10</span></p>
            <p className="display mt-2 text-[1.5rem] md:text-[2rem]">{r.scoreLabel}</p>
            <p className="mt-3 max-w-xs text-muted">{r.basis}</p>
            <dl className="mt-8 grid max-w-sm grid-cols-2 gap-x-6">
              {r.criteria.map((c) => (
                <div key={c.label} className="flex items-baseline justify-between border-t border-ink/30 py-2">
                  <dt className="text-sm text-muted">{c.label}</dt>
                  <dd className="font-medium tabular-nums">{c.value}</dd>
                </div>
              ))}
            </dl>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8">{r.cta}</a>
          </Reveal>

          <ul className="space-y-10 md:space-y-14">
            {r.items.map((it, i) => (
              <Reveal key={it.author} delay={i * 0.08}>
                <li className={i === 1 ? "md:ms-14" : ""}>
                  <figure className="border-l-[3px] border-amber pl-5 md:pl-7">
                    <blockquote className={i === 0 ? "text-xl leading-relaxed md:text-2xl" : "text-lg leading-relaxed"}>
                      <p>« {it.quote} »</p>
                    </blockquote>
                    <figcaption className="label mt-4 text-muted">
                      {it.author} · {it.country}
                      {it.from && <span className="ms-3 normal-case tracking-normal">({r.translated.replace("{from}", it.from)})</span>}
                    </figcaption>
                    {it.original && (
                      <p
                        lang={isArabic(it.original) ? "ar" : "fr"}
                        dir={isArabic(it.original) ? "rtl" : "ltr"}
                        className="mt-3 text-sm text-muted/90"
                      >
                        {it.original}
                      </p>
                    )}
                  </figure>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
