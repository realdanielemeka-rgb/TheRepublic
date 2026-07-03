import ScenePlaceholder, { CaseMedia } from "@/components/ScenePlaceholder";
import ThemeSection from "@/components/ThemeSection";
import { SCENE_CATEGORIES } from "@/lib/scene/generator";
import { chivitaStyleNSips } from "../../../../content/work/chivita-style-n-sips";
import { sanlamAllianzLiveWithConfidence } from "../../../../content/work/sanlamallianz-live-with-confidence";
import accents from "../../../../content/accents.generated.json";

export const metadata = { title: "Dev — ScenePlaceholder QA" };

/**
 * Visual QA harness for <ScenePlaceholder>/<CaseMedia> — every category,
 * several aspect ratios, the video badge, and the externally-controlled
 * `active` colour state, plus a couple of real case `media[]` arrays run
 * straight through <CaseMedia> to confirm the content ↔ component wiring.
 * Also spot-checks every generated accent theme (§4.6.6) so Phase B can
 * eyeball each case's hero tint before wiring up real hero markup. Not
 * linked from the public site; see src/app/dev/layout.tsx for the gate.
 */
export default function DevPlaceholdersPage() {
  return (
    <div className="flex flex-col gap-16 pb-24">
      <header>
        <h1 className="display-type text-4xl">SCENEPLACEHOLDER QA</h1>
        <p className="measure mt-4 text-smoke">
          Rest state is desaturated (grayscale). Hover/focus any tile, or
          look at the one tile below pinned to <code>active</code>, to
          confirm the palette-only colour reveal. Every tile must show its
          replacement caption; video tiles must also show the persistent
          &ldquo;Video pending&rdquo; badge.
        </p>
      </header>

      <section>
        <h2 className="display-type text-2xl">All categories — aspect-[4/3]</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SCENE_CATEGORIES.map((category) => (
            <div key={category}>
              <p className="mono-label mb-2 text-smoke">{category}</p>
              <ScenePlaceholder
                category={category}
                label={`${category} sample scene`}
                aspect="aspect-[4/3]"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="display-type text-2xl">Aspect ratios (kind defaults)</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mono-label mb-2 text-smoke">hero — aspect-[21/9]</p>
            <ScenePlaceholder category="insurance" label="Sanlam Allianz hero loop" aspect="aspect-[21/9]" isVideo />
          </div>
          <div>
            <p className="mono-label mb-2 text-smoke">wide — aspect-[16/9]</p>
            <ScenePlaceholder category="civic-journey" label="Zenith Homecoming wide still" aspect="aspect-[16/9]" />
          </div>
          <div>
            <p className="mono-label mb-2 text-smoke">gallery-pair — aspect-[4/5]</p>
            <ScenePlaceholder category="family" label="Cowbell Mumtales gallery still" aspect="aspect-[4/5]" />
          </div>
          <div>
            <p className="mono-label mb-2 text-smoke">ticker-chip — aspect-square</p>
            <ScenePlaceholder category="beverage" label="Chivita ticker chip" aspect="aspect-square" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="display-type text-2xl">Externally-controlled active state</h2>
        <p className="measure mt-2 text-sm text-smoke">
          This tile is rendered with <code>active</code> forced true — this
          is the same mechanism a parent interactive component drives from
          its own hover/focus/selected-index state (v3 has no GSAP/
          ScrollTrigger scroll-driven toggling), OR&rsquo;d with native
          hover/focus. It should render in full colour without being
          hovered.
        </p>
        <div className="mt-4 max-w-sm">
          <ScenePlaceholder category="launch" label="Heirs Insurance launch moment" active />
        </div>
      </section>

      <section>
        <h2 className="display-type text-2xl">CaseMedia — real content wiring</h2>
        <p className="measure mt-2 text-sm text-smoke">
          Every entry below comes straight from a real case&rsquo;s{" "}
          <code>media: Media[]</code> array via <code>&lt;CaseMedia
          media=&#123;item&#125; /&gt;</code> — no manual category/aspect
          wiring.
        </p>
        <h3 className="mono-label mt-6 text-smoke">{chivitaStyleNSips.client} — {chivitaStyleNSips.title}</h3>
        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {chivitaStyleNSips.media.map((item, i) => (
            <CaseMedia key={i} media={item} seedPrefix={chivitaStyleNSips.slug} />
          ))}
        </div>
        <h3 className="mono-label mt-10 text-smoke">
          {sanlamAllianzLiveWithConfidence.client} — {sanlamAllianzLiveWithConfidence.title}
        </h3>
        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sanlamAllianzLiveWithConfidence.media.map((item, i) => (
            <CaseMedia key={i} media={item} seedPrefix={sanlamAllianzLiveWithConfidence.slug} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="display-type text-2xl">Accent theme swatches (§4.6.6)</h2>
        <p className="measure mt-2 text-sm text-smoke">
          Every case&rsquo;s generated hex from{" "}
          <code>content/accents.generated.json</code>, rendered via{" "}
          <code>&lt;ThemeSection theme=&quot;accent&quot; accentColor=&#123;hex&#125;&gt;</code>{" "}
          — 18% blended into the ink base by CSS <code>color-mix()</code>.
          Paper-coloured text must stay legible on every swatch;{" "}
          <code>scripts/extract-accent.mjs</code> clamps for that before
          any of these hexes are written to disk.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(accents).map(([slug, hex]) => (
            <ThemeSection
              key={slug}
              theme="accent"
              accentColor={hex}
              className="rounded-[var(--radius-card)] px-6 py-10"
            >
              <p className="mono-label opacity-80">{slug}</p>
              <p className="display-type mt-2 text-xl">{hex}</p>
            </ThemeSection>
          ))}
        </div>
      </section>
    </div>
  );
}
