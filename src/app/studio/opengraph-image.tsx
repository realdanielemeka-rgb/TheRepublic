import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Republic — Born in Lagos";

export default function Image() {
  return renderOgImage("THE REPUBLIC", "BORN IN LAGOS.");
}
