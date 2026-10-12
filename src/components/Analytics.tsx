"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics as VercelAnalytics, track } from "@vercel/analytics/react";

// Cookie-free audience measurement (Vercel Analytics) plus two business events:
//  - whatsapp_click: any link to wa.me, with the page it was clicked on
//  - quote_sent: fired by the quote form after a successful send (see trackEvent)
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (a && /^https:\/\/wa\.me\//.test(a.href)) track("whatsapp_click", { page: pathname });
      if (a && /google\.com\/maps\/dir/.test(a.href)) track("directions_click", { page: pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);
  return <VercelAnalytics />;
}

export const trackEvent = (name: string, data?: Record<string, string | number | boolean>) => {
  try {
    track(name, data);
  } catch {
    /* analytics must never break the page */
  }
};
