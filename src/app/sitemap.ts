import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).flatMap((path) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: { ...Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${path}`])), "x-default": `${site.url}/fr${path}` } },
    })),
  );
}
