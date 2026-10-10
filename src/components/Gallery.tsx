"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary, FilterKey } from "@/content";
import { images, type Img } from "@/content/images";

type Group = keyof typeof images;

const filterGroups: Record<Exclude<FilterKey, "all">, Group[]> = {
  outdoor: ["piscine", "exterieur", "terrasse"],
  chalet: ["salon-chalet", "chambre-chalet"],
  salons: ["salon-rdc", "salon-marocain", "cuisine"],
  rooms: ["chambre-rose", "salle-de-bain"],
  wellness: ["hammam", "salle-de-sport", "priere"],
  table: ["petit-dejeuner"],
};

const order: FilterKey[] = ["all", "outdoor", "chalet", "salons", "rooms", "wellness", "table"];

type Item = { img: Img; group: Group };

export function Gallery({ d }: { d: Dictionary }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const items: Item[] = useMemo(() => {
    const groups = filter === "all" ? (Object.values(filterGroups).flat() as Group[]) : filterGroups[filter];
    return groups.flatMap((g) => images[g].map((img) => ({ img, group: g })));
  }, [filter]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const current = open !== null ? items[open] : null;

  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-24 md:px-10 md:pb-32">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={d.gallery.title}>
        {order.map((k) => (
          <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
            className={`label cursor-pointer border border-ink px-4 py-2 transition-colors ${filter === k ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper"}`}>
            {d.gallery.filters[k]}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-2 gap-3 md:columns-3 md:gap-4">
        {items.map((it, i) => (
          <button key={it.img.src} onClick={() => setOpen(i)} className="group mb-3 block w-full cursor-pointer overflow-hidden md:mb-4" aria-label={d.alts[it.group]}>
            <Image src={it.img.thumb} alt={d.alts[it.group]} width={640} height={Math.round((640 * it.img.height) / it.img.width)} sizes="(min-width:768px) 33vw, 50vw" className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>

      <dialog ref={dialog} onClose={() => setOpen(null)} onClick={(e) => e.target === dialog.current && setOpen(null)}
        className="m-auto h-[92vh] w-[96vw] max-w-none bg-transparent p-0 backdrop:bg-ink/90">
        {current && (
          <div className="relative h-full w-full">
            <Image src={current.img.src} alt={d.alts[current.group]} fill sizes="96vw" className="object-contain" />
            <button onClick={() => setOpen(null)} className="btn btn-primary absolute right-3 top-3 !min-h-10">{d.gallery.close}</button>
          </div>
        )}
      </dialog>
    </section>
  );
}
