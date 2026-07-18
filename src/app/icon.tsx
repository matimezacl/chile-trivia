import { ImageResponse } from "next/og";

// Auto-generated favicon (browser tabs) and PWA app icon. Rendered edge-side
// via ImageResponse — no static asset needed.
export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#dc2626",
          fontSize: 400,
          fontWeight: 900,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.05em",
        }}
      >
        C
      </div>
    ),
    size
  );
}
