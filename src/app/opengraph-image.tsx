import { ImageResponse } from "next/og";
import { site } from "../../content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1F1FFF",
          color: "#FFFFFF",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.85 }}>
          [ THE REPUBLIC ]
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: -2,
            marginTop: 24,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          WE MAKE CITIZENS
        </div>
      </div>
    ),
    { ...size }
  );
}
