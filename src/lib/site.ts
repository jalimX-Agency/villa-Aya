export const site = {
  name: "Villa Aya",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://villaaya.ma",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "33787454031",
  phoneDisplay: "+33 7 87 45 40 31",
  demandEmail: process.env.DEMAND_TO_EMAIL ?? "res@villaaya.ma",
} as const;

export const whatsappUrl = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
