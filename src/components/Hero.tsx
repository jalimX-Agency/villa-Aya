"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Dictionary } from "@/content";
import { images } from "@/content/images";
import imageLoader from "@/lib/image-loader";
import { whatsappUrl } from "@/lib/site";
import { hrefFor } from "@/lib/routes";
import type { Locale } from "@/lib/i18n/config";

const N = 5; // slats
const lift = [0, -14, -6, -20, -9]; // how far each slat lifts away on scroll (% of its height), uneven on purpose
const INTERVAL = 6500;
const ANIM_MS = 1100 + (N - 1) * 120 + 150;

const slides = [
  { img: images.piscine[1], group: "piscine" },
  { img: images["salon-chalet"][0], group: "salon-chalet" },
  { img: images.terrasse[0], group: "terrasse" },
  { img: images.piscine[3], group: "piscine" },
] as const;

const srcSetOf = (src: string) => [640, 1080, 1600].map((w) => `${imageLoader({ src, width: w })} ${w}w`).join(", ");

type State = { under: number | null; over: number; key: number };

// Signature effect #1: the photo is built from five vertical slats (the logo's lines). Every few seconds the next
// photo rises through the slats over the previous one, and on scroll the slats lift away at different speeds.
export function Hero({ d, locale }: { d: Dictionary; locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [s, setS] = useState<State>({ under: null, over: 0, key: 0 });
  const sRef = useRef(s);
  sRef.current = s;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // First photo is the LCP image: tell the browser early, with the same srcset the <img> will use.
  preload(imageLoader({ src: slides[0].img.src, width: 1080 }), {
    as: "image",
    imageSrcSet: srcSetOf(slides[0].img.src),
    imageSizes: "100vw",
    fetchPriority: "high",
  });

  const go = useCallback((next: number) => {
    const cur = sRef.current;
    if (next === cur.over) return;
    // Fetch the next photo first so the transition never pops in half-loaded.
    const im = new window.Image();
    im.sizes = "100vw";
    im.srcset = srcSetOf(slides[next].img.src);
    im.src = imageLoader({ src: slides[next].img.src, width: 1600 });
    const run = () => {
      const k = sRef.current.key + 1;
      setS({ under: sRef.current.over, over: next, key: k });
      // once the slats have covered the photo, the previous one is no longer needed underneath
      window.setTimeout(() => setS((p) => (p.key === k ? { ...p, under: p.over } : p)), ANIM_MS);
    };
    // Never wait forever: decode() can stay pending on a slow network or a backgrounded tab.
    let done = false;
    const once = () => {
      if (done) return;
      done = true;
      run();
    };
    im.decode().then(once, once);
    window.setTimeout(once, 2500);
  }, []);

  useEffect(() => {
    if (reduce) return;
    // Re-armed after every transition (s.key). A hidden tab simply skips the tick and tries again on the next one.
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") go((sRef.current.over + 1) % slides.length);
    }, INTERVAL);
    return () => window.clearInterval(t);
  }, [s.key, reduce, go]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-paper">
      <div className="absolute inset-0 flex">
        {Array.from({ length: N }).map((_, i) => (
          <Slat key={i} i={i} progress={scrollYProgress} reduce={!!reduce}>
            {s.under !== null && <Slice slide={slides[s.under]} i={i} still />}
            <div key={s.key} className="slat absolute inset-0" style={{ ["--i" as string]: i }}>
              <Slice slide={slides[s.over]} i={i} eager={s.key === 0} alt={i === 0 ? d.alts[slides[s.over].group] : ""} />
            </div>
          </Slat>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/25" />

      <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0 flex flex-col gap-5 px-5 pb-10 text-paper md:px-10 md:pb-14">
        <p className="label">{d.hero.eyebrow}</p>
        <h1 className="display max-w-5xl text-[clamp(2.6rem,8.37vw,8.68rem)]">{d.hero.title}<span className="sr-only">. {d.seoH1}</span></h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={hrefFor(locale, "contact")} className="btn btn-primary">{d.hero.cta}</Link>
          <a href={whatsappUrl(d.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn border border-paper text-paper hover:bg-paper hover:text-ink">{d.hero.whatsapp}</a>
        </div>

        <div className="flex items-center gap-4 pt-2" role="group" aria-label="Photos">
          <span className="label tabular-nums text-paper/80">{String(s.over + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`${i + 1} / ${slides.length}`}
                aria-current={i === s.over}
                className="group flex h-6 w-10 cursor-pointer items-center"
              >
                <span className={`block h-[3px] w-full transition-colors ${i === s.over ? "bg-amber" : "bg-paper/40 group-hover:bg-paper/80"}`} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Slat({ i, progress, reduce, children }: { i: number; progress: MotionValue<number>; reduce: boolean; children: React.ReactNode }) {
  const y = useTransform(progress, [0, 1], ["0%", `${lift[i]}%`]);
  return (
    <motion.div style={reduce ? undefined : { y }} className="relative h-full flex-1 overflow-hidden">
      {children}
    </motion.div>
  );
}

// One vertical slice of a full-width photo: the image is N times the strip width, shifted left by i strips.
function Slice({ slide, i, still, eager, alt = "" }: { slide: (typeof slides)[number]; i: number; still?: boolean; eager?: boolean; alt?: string }) {
  const src = slide.img.src;
  return (
    <div className="absolute inset-y-0" style={{ width: `${N * 100}%`, left: `-${i * 100}%` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageLoader({ src, width: 1600 })}
        srcSet={srcSetOf(src)}
        sizes="100vw"
        alt={alt}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className={`h-full w-full object-cover ${still ? "scale-[1.07]" : "kenburns"}`}
      />
    </div>
  );
}
