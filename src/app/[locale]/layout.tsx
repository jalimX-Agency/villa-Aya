import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Marcellus, Figtree, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/content";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Marcellus: calm Roman capitals chosen by the client (single weight, 400).
const display = Marcellus({ variable: "--font-display", subsets: ["latin"], weight: "400", display: "swap" });
const body = Figtree({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400"], display: "swap" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4eee3" };

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: d.meta.title, template: "%s | Villa Aya" },
    description: d.meta.description,
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <SmoothScroll />
        <Header locale={locale} d={d} />
        {children}
        <Footer locale={locale} d={d} />
        <WhatsAppButton d={d} />
      </body>
    </html>
  );
}
