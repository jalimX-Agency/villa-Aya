import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/content";
import { PageHeader } from "@/components/PageHeader";
import { Gallery } from "@/components/Gallery";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/galerie">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return { title: d.gallery.title, description: d.gallery.intro };
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/galerie">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow="Villa Aya" title={d.gallery.title} intro={d.gallery.intro} />
      <Gallery d={d} />
      <CtaBand d={d} locale={locale} />
    </>
  );
}
