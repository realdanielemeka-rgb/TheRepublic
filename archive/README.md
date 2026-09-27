# Wix preservation snapshot

The public Wix pages were fetched from `https://www.therepublic.agency/`
on 26 September 2026. The downloadable preservation archive contains
the original HTML for all 22 sitemap URLs.

Structured, editable copies of the page text, SEO metadata, internal links,
image references, form definitions, and asset manifests are in `content/wix-export/`. The
`supabase/schema.sql` file defines the preservation tables used by the
separate Republic Supabase project. Web-ready images and videos are hosted
in its `site-assets` bucket; their permanent URLs are in `images.json`,
`videos.json`, and `library-images.json`. The original files and hashes
are kept in separate downloadable preservation archives. The extra image
library contains 160 files that did not appear on the published pages.

The HTML archive is evidence and a recovery source. It is not intended to
run as a standalone site because Wix generated it with Wix runtime scripts.
The existing Next.js redesign remains separate from the preserved source
material until its content and media have been reviewed for release.
