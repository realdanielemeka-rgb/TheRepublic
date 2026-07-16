import type { MetadataRoute } from "next";
import { site } from "../../content/site";
import { getLiveCases } from "../../content/work";
import { getJournalEntries } from "../../content/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/studio",
    "/services",
    "/journal",
    "/contact",
    "/legal/privacy",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const caseRoutes = getLiveCases().map((c) => ({
    url: `${site.url}/work/${c.slug}`,
    lastModified: new Date(),
  }));

  const journalRoutes = getJournalEntries().map((e) => ({
    url: `${site.url}/journal/${e.slug}`,
    lastModified: new Date(e.date),
  }));

  return [...staticRoutes, ...caseRoutes, ...journalRoutes];
}
