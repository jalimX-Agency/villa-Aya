import type { Demande } from "@/lib/demande";
import { site } from "@/lib/site";

type Locale = Demande["locale"];

// Table-based, inline-CSS HTML: the only layout that renders reliably across Gmail, Outlook and Apple Mail.
// Webfonts are not available in email, so headings use Georgia in capitals (closest to Marcellus).

const C = { paper: "#f4eee3", card: "#ffffff", ink: "#1c150f", muted: "#66564a", line: "#e3d8c4", amber: "#d9953a", sand: "#e9dfcd" };
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const intlLocale = (l: Locale) => (l === "fr" ? "fr-FR" : "en-GB");
const fmtDate = (iso: string, l: Locale) =>
  new Intl.DateTimeFormat(intlLocale(l), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const nightsBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

/** wa.me needs an international number: accept "+212…" or "00212…", otherwise return null. */
export function whatsappNumber(phone: string): string | null {
  const p = phone.replace(/[\s().-]/g, "");
  if (/^\+\d{8,15}$/.test(p)) return p.slice(1);
  if (/^00\d{8,15}$/.test(p)) return p.slice(2);
  return null;
}

const t = {
  fr: {
    nights: (n: number) => `${n} nuit${n > 1 ? "s" : ""}`,
    adults: (n: number) => `${n} adulte${n > 1 ? "s" : ""}`,
    children: (n: number) => `${n} enfant${n > 1 ? "s" : ""}`,
    yes: "Oui",
    no: "Non",
    owner: {
      pre: (name: string, a: string, b: string) => `${name} · ${a} → ${b}`,
      title: "Nouvelle demande de devis",
      stay: "Séjour demandé",
      who: "Voyageurs",
      contact: "Coordonnées",
      name: "Nom",
      email: "E-mail",
      phone: "Téléphone",
      breakfast: "Petit-déjeuner",
      message: "Message",
      none: "Aucun message",
      waBtn: "Répondre sur WhatsApp",
      mailBtn: "Répondre par e-mail",
      noWa: "Pas de numéro international : répondez par e-mail.",
      foot: (lang: string) => `Reçu via villaaya.ma · langue du site : ${lang}`,
      waText: (name: string, a: string, b: string) =>
        `Bonjour ${name}, merci pour votre demande pour la Villa Aya du ${a} au ${b}. Je reviens vers vous avec les détails.`,
      mailSubject: "Votre séjour à la Villa Aya",
    },
    guest: {
      subject: "Villa Aya : nous avons bien reçu votre demande",
      pre: "Nous vous répondons sous 24 h avec un lien WhatsApp.",
      title: "Votre demande est bien reçue",
      hello: (name: string) => `Bonjour ${name},`,
      lead: "Merci pour votre demande de devis. Voici ce que nous avons noté :",
      next: "Et maintenant ?",
      steps: ["Nous vérifions la disponibilité de vos dates.", "Vous recevez notre réponse personnelle sous 24 h, avec un lien WhatsApp pour échanger directement."],
      stay: "Votre séjour",
      who: "Voyageurs",
      breakfast: "Petit-déjeuner",
      wa: "Écrire sur WhatsApp",
      bye: "À très bientôt,",
      team: "L'équipe Villa Aya",
      rules: "Non-fumeur · Fêtes et événements non autorisés",
    },
  },
  en: {
    nights: (n: number) => `${n} night${n > 1 ? "s" : ""}`,
    adults: (n: number) => `${n} adult${n > 1 ? "s" : ""}`,
    children: (n: number) => `${n} child${n === 1 ? "" : "ren"}`,
    yes: "Yes",
    no: "No",
    owner: {
      pre: (name: string, a: string, b: string) => `${name} · ${a} → ${b}`,
      title: "New quote request",
      stay: "Requested stay",
      who: "Guests",
      contact: "Contact",
      name: "Name",
      email: "Email",
      phone: "Phone",
      breakfast: "Breakfast",
      message: "Message",
      none: "No message",
      waBtn: "Reply on WhatsApp",
      mailBtn: "Reply by email",
      noWa: "No international phone number: reply by email.",
      foot: (lang: string) => `Received via villaaya.ma · site language: ${lang}`,
      waText: (name: string, a: string, b: string) =>
        `Hello ${name}, thank you for your request for Villa Aya from ${a} to ${b}. I'll get back to you with the details.`,
      mailSubject: "Your stay at Villa Aya",
    },
    guest: {
      subject: "Villa Aya: we've received your request",
      pre: "We'll reply within 24 hours with a WhatsApp link.",
      title: "We've received your request",
      hello: (name: string) => `Hello ${name},`,
      lead: "Thank you for your quote request. Here is what we noted:",
      next: "What happens next",
      steps: ["We check the availability of your dates.", "You receive our personal reply within 24 hours, with a WhatsApp link so we can talk directly."],
      stay: "Your stay",
      who: "Guests",
      breakfast: "Breakfast",
      wa: "Message us on WhatsApp",
      bye: "See you soon,",
      team: "The Villa Aya team",
      rules: "Non-smoking · No parties or events",
    },
  },
} as const;

function row(label: string, value: string) {
  return `<tr><td style="padding:9px 0;border-top:1px solid ${C.line};font:12px/1.4 ${SANS};letter-spacing:.06em;text-transform:uppercase;color:${C.muted};width:38%;vertical-align:top">${label}</td>
<td style="padding:9px 0;border-top:1px solid ${C.line};font:15px/1.5 ${SANS};color:${C.ink};vertical-align:top"><strong>${value}</strong></td></tr>`;
}

function button(href: string, label: string, primary: boolean) {
  const bg = primary ? C.amber : C.card;
  const border = primary ? C.amber : C.ink;
  return `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:14px 22px;background:${bg};border:1px solid ${border};color:${C.ink};font:600 13px/1 ${SANS};letter-spacing:.06em;text-transform:uppercase;text-decoration:none">${label}</a>`;
}

function shell(opts: { preheader: string; title: string; body: string; footer: string }) {
  const logo = `${site.url}/brand/logo-horizontal-light.png`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(opts.title)}</title></head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper}">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.card};border-top:4px solid ${C.amber}">
