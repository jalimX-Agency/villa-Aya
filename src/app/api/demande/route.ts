import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { demandeSchema } from "@/lib/demande";
import { site } from "@/lib/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

// Best-effort limiter (per server instance). Add an edge/KV limiter before heavy traffic.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const confirmation = {
  fr: {
    subject: "Villa Aya : nous avons bien reçu votre demande",
    title: "Votre demande est bien reçue",
    body: (name: string) =>
      `Bonjour ${name},<br><br>Merci pour votre demande de devis. Nous vous répondons personnellement sous 24 h, avec un lien WhatsApp pour échanger directement.<br><br>À très bientôt,<br>Villa Aya`,
  },
  en: {
    subject: "Villa Aya: we've received your request",
    title: "We've received your request",
    body: (name: string) =>
      `Hello ${name},<br><br>Thank you for your quote request. We will reply personally within 24 hours, with a WhatsApp link so we can talk directly.<br><br>See you soon,<br>Villa Aya`,
  },
} as const;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = demandeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const v = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; quote request not delivered");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const from = process.env.RESEND_FROM ?? "Villa Aya <demandes@villaaya.ma>";
  const resend = new Resend(apiKey);
  const row = (k: string, val: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#777">${k}</td><td style="padding:6px 0"><strong>${esc(val)}</strong></td></tr>`;

  // 1) Request to the owner. This is the one that must succeed.
  const { error } = await resend.emails.send({
    from,
    to: site.demandEmail,
    replyTo: v.email,
    subject: oneLine(`Demande de devis — ${v.name} (${v.checkIn} → ${v.checkOut})`),
    html: `<div style="font-family:Arial,sans-serif;max-width:560px"><h2>Nouvelle demande de devis</h2><table>
      ${row("Nom", v.name)}${row("E-mail", v.email)}${row("Téléphone", v.phone || "—")}
      ${row("Arrivée", v.checkIn)}${row("Départ", v.checkOut)}
      ${row("Adultes", String(v.adults))}${row("Enfants", String(v.children))}
      ${row("Petit-déjeuner", v.breakfast ? "Oui" : "Non")}${row("Langue du site", v.locale)}
      </table><p style="white-space:pre-wrap">${esc(v.message || "—")}</p>
      <p style="color:#777;font-size:12px">Répondre à cet e-mail écrit directement au client.</p></div>`,
  });
  if (error) {
    // Full detail goes to the Vercel logs; the response only carries the error name (no secrets).
    console.error("Resend error (owner mail)", { name: error.name, message: error.message, from, to: site.demandEmail });
    return NextResponse.json({ error: "send_failed", reason: error.name }, { status: 502 });
  }

  // 2) Acknowledgement to the guest. Best effort: never fails the request.
  const c = confirmation[v.locale];
  const { error: ackError } = await resend.emails.send({
    from,
    to: v.email,
    replyTo: site.demandEmail,
    subject: c.subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px"><h2>${c.title}</h2><p>${c.body(esc(oneLine(v.name)))}</p>
      <p style="color:#777;font-size:12px">${esc(oneLine(`${v.checkIn} → ${v.checkOut} · ${v.adults} + ${v.children}`))}</p></div>`,
  });
  if (ackError) console.error("Resend error (guest confirmation)", { name: ackError.name, message: ackError.message });

  return NextResponse.json({ ok: true });
}
