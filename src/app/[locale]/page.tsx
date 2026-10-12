import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary, type PageLink } from "@/content";
import { images } from "@/content/images";
import { pageMetadata, rentalJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { hrefFor } from "@/lib/routes";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Reviews } from "@/components/Reviews";

const linkImages = {
  villa: images["chambre-chalet"][0],
  spaces: images.hammam[0],
  gallery: images.exterieur[1],
  around: images.piscine[4],
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "home");
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);

  const night = images.exterieur[0];
  const links = Object.keys(linkImages) as PageLink[];

  return (
    <>
      <JsonLd data={rentalJsonLd(locale, d)} />
      <Hero d={d} locale={locale} />

      <section className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 md:grid-cols-[1.4fr_1fr] md:gap-20 md:px-10 md:py-36">
        <Reveal>
          <h2 className="display text-[clamp(2.17rem,5.58vw,5.58rem)]">{d.home.statement}</h2>
          <p className="mt-8 max-w-xl text-lg text-muted">{d.home.statementText}</p>
        </Reveal>
        <Reveal delay={0.1} className="md:pt-24">
          <div className="arch relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden">
            <Image src={night.src} alt={d.alts.exterieur} fill sizes="(min-width:768px) 28vw, 80vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      <section className="border-y border-ink" aria-label="Villa Aya">
        <dl className="mx-auto grid max-w-[1500px] grid-cols-2 md:grid-cols-4">
          {d.facts.map((f, i) => (
            <div key={f.label} className={`px-5 py-10 md:px-10 md:py-14 ${i % 2 === 1 ? "border-l border-ink/30" : ""} ${i > 1 ? "border-t border-ink/30 md:border-t-0" : ""} ${i > 0 ? "md:border-l md:border-ink/30" : ""}`}>
              <dt className="display text-[clamp(2.79rem,5.58vw,5.58rem)]">{f.value}<span className="ms-1 text-[0.4em] text-muted">{f.unit}</span></dt>
              <dd className="label mt-2 text-muted">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Reviews d={d} />

      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-32">
        <ul>
          {links.map((k, i) => {
            const img = linkImages[k];
            return (
              <li key={k} className="border-t border-ink last:border-b">
                <Link href={hrefFor(locale, k)} className="group relative grid cursor-pointer items-center gap-4 py-8 md:grid-cols-[4rem_1.3fr_1fr_auto] md:gap-8 md:py-10">
                  <span className="label text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[clamp(1.86rem,4.34vw,4.34rem)] transition-colors group-hover:text-amber-deep">{d.home.links[k].title}</span>
                  <span className="max-w-sm text-muted">{d.home.links[k].text}</span>
                  <span className="relative hidden h-24 w-36 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                    <Image src={img.thumb} alt="" fill sizes="144px" className="object-cover" />
                  </span>
                  <span className="label md:hidden">{d.more} →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <CtaBand d={d} locale={locale} />
    </>
  );
}
