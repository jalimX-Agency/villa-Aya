import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/content";
import { images } from "@/content/images";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/alentours">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return { title: d.around.title, description: d.around.intro };
}

export default async function AroundPage({ params }: PageProps<"/[locale]/alentours">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow="Villa Aya" title={d.around.title} intro={d.around.intro} img={images.piscine[4]} alt={d.alts.piscine} />
      <section className="mx-auto max-w-[1500px] px-5 pb-20 md:px-10 md:pb-32">
        <ul>
          {d.around.items.map((it, i) => (
            <Reveal key={it.title}>
              <li className="grid items-baseline gap-3 border-t border-ink py-8 last:border-b md:grid-cols-[4rem_1.3fr_1fr] md:gap-8 md:py-12">
                <span className="label text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display text-[clamp(2.17rem,4.96vw,4.96rem)]">{it.title}</h2>
                <p className="max-w-sm text-muted">{it.text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBand d={d} locale={locale} />
    </>
  );
}
