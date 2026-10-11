import type { Dictionary } from "@/content";
import { Reveal } from "./Reveal";

// Visible FAQ: the same text feeds the FAQPage JSON-LD (Google requires the content to be on the page).
export function Faq({ d }: { d: Dictionary }) {
  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-20 md:px-10 md:pb-32">
      <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-20">
        <h2 className="display text-[2rem] md:text-[3rem]">{d.faq.title}</h2>
        <Reveal>
          <dl>
            {d.faq.items.map((it) => (
              <div key={it.q} className="border-t border-ink/30 py-5">
                <dt className="font-medium">{it.q}</dt>
                <dd className="mt-2 max-w-xl text-muted">{it.a}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
