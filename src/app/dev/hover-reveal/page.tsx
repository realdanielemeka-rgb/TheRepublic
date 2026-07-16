import HoverReveal, { HoverRevealText } from "@/components/HoverReveal";

export const metadata = { title: "Dev — HoverReveal QA" };

const MANIFESTO =
  "Most marketing makes viewers. The Republic makes citizens. We don't ask audiences to watch — we ask them to provoke a reaction, to argue back, to remix the work as their own. Participation is the format, not an afterthought bolted onto a media plan.";

const TERMS = {
  citizens: { category: "culture" as const, label: "Crowd of citizens, Lagos street activation" },
  provoke: { category: "launch" as const, label: "Launch-moment burst visual" },
  Participation: { category: "civic-journey" as const, label: "Participation route/journey diagram" },
};

/**
 * Visual/interaction QA harness for <HoverReveal>/<HoverRevealText>
 * (§4.6.3). Top block exercises the orchestrator against a full paragraph;
 * bottom block exercises the atomic <HoverReveal> standalone (its own
 * independent reduced-motion fallback, not delegated to by the
 * orchestrator). Toggle prefers-reduced-motion to compare both fallbacks.
 */
export default function DevHoverRevealPage() {
  return (
    <div className="flex flex-col gap-16 pb-24">
      <header>
        <h1 className="display-type text-4xl">HOVERREVEAL QA</h1>
        <p className="measure mt-4 text-smoke">
          Hover (or tab to, or tap on touch) the underlined words below. Each should fade+scale in a small
          Republic-Blue-bordered placeholder image near the word, anchored above or below depending on scroll
          position.
        </p>
      </header>

      <section>
        <h2 className="display-type text-2xl">HoverRevealText — orchestrator</h2>
        <HoverRevealText text={MANIFESTO} terms={TERMS} className="mt-6" paragraphClassName="measure text-2xl leading-relaxed" />
      </section>

      <section className="pt-64">
        <h2 className="display-type text-2xl">Standalone &lt;HoverReveal&gt; — anchor=&quot;auto&quot;</h2>
        <p className="measure mt-6 text-2xl leading-relaxed">
          Scrolled down so there is plenty of room above: this{" "}
          <HoverReveal word="citizens" image={TERMS.citizens} /> should open ABOVE the word.
        </p>
      </section>

      <section>
        <h2 className="display-type text-2xl">Standalone &lt;HoverReveal&gt; — anchor=&quot;auto&quot;, scroll this near the top</h2>
        <p className="measure mt-6 text-2xl leading-relaxed" data-testid="near-top-trigger">
          Scroll so this paragraph sits near the very top of the viewport, then hover: this{" "}
          <HoverReveal word="provoke" image={TERMS.provoke} /> should flip to open BELOW instead, since there is
          no longer enough room above it.
        </p>
      </section>

      <section className="h-screen" aria-hidden="true" />
    </div>
  );
}
