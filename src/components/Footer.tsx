import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content";
import { hrefFor, navOrder } from "@/lib/routes";
import { mapsDirectionsUrl, site, whatsappUrl } from "@/lib/site";

export function Footer({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-24">
        <div>
          <Image src="/brand/logo-horizontal-dark.png" alt="Villa Aya" width={225} height={60} className="h-12 w-auto" />
          <p className="display mt-8 max-w-md text-[2rem] md:text-[2.5rem]">{d.hero.title}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="label text-paper/50">Villa Aya</span>
          {navOrder.map((k) => (
            <Link key={k} href={hrefFor(locale, k)} className="w-fit cursor-pointer py-1.5 transition-colors hover:text-amber">{d.nav[k]}</Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          <span className="label text-paper/50">Contact</span>
          <a href={whatsappUrl(d.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="w-fit cursor-pointer py-1.5 transition-colors hover:text-amber">WhatsApp {site.phoneDisplay}</a>
          <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="w-fit cursor-pointer py-1.5 transition-colors hover:text-amber">{d.contact.directions}</a>
          <a href={site.googleProfile} target="_blank" rel="noopener noreferrer" className="w-fit cursor-pointer py-1.5 transition-colors hover:text-amber">Google</a>
          <span className="text-paper/70">{d.footer.location}</span>
          <span className="text-paper/70">{d.footer.rules}</span>
        </div>
      </div>
      <div className="border-t border-paper/15 px-5 py-5 md:px-10">
        <p className="label mx-auto flex max-w-[1500px] flex-wrap justify-between gap-3 text-paper/50">
          <span>© {new Date().getFullYear()} Villa Aya. {d.footer.rights}</span>
          <Link href={hrefFor(locale, "privacy")} className="cursor-pointer py-2 transition-colors hover:text-amber">{d.footer.privacy}</Link>
        </p>
      </div>
    </footer>
  );
}
