import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary, type SpaceKey } from "@/content";
import { images, type Img } from "@/content/images";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/espaces">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return { title: d.spaces.title, description: d.spaces.intro };
}

type Row = { key: SpaceKey; main: { img: Img; group: string }; second?: { img: Img; group: string } };

const rows: Row[] = [
  { key: "pool", main: { img: images.piscine[0], group: "piscine" }, second: { img: images.piscine[3], group: "piscine" } },
  { key: "hammam", main: { img: images.hammam[0], group: "hammam" }, second: { img: images.hammam[1], group: "hammam" } },
  { key: "gym", main: { img: images["salle-de-sport"][1], group: "salle-de-sport" }, second: { img: images["salle-de-sport"][0], group: "salle-de-sport" } },
  { key: "salon", main: { img: images["salon-marocain"][0], group: "salon-marocain" }, second: { img: images["salon-marocain"][1], group: "salon-marocain" } },
  { key: "prayer", main: { img: images.priere[0], group: "priere" } },
  { key: "table", main: { img: images["petit-dejeuner"][0], group: "petit-dejeuner" }, second: { img: images.terrasse[0], group: "terrasse" } },
];

export default async function SpacesPage({ params }: PageProps<"/[locale]/espaces">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow="Villa Aya" title={d.spaces.title} intro={d.spaces.intro} img={images["salon-marocain"][0]} alt={d.alts["salon-marocain"]} />

      <section className="mx-auto max-w-[1500px] space-y-24 px-5 pb-20 md:space-y-40 md:px-10 md:pb-32">
        {rows.map(({ key, main, second }, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={key} className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
              <div className={`relative md:col-span-7 ${flip ? "md:order-2" : ""}`}>
                <Image src={main.img.src} alt={d.alts[main.group]} width={main.img.width} height={main.img.height} sizes="(min-width:768px) 55vw, 100vw" className="h-auto w-full" />
                {second && (
                  <Image src={second.img.thumb} alt={d.alts[second.group]} width={second.img.width} height={second.img.height} sizes="25vw"
                    className={`absolute -bottom-10 hidden h-auto w-[34%] border-[6px] border-paper md:block ${flip ? "-right-10" : "-left-10"}`} />
                )}
              </div>
              <div className={`md:col-span-5 ${flip ? "md:order-1 md:pr-10" : "md:pl-14"}`}>
                <span className="label text-muted">{String(i + 1).padStart(2, "0")} / {String(rows.length).padStart(2, "0")}</span>
                <h2 className="display mt-3 text-[clamp(2.17rem,4.34vw,4.34rem)]">{d.spaces.items[key].title}</h2>
                <p className="mt-5 max-w-sm text-muted">{d.spaces.items[key].text}</p>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-20 md:grid-cols-[1fr_1.6fr] md:px-10 md:py-28">
          <h2 className="display text-[2rem] md:text-[3.9rem]">{d.spaces.amenitiesTitle}</h2>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {d.spaces.amenities.map((a) => (
              <li key={a} className="border-t border-ink/40 py-3">{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand d={d} locale={locale} />
    </>
  );
}
