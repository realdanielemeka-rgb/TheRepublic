# Wix preservation snapshot

This directory preserves the public Wix pages as they were fetched from
`https://www.therepublic.agency/` on 26 September 2026. The compressed
`public-html.tar.gz` contains the original HTML for all 22 sitemap URLs.

Structured, editable copies of the page text, SEO metadata, internal links,
image references and asset manifest are in `content/wix-export/`. The
`supabase/schema.sql` file defines the preservation tables used by the
separate Republic Supabase project. Published image derivatives are hosted
in its `site-assets` bucket; their permanent URLs are in `images.json`.

The HTML archive is evidence and a recovery source. It is not intended to
run as a standalone site because Wix generated it with Wix runtime scripts.
The existing Next.js redesign remains separate from the preserved source
material until its content and media have been reviewed for release.