<tr><td style="padding:26px 32px 18px"><img src="${logo}" alt="Villa Aya" width="170" style="display:block;border:0;height:auto;width:170px"></td></tr>
<tr><td style="padding:0 32px 8px"><h1 style="margin:0;font:400 26px/1.15 ${SERIF};letter-spacing:.02em;text-transform:uppercase;color:${C.ink}">${esc(opts.title)}</h1></td></tr>
<tr><td style="padding:14px 32px 28px;font:15px/1.6 ${SANS};color:${C.ink}">${opts.body}</td></tr>
<tr><td style="padding:16px 32px;background:${C.sand};font:12px/1.5 ${SANS};color:${C.muted}">${opts.footer}</td></tr>
</table></td></tr></table></body></html>`;
}

export type Mail = { subject: string; html: string; text: string };

export function ownerMail(v: Demande): Mail {
  const l = v.locale;
  const tx = t[l];
  const o = tx.owner;
  const a = fmtDate(v.checkIn, l);
  const b = fmtDate(v.checkOut, l);
  const n = nightsBetween(v.checkIn, v.checkOut);
  const guests = [tx.adults(v.adults), v.children > 0 ? tx.children(v.children) : ""].filter(Boolean).join(", ");
  const wa = whatsappNumber(v.phone);
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(o.waText(oneLine(v.name), a, b))}` : null;
  const mailHref = `mailto:${encodeURIComponent(v.email)}?subject=${encodeURIComponent(o.mailSubject)}`;

  const body = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};margin:0 0 20px"><tr><td style="padding:16px 18px">
  <div style="font:12px/1.4 ${SANS};letter-spacing:.06em;text-transform:uppercase;color:${C.muted}">${o.stay}</div>
  <div style="font:400 20px/1.3 ${SERIF};color:${C.ink};margin-top:4px">${esc(a)} &rarr; ${esc(b)}</div>
  <div style="font:14px/1.4 ${SANS};color:${C.muted};margin-top:2px">${esc(tx.nights(n))} &middot; ${esc(guests)}</div>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px">
  ${row(o.name, esc(oneLine(v.name)))}
  ${row(o.email, `<a href="mailto:${esc(v.email)}" style="color:${C.ink}">${esc(v.email)}</a>`)}
  ${row(o.phone, v.phone ? esc(oneLine(v.phone)) : "&mdash;")}
  ${row(o.breakfast, v.breakfast ? tx.yes : tx.no)}
