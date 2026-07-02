# DECISIONS

Judgement calls made while building this site, where the spec was silent
or needed interpretation, plus the outstanding TODO punch-list from §2.

## Judgement calls

- **Zero live cases, empty-state handling.** All eight seed case studies
  ship with `status: 'pending-approval'`, per the corrected instructions in
  §7. `content/work/index.ts` exposes `getLiveCases`/`getFeaturedCases`/
  `getLiveCaseBySlug`/`getLiveCasesByService` as the *only* sanctioned way
  to read cases on public routes — nothing imports the raw case array
  directly. Home's "Work that recruits" section and `/work` both render a
  bracket-framed "CASES IN REVIEW" empty state rather than showing zero
  content or faking a `live` status. `/work/[slug]` has no static params
  today (all eight are pending), so no case URLs resolve until at least
  one case is approved — that's intentional per the "pending never renders
  publicly" rule, not a bug.
- **Leadership bios.** Ola Olowu and Daniel Emeka's ~100-word bios in
  `content/team.ts` were written from the brief's known facts (heritage
  work, co-founding narrative, MD's platform/engineering angle) to match
  the "boardroom-grade" tone. Flagged for Daniel's review before deploy —
  no invented metrics or client claims were used, only directional
  professional framing.
- **Wider team roster.** No real team roster was supplied, so six
  placeholder names/roles were seeded in `content/team.ts` (clearly a
  TODO) so the team grid renders as designed. Swap or delete freely — the
  page reads from this file only.
- **Social links.** `content/site.ts` ships `socials: []` — no placeholder
  URLs, per the "hide any icon without a confirmed URL" rule. Footer
  renders nothing in that slot until real handles land.
- **Case media/team photography/client logos.** All rendered via the
  `<Placeholder>` (blue/ink field + mono label) and `<Avatar>`
  (initial-monogram on Republic Blue) components rather than any stock or
  generated imagery, per §4.4 and the forbidden-list (no AI portraits,
  no stock icons).
- **Reaction Standard laws.** Two seeded as `status: 'live'` (Provoke,
  don't observe / Participation is the format), four slotted as
  `status: 'pending'` and rendered as locked `[ LAW PENDING ]` cards on
  both Home and Studio, per §2/§6.3.
- **Kigali footprint.** `flags.showKigali` is `false`; the Kigali block in
  `content/site.ts` exists but is only rendered on `/studio` when the flag
  flips true.
- **AI-native case link.** `aiNativeCallout.caseSlug` is `null` — the
  callout copy renders on `/services` but the "see the case" link stays
  hidden until a real case clears approval, per the status-gate
  instruction in §6.4.
- **Contact form → email.** `src/app/api/contact/route.ts` uses Resend
  when `RESEND_API_KEY` is set; otherwise it returns a `fallback: true`
  payload with a prefilled `mailto:` link, which `ContactForm.tsx`
  redirects to client-side. No environment in this build has the key set,
  so the fallback path is what ships today — confirmed working.
- **Footer copyright string.** Rendered as the literal
  "© 2026 The Republic. Lagos." per §9, rather than a dynamically computed
  year, since the spec gives an exact string.
- **Preloader/session gate.** Uses `sessionStorage` to show the bracket
  wipe once per browser session, skipped entirely under
  `prefers-reduced-motion`.
- **Favicon/OG images.** No default Next.js favicon ships — `icon.tsx` and
  `opengraph-image.tsx` both generate a Republic Blue, mono-type image via
  `next/og`, consistent with §9's "no default favicons" rule.
- **Legal.** Only `/legal/privacy` was specced (§5 lists it as a stub);
  the old build's `/legal/terms-conditions`, `/legal/refund-policy` and
  `/legal/accessibility-statement` routes were removed rather than carried
  forward, since they weren't in the new site map.

## TODO punch-list (from §2, carried into content files as inline TODOs)

- [ ] Confirm Ola Olowu's and Daniel Emeka's final titles before deploy.
- [ ] Supply real, confirmed social handles in `content/site.ts` — until
      then the site correctly ships with no social icons.
- [ ] Supply numeric case results per project once client sign-off lands;
      `results: []` on all eight seeds renders the NDA fallback correctly.
- [ ] Confirm the Kigali office publicly before flipping
      `flags.showKigali`.
- [ ] Pull the canonical six Reaction Standard laws from the master doc
      (currently 2 live, 4 pending slots).
- [ ] Confirm display rights per client logo before deploy; swap the
      current text-based roster in `content/clients.ts` for real SVG
      logos once cleared.
- [ ] Confirm the eight seed case studies (brief/idea copy, service tags,
      years) with Daniel — every case file is marked
      `// TODO: verify with Daniel`.
- [ ] Confirm final wider-team roster and commission the team photography
      session (B/W, consistent crop) to replace `<Avatar>` monogram
      placeholders.
- [ ] Supply wordmark + speech-bubble "R" mark as SVG, hero film/stills,
      and per-case media once available — all currently render as
      `<Placeholder>` designed slots.
