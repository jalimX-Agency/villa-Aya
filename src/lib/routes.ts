export const routes = {
  home: "",
  villa: "/la-villa",
  spaces: "/espaces",
  gallery: "/galerie",
  around: "/alentours",
  contact: "/contact",
} as const;

export type RouteKey = keyof typeof routes;
export const navOrder: RouteKey[] = ["villa", "spaces", "gallery", "around", "contact"];
export const hrefFor = (locale: string, key: RouteKey) => `/${locale}${routes[key]}`;
