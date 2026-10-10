"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Dictionary } from "@/content";
import { images } from "@/content/images";
import { whatsappUrl } from "@/lib/site";
import { hrefFor } from "@/lib/routes";
import type { Locale } from "@/lib/i18n/config";

const N = 5;
// How far each slat lifts away (in % of its own height) while the hero scrolls out: uneven on purpose.
const lift = [0, -14, -6, -20, -9];

// Signature effect #1: the photo is built from five vertical slats (the logo's lines) that rise in sequence,
// then lift away at different speeds as you scroll.
export function Hero({ d, locale }: { d: Dictionary; locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const photo = images.piscine[1];

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-paper">
      <div className="absolute inset-0 flex" aria-hidden={false}>
        {Array.from({ length: N }).map((_, i) => (
          <Slat key={i} i={i} progress={scrollYProgress} reduce={!!reduce}>
            <div className="absolute inset-y-0" style={{ width: `${N * 100}%`, left: `-${i * 100}%` }}>
              <Image src={photo.src} alt={i === 0 ? d.alts.piscine : ""} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Slat>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/25" />

      <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0 flex flex-col gap-5 px-5 pb-10 text-paper md:px-10 md:pb-14">
        <p className="label">{d.hero.eyebrow}</p>
        <h1 className="display max-w-5xl text-[clamp(2.6rem,8.37vw,8.68rem)]">{d.hero.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={hrefFor(locale, "contact")} className="btn btn-primary">{d.hero.cta}</Link>
          <a href={whatsappUrl(d.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn border border-paper text-paper hover:bg-paper hover:text-ink">{d.hero.whatsapp}</a>
          <span className="label ms-2 hidden text-paper/70 md:inline">{d.hero.subtitle}</span>
        </div>
      </motion.div>
    </section>
  );
}

function Slat({ i, progress, reduce, children }: { i: number; progress: MotionValue<number>; reduce: boolean; children: React.ReactNode }) {
  const y = useTransform(progress, [0, 1], ["0%", `${lift[i]}%`]);
  return (
    <motion.div style={reduce ? undefined : { y }} className="relative h-full flex-1">
      <div className="slat relative h-full overflow-hidden" style={{ ["--i" as string]: i }}>
        {children}
      </div>
    </motion.div>
  );
}
