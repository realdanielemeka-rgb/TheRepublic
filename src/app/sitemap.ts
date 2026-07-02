import type { MetadataRoute } from "next";
import { site } from "../../content/site";
import { getLiveCases } from "../../content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/studio",
    "/services",
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

  return [...staticRoutes, ...caseRoutes];
}
