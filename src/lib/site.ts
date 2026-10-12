export const site = {
  name: "Villa Aya",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://villaaya.ma",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "33787454031",
  phoneDisplay: "+33 7 87 45 40 31",
  demandEmail: process.env.DEMAND_TO_EMAIL ?? "res@villaaya.ma",
  // Google Business Profile ("villa aya", Plus Code WXFJ+927 Aidane). Coordinates confirmed on Google Maps.
  bookingUrl: "https://www.booking.com/hotel/ma/villa-aya-oujda.fr.html",
  googleProfile: "https://share.google/6qZuHkoiijR54Uwrn",
  geo: { lat: 34.9234375, lng: -2.0199375 },
} as const;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;
export const mapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;

export const whatsappUrl = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
