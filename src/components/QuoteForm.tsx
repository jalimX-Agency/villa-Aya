"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demandeSchema } from "@/lib/demande";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n/config";
import { hrefFor } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { trackEvent } from "./Analytics";
import { Turnstile, turnstileEnabled } from "./Turnstile";
import type { z } from "zod";

type Input = z.input<typeof demandeSchema>;
const field = "mt-1 w-full border border-ink/40 bg-paper px-3 py-3 text-ink outline-none transition-colors focus:border-ink focus:bg-white";
const label = "label block text-muted";

const addDays = (iso: string, n: number) => {
  const dt = new Date(`${iso}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
};

export function QuoteForm({ d, locale }: { d: Dictionary; locale: Locale }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [today, setToday] = useState(""); // set after mount: the server's "today" may differ from the visitor's
  const [token, setToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const f = d.form;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Input>({
    resolver: zodResolver(demandeSchema),
    defaultValues: { adults: 2, children: 0, breakfast: false, locale, website: "", captcha: "" },
  });

  useEffect(() => setToday(new Date().toLocaleDateString("en-CA")), []);
  const checkIn = watch("checkIn");
  const minCheckOut = checkIn && /^\d{4}-\d{2}-\d{2}$/.test(checkIn) ? addDays(checkIn, 1) : today ? addDays(today, 1) : undefined;

  const onToken = useCallback((t: string) => {
    setToken(t);
    setValue("captcha", t);
    if (t) setCaptchaError(false);
  }, [setValue]);

  const err = (key: keyof Input) => {
    const m = errors[key]?.message;
    if (!m) return null;
    const text =
      m === "invalidDates" ? f.invalidDates : m === "invalidPast" ? f.invalidPast : key === "email" ? f.invalidEmail : f.required;
    return <p className="mt-1 text-sm text-[#b3261e]" role="alert">{text}</p>;
  };

  async function onSubmit(values: Input) {
    if (turnstileEnabled && !token) {
      setCaptchaError(true);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/demande", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (res.ok) trackEvent("quote_sent", { locale });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") return <p className="display text-[2rem] md:text-[2.5rem]" role="status">{f.success}</p>;

  const [consentBefore, consentAfter] = f.consent.split("{link}");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      <label className="sm:col-span-2"><span className={label}>{f.name}</span><input className={field} autoComplete="name" {...register("name")} />{err("name")}</label>
      <label><span className={label}>{f.email}</span><input type="email" className={field} autoComplete="email" {...register("email")} />{err("email")}</label>
      <label><span className={label}>{f.phone}</span><input type="tel" className={field} autoComplete="tel" {...register("phone")} /></label>
      <label><span className={label}>{f.checkIn}</span><input type="date" min={today || undefined} className={field} {...register("checkIn")} />{err("checkIn")}</label>
      <label><span className={label}>{f.checkOut}</span><input type="date" min={minCheckOut} className={field} {...register("checkOut")} />{err("checkOut")}</label>
      <label><span className={label}>{f.adults}</span><input type="number" min={1} max={30} className={field} {...register("adults")} />{err("adults")}</label>
      <label><span className={label}>{f.children}</span><input type="number" min={0} max={30} className={field} {...register("children")} /></label>
      <label className="flex cursor-pointer items-center gap-3 sm:col-span-2"><input type="checkbox" className="size-5 accent-amber" {...register("breakfast")} /><span>{f.breakfast}</span></label>
      <label className="sm:col-span-2"><span className={label}>{f.message}</span><textarea rows={3} className={field} {...register("message")} /></label>

      <Turnstile onToken={onToken} />
      {captchaError && <p className="text-sm text-[#b3261e] sm:col-span-2" role="alert">{f.captcha}</p>}

      <p className="text-sm text-muted sm:col-span-2">
        {consentBefore}
        <Link href={hrefFor(locale, "privacy")} className="underline underline-offset-4 hover:text-ink">{f.privacyLink}</Link>
        {consentAfter}
      </p>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary">{state === "sending" ? f.sending : f.send}</button>
        <a href={whatsappUrl(d.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{d.hero.whatsapp}</a>
      </div>
      {state === "error" && <p className="text-[#b3261e] sm:col-span-2" role="alert">{f.error}</p>}
    </form>
  );
}
