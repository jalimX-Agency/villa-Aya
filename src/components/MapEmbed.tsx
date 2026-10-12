"use client";

import { useState } from "react";
import type { Dictionary } from "@/content";
import { mapsDirectionsUrl, site } from "@/lib/site";

// Google Maps loads only after a click: faster page, and no third-party request before the visitor asks for it.
export function MapEmbed({ d }: { d: Dictionary }) {
  const [on, setOn] = useState(false);
  const src = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=14&output=embed&hl=fr`;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden border border-ink bg-sand md:aspect-[21/9]">
      {on ? (
        <iframe src={src} title={d.map.title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="display text-[1.5rem] md:text-[2rem]">{d.map.title}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setOn(true)} className="btn btn-primary">{d.map.show}</button>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{d.contact.directions}</a>
          </div>
          <p className="max-w-xs text-sm text-muted">{d.map.hint}</p>
        </div>
      )}
    </div>
  );
}
