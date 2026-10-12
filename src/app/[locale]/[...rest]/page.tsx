import { notFound } from "next/navigation";

// Any unknown URL under /fr or /en lands here and renders the branded 404 (see ../not-found.tsx),
// with the header, footer and fonts, instead of Next's bare default page.
export default function CatchAll() {
  notFound();
}
