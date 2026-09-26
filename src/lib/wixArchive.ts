import pageData from "../../../content/wix-export/pages.json";
import imageData from "../../../content/wix-export/images.json";
import videoData from "../../../content/wix-export/videos.json";

export type ArchivedPage = (typeof pageData)[number];

export const archivedPages = pageData;
export const archivedImages = imageData;
export const archivedVideos = videoData;

const imageUrls = new Map(
  imageData.map((image) => [image.filename, image.publicUrl] as const),
);

export function archivedImageUrl(filename: string): string | undefined {
  return imageUrls.get(filename);
}

export function archivedPage(slug: string): ArchivedPage | undefined {
  return archivedPages.find((page) => page.slug === slug);
}

export function archivePath(sourcePath: string): string {
  return `/archive/${sourcePath === "/" ? "home" : sourcePath.slice(1)}`;
}
