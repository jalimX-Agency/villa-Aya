import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: PageProps<"/[locale]/confidentialite">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { ...pageMetadata(locale, "privacy"), robots: { index: true, follow: true } };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/confidentialite">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const p = d.privacy;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, "privacy", d)} />
      <PageHeader eyebrow="Villa Aya" title={p.title} intro={p.intro} />
      <section className="mx-auto max-w-[1500px] px-5 pb-24 md:px-10 md:pb-36">
        <div className="max-w-2xl">
          <p className="label text-muted">{p.updated}</p>
          {p.sections.map((s) => (
            <div key={s.h} className="mt-10">
              <h2 className="display text-[1.5rem] md:text-[2rem]">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t} className="mt-3 text-muted">{t}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
