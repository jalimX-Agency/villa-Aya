import Image from "next/image";
import type { Img } from "@/content/images";

// Shared page opener: oversized display title, short intro off to the side, one wide photo.
export function PageHeader({ eyebrow, title, intro, img, alt }: { eyebrow: string; title: string; intro: string; img?: Img; alt?: string }) {
  return (
    <header className="mx-auto max-w-[1500px] px-5 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36">
      <p className="label text-muted">{eyebrow}</p>
      <div className="mt-4 grid items-end gap-8 md:grid-cols-[1.6fr_1fr] md:gap-16">
        <h1 className="display text-[clamp(2.79rem,9.3vw,9.3rem)]">{title}</h1>
        <p className="max-w-sm text-lg text-muted md:pb-6">{intro}</p>
      </div>
      {img && (
        <div className="relative mt-10 aspect-[16/8] w-full overflow-hidden md:mt-16">
          <Image src={img.src} alt={alt ?? ""} fill priority sizes="(min-width:1500px) 1420px, 100vw" className="object-cover" />
        </div>
      )}
    </header>
  );
}
