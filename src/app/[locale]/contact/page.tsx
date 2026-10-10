import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/content";
import { site, whatsappUrl } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm } from "@/components/QuoteForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return { title: d.form.title, description: d.contact.text };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow="Villa Aya" title={d.contact.title} intro={d.contact.text} />
      <section className="mx-auto grid max-w-[1500px] gap-12 px-5 pb-24 md:grid-cols-[1fr_1.5fr] md:gap-20 md:px-10 md:pb-36">
        <aside>
          <h2 className="display text-[1.5rem] md:text-[2rem]">{d.contact.infoTitle}</h2>
          <a href={whatsappUrl(d.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">WhatsApp {site.phoneDisplay}</a>
          <ul className="mt-8">
            {d.contact.info.map((l) => (
              <li key={l} className="border-t border-ink/30 py-3">{l}</li>
            ))}
            <li className="border-t border-ink/30 py-3 text-muted">{d.footer.location}</li>
          </ul>
        </aside>
        <div>
          <h2 className="display mb-8 text-[1.5rem] md:text-[2rem]">{d.form.title}</h2>
          <QuoteForm d={d} locale={locale} />
        </div>
      </section>
    </>
  );
}
