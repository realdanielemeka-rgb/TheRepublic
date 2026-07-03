"use client";

import { useEffect, useState } from "react";

/**
 * §11 step 7 — Footer's "LAGOS · [HH:MM]" live local time. ALWAYS
 * Africa/Lagos, regardless of the visitor's own timezone, via
 * `Intl.DateTimeFormat` with an explicit `timeZone`.
 *
 * Hydration-safety pattern: this repo's established fix for "a value that
 * differs between server-render and client-render" is `useSyncExternal
 * Store` with a fixed `getServerSnapshot` (see @/lib/reducedMotion,
 * @/lib/appearance, @/lib/useGridCols, @/lib/useMediaQuery) — but that
 * pattern is for subscribing to state that *already exists* independent of
 * render (a MediaQueryList, an attribute on <html>). A clock has no
 * external store to subscribe to; the value itself is only ever known
 * client-side and changes every minute on its own schedule. The
 * appropriate analogue here — also already established in this codebase,
 * see Reveal.tsx's doc comment on why motion/react's synchronous-first-
 * render useReducedMotion caused a real hydration mismatch — is to render
 * a deterministic static placeholder on the server/first paint (formatted
 * plainly, not "loading…", so no-JS visitors still see a real if
 * slightly-stale Lagos time) and only start the live-updating clock in a
 * `useEffect`, after mount. This guarantees the server HTML and the
 * client's first hydration pass render byte-identical text — the ticking
 * only begins after React has already reconciled once.
 *
 * The placeholder is a fixed, non-time-dependent string ("--:--") rather
 * than a server-computed timestamp: this app is statically rendered at
 * build time (no per-request dynamic APIs elsewhere in the tree), so a
 * "server-computed" value would really be a *build-time* value baked into
 * the static HTML — stale by however long it's been since the last
 * deploy, and, worse, a genuine hydration mismatch the moment a client
 * hydrates in a different minute than the build ran in (the module-level
 * `new Date()` this component's first version used would re-evaluate at a
 * *different* wall-clock moment in the browser bundle than in the server
 * bundle). A fixed placeholder sidesteps both problems and is corrected to
 * the real live value within one effect tick after mount — see
 * DECISIONS.md's v3 Phase C section.
 */
function formatLagosTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function LagosClock() {
  const [time, setTime] = useState<string>("--:--");

  useEffect(() => {
    const update = () => setTime(formatLagosTime(new Date()));
    // Deferred rather than called synchronously in the effect body — same
    // `setTimeout(..., 0)` pattern Preloader.tsx uses for its own post-
    // mount session-gate write (see DECISIONS.md), and what satisfies
    // eslint-plugin-react-hooks' `set-state-in-effect` rule, which flags a
    // direct synchronous setState call in an effect body specifically.
    const timeout = setTimeout(update, 0);
    const id = setInterval(update, 60_000);
    return () => {
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, []);

  return (
    <span className="mono-label" suppressHydrationWarning>
      LAGOS · {time}
    </span>
  );
}
