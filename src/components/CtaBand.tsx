import Link from "next/link";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n/config";
import { hrefFor } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";

export function CtaBand({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <section className="bg-amber">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-20 md:grid-cols-[1.5fr_1fr] md:items-end md:px-10 md:py-32">
        <h2 className="display text-[clamp(2.17rem,6.2vw,6.2rem)] text-ink">{d.home.ctaTitle}</h2>
        <div className="flex flex-col gap-6">
          <p className="max-w-sm text-ink/80">{d.home.ctaText}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={hrefFor(locale, "contact")} className="btn bg-ink text-paper hover:bg-paper hover:text-ink">{d.hero.cta}</Link>
            <a href={whatsappUrl(d.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{d.hero.whatsapp}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
