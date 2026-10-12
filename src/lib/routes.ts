export const routes = {
  home: "",
  villa: "/la-villa",
  spaces: "/espaces",
  gallery: "/galerie",
  around: "/alentours",
  contact: "/contact",
  privacy: "/confidentialite",
} as const;

export type RouteKey = keyof typeof routes;
export type NavKey = "villa" | "spaces" | "gallery" | "around" | "contact";
export const navOrder: NavKey[] = ["villa", "spaces", "gallery", "around", "contact"];
export const hrefFor = (locale: string, key: RouteKey) => `/${locale}${routes[key]}`;
