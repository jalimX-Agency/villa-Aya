"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, type Locale } from "@/lib/i18n/config";
import { hrefFor, navOrder, routes } from "@/lib/routes";
import type { Dictionary } from "@/content";

export function Header({ locale, d }: { locale: Locale; d: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rest = pathname.split("/").slice(2).join("/");
  const langHref = (l: Locale) => `/${l}${rest ? `/${rest}` : ""}`;
  const isActive = (k: (typeof navOrder)[number]) => pathname === hrefFor(locale, k);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const label = (k: (typeof navOrder)[number]) => d.nav[k];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-paper/95">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <Link href={`/${locale}`} aria-label="Villa Aya" className="cursor-pointer">
            <Image src="/brand/logo-icon-light.png" alt="Villa Aya" width={40} height={40} className="h-10 w-auto sm:hidden" priority />
            <Image src="/brand/logo-horizontal-light.png" alt="" aria-hidden width={225} height={60} className="hidden h-9 w-auto sm:block" priority />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {navOrder.filter((k) => k !== "contact").map((k) => (
              <Link key={k} href={hrefFor(locale, k)} aria-current={isActive(k) ? "page" : undefined}
                className={`label cursor-pointer border-b pb-0.5 transition-colors ${isActive(k) ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}>
                {label(k)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="label flex items-center text-muted" aria-label="Language">
              {locales.map((l, i) => (
                <span key={l} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="px-0.5">/</span>}
                  <Link href={langHref(l)} hrefLang={l} aria-current={l === locale ? "true" : undefined} className={`-my-3 inline-flex min-h-11 min-w-8 cursor-pointer items-center justify-center ${l === locale ? "text-ink" : "hover:text-ink"}`}>{l}</Link>
                </span>
              ))}
            </span>
            <Link href={hrefFor(locale, "contact")} className="btn btn-primary !min-h-10 !px-4">{d.nav.quote}</Link>
            <button onClick={() => setOpen(true)} className="label -my-3 min-h-11 min-w-11 cursor-pointer lg:hidden" aria-expanded={open} aria-controls="mobile-menu">{d.nav.menu}</button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex flex-col bg-paper px-5 pb-8 pt-5 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="label text-muted">Villa Aya</span>
            <button onClick={() => setOpen(false)} className="label cursor-pointer">{d.nav.close}</button>
          </div>
          <nav className="mt-10 flex flex-1 flex-col justify-center gap-2" aria-label="Mobile">
            {(["home", ...navOrder] as const).map((k) => (
              <Link key={k} href={`/${locale}${routes[k]}`} className="display cursor-pointer text-[2.5rem] text-ink hover:text-amber-deep">
                {k === "home" ? d.nav.home : label(k)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
