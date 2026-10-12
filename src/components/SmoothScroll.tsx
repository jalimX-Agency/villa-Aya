"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Lenis smooth scroll, skipped entirely when the user prefers reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    // A refresh must start at the top, not where the browser remembers. Anchor links (#contact) are left alone.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
