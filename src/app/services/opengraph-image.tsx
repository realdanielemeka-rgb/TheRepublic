import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Republic — What We Do";

export default function Image() {
  return renderOgImage("THE REPUBLIC", "WHAT WE DO");
}
