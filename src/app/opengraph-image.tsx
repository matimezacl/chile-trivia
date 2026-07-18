import { ImageResponse } from "next/og";

// Renders the OG preview image every WhatsApp/iMessage/Twitter/etc. shows
// when someone shares a link to Cachaí. Kept text-only so it renders reliably
// without external fonts or assets.
export const runtime = "edge";
export const alt = "Cachaí — el trivia diario de Chile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
          background: "linear-gradient(135deg, #fff 0%, #fef2f2 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "36px",
            fontWeight: 700,
            color: "#dc2626",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <span>🇨🇱</span>
          <span>Trivia diario · Chile</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: "24px",
            fontSize: "220px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#111",
            lineHeight: 1,
          }}
        >
          Cacha<span style={{ color: "#dc2626" }}>í</span>
        </div>

        <div
          style={{
            marginTop: "32px",
            fontSize: "44px",
            fontWeight: 500,
            color: "#525252",
            textAlign: "center",
          }}
        >
          ¿Cuánto cachái de Chile?
        </div>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "40px",
            fontSize: "28px",
            color: "#737373",
          }}
        >
          <span>5 preguntas al día</span>
          <span>·</span>
          <span>Modo fiesta con amigos</span>
        </div>
      </div>
    ),
    size
  );
}