</table>
<div style="font:12px/1.4 ${SANS};letter-spacing:.06em;text-transform:uppercase;color:${C.muted};margin:0 0 6px">${o.message}</div>
<div style="border-left:3px solid ${C.amber};padding:4px 0 4px 14px;margin:0 0 24px;font:15px/1.6 ${SANS};white-space:pre-wrap;color:${C.ink}">${v.message ? esc(v.message) : `<span style="color:${C.muted}">${o.none}</span>`}</div>
<div>${waHref ? button(waHref, o.waBtn, true) : ""}${button(mailHref, o.mailBtn, !waHref)}</div>
${waHref ? "" : `<div style="font:13px/1.5 ${SANS};color:${C.muted}">${o.noWa}</div>`}`;

  const text = [
    o.title,
    `${a} → ${b} (${tx.nights(n)}) · ${guests}`,
    `${o.name}: ${oneLine(v.name)}`,
    `${o.email}: ${v.email}`,
    `${o.phone}: ${v.phone || "-"}`,
    `${o.breakfast}: ${v.breakfast ? tx.yes : tx.no}`,
    `${o.message}: ${v.message || o.none}`,
    waHref ? `WhatsApp: ${waHref}` : "",
  ].filter(Boolean).join("\n");

  return {
    subject: oneLine(`${o.title} · ${v.name} · ${v.checkIn} → ${v.checkOut}`),
    html: shell({ preheader: o.pre(oneLine(v.name), a, b), title: o.title, body, footer: esc(o.foot(l)) }),
    text,
  };
}

export function guestMail(v: Demande): Mail {
  const l = v.locale;
  const tx = t[l];
  const g = tx.guest;
  const a = fmtDate(v.checkIn, l);
  const b = fmtDate(v.checkOut, l);
  const n = nightsBetween(v.checkIn, v.checkOut);
  const guests = [tx.adults(v.adults), v.children > 0 ? tx.children(v.children) : ""].filter(Boolean).join(", ");
  const waHref = `https://wa.me/${site.whatsapp}`;
  const name = esc(oneLine(v.name));

  const steps = g.steps
    .map((s, i) => `<tr><td style="vertical-align:top;padding:0 12px 10px 0;font:400 18px/1.4 ${SERIF};color:${C.amber}">${i + 1}</td><td style="padding:0 0 10px;font:15px/1.55 ${SANS};color:${C.ink}">${esc(s)}</td></tr>`)
    .join("");

  const body = `
<p style="margin:0 0 12px">${g.hello(name)}</p>
<p style="margin:0 0 18px">${esc(g.lead)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
  ${row(g.stay, `${esc(a)} &rarr; ${esc(b)} <span style="font-weight:400;color:${C.muted}">(${esc(tx.nights(n))})</span>`)}
  ${row(g.who, esc(guests))}
  ${row(g.breakfast, v.breakfast ? tx.yes : tx.no)}
</table>
<div style="font:400 17px/1.3 ${SERIF};letter-spacing:.04em;text-transform:uppercase;margin:0 0 12px">${esc(g.next)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px">${steps}</table>
<div style="margin:0 0 22px">${button(waHref, g.wa, true)}</div>
<p style="margin:0">${esc(g.bye)}<br><strong>${esc(g.team)}</strong></p>`;

  const text = [
    g.hello(oneLine(v.name)),
    "",
    g.lead,
    `${g.stay}: ${a} → ${b} (${tx.nights(n)})`,
    `${g.who}: ${guests}`,
    "",
    g.next,
    ...g.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `WhatsApp: ${waHref}`,
    "",
    `${g.bye} ${g.team}`,
  ].join("\n");

  return {
    subject: g.subject,
    html: shell({
      preheader: g.pre,
      title: g.title,
      body,
      footer: `Villa Aya &middot; Ahfir, 60350 Oujda, Maroc &middot; <a href="${site.url}" style="color:${C.muted}">villaaya.ma</a><br>${esc(g.rules)}`,
    }),
    text,
  };
}
