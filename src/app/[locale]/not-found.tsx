import Link from "next/link";

// Shown for any unknown URL. The locale is not available here, so both languages are shown.
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1500px] flex-col justify-center gap-6 px-5 pb-16 pt-32 md:px-10">
      <p className="label text-muted">404</p>
      <h1 className="display text-[clamp(3rem,10vw,9rem)]">Page introuvable</h1>
      <p className="max-w-md text-lg text-muted">Cette page n&apos;existe pas ou a été déplacée. / This page doesn&apos;t exist or has moved.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/fr" className="btn btn-primary">Retour à l&apos;accueil</Link>
        <Link href="/en" className="btn btn-ghost">Back to home</Link>
      </div>
    </section>
  );
}
