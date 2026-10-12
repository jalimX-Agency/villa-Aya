import type { Metadata } from "next";
import { getDictionary, type Dictionary, type SeoPage } from "@/content";
import { images } from "@/content/images";
import { locales, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { mapsPlaceUrl, site } from "@/lib/site";

const pathFor: Record<SeoPage, string> = {
  home: routes.home,
  villa: routes.villa,
  spaces: routes.spaces,
  gallery: routes.gallery,
  around: routes.around,
  contact: routes.contact,
};

const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };
export const OG_IMAGE = { url: "/og/og.jpg", width: 1200, height: 630 };

/** Title, description, canonical, hreflang (+ x-default), Open Graph and Twitter for one page. */
export function pageMetadata(locale: Locale, page: SeoPage): Metadata {
  const d = getDictionary(locale);
  const { title, description } = d.seo[page];
  const path = pathFor[page];
  const url = `/${locale}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])), "x-default": `/fr${path}` },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ ...OG_IMAGE, alt: d.alts.piscine }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

// ---- JSON-LD builders. Only facts the owner confirmed: no price, no rating, no coordinates. ----

const abs = (path: string) => `${site.url}${path}`;

export function rentalJsonLd(locale: Locale, d: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${site.url}/#villa`,
    name: site.name,
    url: abs(`/${locale}`),
    description: d.seo.home.description,
    image: [images.piscine[1].src, images.exterieur[0].src, images["chambre-chalet"][0].src, images.hammam[0].src].map(abs),
    inLanguage: locale,
    address: { "@type": "PostalAddress", addressLocality: "Ahfir", postalCode: "60350", addressRegion: "Oujda", addressCountry: "MA" },
    telephone: `+${site.whatsapp}`,
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: mapsPlaceUrl,
    sameAs: [site.googleProfile],
    petsAllowed: true,
    checkinTime: "14:00",
    checkoutTime: "11:00",
    availableLanguage: ["Arabic", "French", "English", "Spanish"],
    containsPlace: { "@type": "Accommodation", numberOfBedrooms: 4, numberOfBathroomsTotal: 3 },
    amenityFeature: ["Private pool", "Jacuzzi", "Hammam", "Gym", "Prayer room", "Barbecue", "Free WiFi", "Free parking", "Air conditioning", "Equipped kitchen"].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
  };
}

export function breadcrumbJsonLd(locale: Locale, page: Exclude<SeoPage, "home">, d: Dictionary) {
  const names: Record<Exclude<SeoPage, "home">, string> = {
    villa: d.nav.villa,
    spaces: d.nav.spaces,
    gallery: d.nav.gallery,
    around: d.nav.around,
    contact: d.nav.contact,
  };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: d.nav.home, item: abs(`/${locale}`) },
      { "@type": "ListItem", position: 2, name: names[page], item: abs(`/${locale}${pathFor[page]}`) },
    ],
  };
}

export function faqJsonLd(d: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
}
