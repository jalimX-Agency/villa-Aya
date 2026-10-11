import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { demandeSchema } from "@/lib/demande";
import { guestMail, ownerMail } from "@/lib/email-templates";
import { site } from "@/lib/site";

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

  const from = process.env.RESEND_FROM ?? "Villa Aya <demandes@villaaya.ma>";
  const resend = new Resend(apiKey);

  // 1) Request to the owner. This is the one that must succeed.
  const owner = ownerMail(v);
  const { error } = await resend.emails.send({
    from,
    to: site.demandEmail,
    replyTo: v.email,
    subject: owner.subject,
    html: owner.html,
    text: owner.text,
  });
  if (error) {
    // Full detail goes to the Vercel logs; the response only carries the error name (no secrets).
    console.error("Resend error (owner mail)", { name: error.name, message: error.message, from, to: site.demandEmail });
    return NextResponse.json({ error: "send_failed", reason: error.name }, { status: 502 });
  }

  // 2) Acknowledgement to the guest. Best effort: never fails the request.
  const guest = guestMail(v);
  const { error: ackError } = await resend.emails.send({
    from,
    to: v.email,
    replyTo: site.demandEmail,
    subject: guest.subject,
    html: guest.html,
    text: guest.text,
  });
  if (ackError) console.error("Resend error (guest confirmation)", { name: ackError.name, message: ackError.message });

  return NextResponse.json({ ok: true });
}
