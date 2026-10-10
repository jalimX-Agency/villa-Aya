// Page transition: each route rises in. template.tsx re-mounts on every navigation, so the CSS animation replays.
// Pure CSS (see .page-enter in globals.css): works without JS and is disabled under prefers-reduced-motion.
export default function Template({ children }: { children: React.ReactNode }) {
  return <main className="page-enter">{children}</main>;
}
