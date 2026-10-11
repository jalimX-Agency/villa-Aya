import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/content";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { images } from "@/content/images";
import { PageHeader } from "@/components/PageHeader";
import { StackedCards } from "@/components/StackedCards";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-villa">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "villa");
}

export default async function VillaPage({ params }: PageProps<"/[locale]/la-villa">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const c = d.villa.cards;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(locale, "villa", d), faqJsonLd(d)]} />
      <PageHeader eyebrow="Villa Aya" title={d.villa.title} intro={d.villa.intro} img={images.piscine[2]} alt={d.alts.piscine} />

      <StackedCards
        cards={[
          { ...c.chalet, img: images["chambre-chalet"][0], alt: d.alts["chambre-chalet"] },
          { ...c.rose, img: images["chambre-rose"][0], alt: d.alts["chambre-rose"] },
          { ...c.salon, img: images["salon-rdc"][0], alt: d.alts["salon-rdc"] },
          { ...c.bains, img: images["salle-de-bain"][0], alt: d.alts["salle-de-bain"] },
        ]}
      />

      <section className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 md:grid-cols-[1fr_1fr] md:gap-20 md:px-10 md:py-32">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px bg-ink/30">
            {d.facts.map((f) => (
              <div key={f.label} className="bg-paper p-6 md:p-8">
                <dt className="display text-[clamp(2.48rem,4.34vw,4.34rem)]">{f.value}<span className="ms-1 text-[0.4em] text-muted">{f.unit}</span></dt>
                <dd className="label mt-1 text-muted">{f.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[2rem] md:text-[3rem]">{d.villa.rulesTitle}</h2>
          <ul className="mt-8">
            {d.villa.rules.map((r) => (
              <li key={r} className="border-t border-ink/30 py-3">{r}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Faq d={d} />

      <CtaBand d={d} locale={locale} />
    </>
  );
}
