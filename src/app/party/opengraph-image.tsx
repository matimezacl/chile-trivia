import { ImageResponse } from "next/og";

// OG image for /party — used when the party landing page is shared. Party pages
// under /party/host/[code] and /party/play/[code] inherit this too.
export const runtime = "edge";
export const alt = "Cachaí Party — juega trivia en vivo con tus amigos";
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
          background: "#dc2626",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          🎉 Modo fiesta
        </div>

        <div
          style={{
            marginTop: "24px",
            fontSize: "180px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Cachaí Party
        </div>

        <div
          style={{
            marginTop: "36px",
            fontSize: "44px",
            textAlign: "center",
            opacity: 0.95,
          }}
        >
          Juega en vivo con amigos · cada uno en su teléfono
        </div>

        <div
          style={{
            marginTop: "48px",
            display: "flex",
            gap: "24px",
            fontSize: "30px",
            opacity: 0.85,
          }}
        >
          <span>🇨🇱 Trivia chilena</span>
          <span>·</span>
          <span>QR + código</span>
          <span>·</span>
          <span>Bonus velocidad</span>
        </div>
      </div>
    ),
    size
  );
}
