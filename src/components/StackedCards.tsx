"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Img } from "@/content/images";

export type StackCard = { title: string; text: string; img: Img; alt: string };

// Signature effect #2: sticky cards that scale back as the next one slides over them.
export function StackedCards({ cards }: { cards: StackCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative px-3 pb-16 md:px-10">
      {cards.map((c, i) => (
        <Card key={c.title} i={i} total={cards.length} progress={scrollYProgress} reduce={!!reduce}>
          <article className="grid h-full border border-ink bg-sand md:grid-cols-[1.35fr_1fr]">
            <div className={`relative min-h-[40svh] overflow-hidden md:min-h-0 ${i === 0 ? "md:arch" : ""}`}>
              <Image src={c.img.src} alt={c.alt} fill sizes="(min-width:768px) 60vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-between gap-6 p-6 md:p-10">
              <span className="label text-muted">{String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span>
              <div>
                <h3 className="display text-[2rem] md:text-[3rem]">{c.title}</h3>
                <p className="mt-4 max-w-sm text-muted">{c.text}</p>
              </div>
            </div>
          </article>
        </Card>
      ))}
    </div>
  );
}

function Card({ children, i, total, progress, reduce }: { children: React.ReactNode; i: number; total: number; progress: MotionValue<number>; reduce: boolean }) {
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - 1 - i) * 0.035]);
  return (
    <div className="sticky top-[9vh] mb-[7vh] h-[80svh]">
      <motion.div style={reduce ? undefined : { scale }} className="h-full origin-top">{children}</motion.div>
    </div>
  );
}
