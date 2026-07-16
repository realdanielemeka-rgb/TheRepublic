import { ImageResponse } from "next/og";

// Shared by every route's opengraph-image.tsx (§10 — "blue field, mono
// type, per-page title"). Each route file still has to export its own
// `size`/`contentType` (Next's file-convention requires those to be real
// exports of the route file itself) but can source the *values* from here,
// and call renderOgImage() to build the actual ImageResponse — keeps six-
// plus near-identical files from drifting out of visual sync with each
// other and with the root src/app/opengraph-image.tsx this mirrors.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage(eyebrow: string, title: string) {
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
          padding: "0 96px",
        }}
      >
        {/* A single interpolated string, not "[ " + {eyebrow} + " ]" —
            JSX doesn't collapse mixed text/expression children into one
            child node, and Satori (next/og's renderer) requires any <div>
            with more than one child to set an explicit display. One
            template-literal child sidesteps that rather than adding a
            flex display to a text-only line. */}
        <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.85 }}>{`[ ${eyebrow} ]`}</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: -2,
            marginTop: 24,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
