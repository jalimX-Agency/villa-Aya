import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { demandeSchema } from "@/lib/demande";
import { site } from "@/lib/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Best-effort limiter (per server instance). Add an edge/KV limiter before heavy traffic.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

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

  const row = (k: string, val: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#777">${k}</td><td style="padding:6px 0"><strong>${esc(val)}</strong></td></tr>`;

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM ?? `Villa Aya <demandes@villaaya.ma>`,
    to: site.demandEmail,
    replyTo: v.email,
    subject: `Demande de devis — ${v.name} (${v.checkIn} → ${v.checkOut})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px"><h2>Nouvelle demande de devis</h2><table>
      ${row("Nom", v.name)}${row("E-mail", v.email)}${row("Téléphone", v.phone || "—")}
      ${row("Arrivée", v.checkIn)}${row("Départ", v.checkOut)}
      ${row("Adultes", String(v.adults))}${row("Enfants", String(v.children))}
      ${row("Petit-déjeuner", v.breakfast ? "Oui" : "Non")}${row("Langue du site", v.locale)}
      </table><p style="white-space:pre-wrap">${esc(v.message || "—")}</p>
      <p style="color:#777;font-size:12px">Répondre à cet e-mail écrit directement au client.</p></div>`,
  });
  if (error) {
    console.error("Resend error", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
