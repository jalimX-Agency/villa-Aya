import type { ImageLoaderProps } from "next/image";

// Photos are pre-sized by scripts/prepare-images.mjs (640 / 1080 / 1600 px AVIF) and served as static
// files straight from the CDN. No runtime optimisation means no cold-start delay on first view.
// Bump IMAGE_VERSION whenever the images are regenerated: files are cached for a year (see next.config.ts).
const IMAGE_VERSION = "2";

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  if (!src.startsWith("/images/")) return src; // logos and icons are already small
  if (/-(640|1080)\.avif$/.test(src)) return `${src}?v=${IMAGE_VERSION}`;
  const base = src.replace(/\.avif$/, "");
  if (width <= 640) return `${base}-640.avif?v=${IMAGE_VERSION}`;
  if (width <= 1080) return `${base}-1080.avif?v=${IMAGE_VERSION}`;
  return `${base}.avif?v=${IMAGE_VERSION}`;
}
