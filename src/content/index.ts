import type { Locale } from "@/lib/i18n/config";
import { fr } from "./fr";
import { en } from "./en";

export type VillaCard = "chalet" | "rose" | "salon" | "bains";
export type SpaceKey = "pool" | "hammam" | "gym" | "salon" | "prayer" | "table";
export type FilterKey = "all" | "outdoor" | "chalet" | "salons" | "rooms" | "wellness" | "table";
export type PageLink = "villa" | "spaces" | "gallery" | "around";
export type SeoPage = "home" | "villa" | "spaces" | "gallery" | "around" | "contact";

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { home: string; villa: string; spaces: string; gallery: string; around: string; contact: string; quote: string; menu: string; close: string };
  hero: { eyebrow: string; title: string; subtitle: string; cta: string; whatsapp: string };
  home: {
    statement: string;
    statementText: string;
    links: Record<PageLink, { title: string; text: string }>;
    ctaTitle: string;
    ctaText: string;
  };
  facts: readonly { value: string; unit: string; label: string }[];
  villa: {
    title: string;
    intro: string;
    cards: Record<VillaCard, { title: string; text: string }>;
    rulesTitle: string;
    rules: readonly string[];
  };
  spaces: {
    title: string;
    intro: string;
    items: Record<SpaceKey, { title: string; text: string }>;
    amenitiesTitle: string;
    amenities: readonly string[];
  };
  gallery: { title: string; intro: string; close: string; filters: Record<FilterKey, string> };
  around: { title: string; intro: string; items: readonly { title: string; text: string }[] };
  contact: { directions: string; title: string; text: string; infoTitle: string; info: readonly string[] };
  alts: Record<string, string>;
  form: Record<
    | "title" | "intro" | "name" | "email" | "phone" | "checkIn" | "checkOut" | "adults" | "children"
    | "breakfast" | "message" | "send" | "sending" | "success" | "error" | "required" | "invalidEmail" | "invalidDates",
    string
  >;
  reviews: {
    title: string;
    score: string;
    scoreLabel: string;
    basis: string;
    cta: string;
    translated: string; // template with {from}
    criteria: readonly { label: string; value: string }[];
    items: readonly { quote: string; author: string; country: string; from?: string; original?: string }[];
  };
  seo: Record<SeoPage, { title: string; description: string }>;
  seoH1: string;
  faq: { title: string; items: readonly { q: string; a: string }[] };
  whatsappMessage: string;
  footer: { rights: string; rules: string; location: string };
  more: string;
};

const dictionaries: Record<Locale, Dictionary> = { fr, en };
export const getDictionary = (l: Locale) => dictionaries[l];
