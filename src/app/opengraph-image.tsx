import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "BeyondLab";
const TAGLINE = "ห้องทดลองของคนที่อยากก้าวข้ามขีดจำกัด";
const CREDIT = "ติวโดยพี่โม & พี่มิก · วิศวะคอม (CEDT) จุฬาฯ";

async function loadIbmPlexSansThaiSemiBold() {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@700&text=${encodeURIComponent(
      TITLE + TAGLINE + CREDIT
    )}`
  );
  const css = await cssRes.text();
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) return null;
  const fontRes = await fetch(fontUrl);
  return fontRes.arrayBuffer();
}

export default async function OpengraphImage() {
  const fontData = await loadIbmPlexSansThaiSemiBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "IBM Plex Sans Thai",
          background: "#303030",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(234,114,31,0.32), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            background: "#ffffff",
            color: "#303030",
            fontSize: 44,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          B
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 88, fontWeight: 700 }}>{TITLE}</div>
        <div style={{ display: "flex", color: "#f7c56d", fontSize: 40, fontWeight: 700, marginTop: 20 }}>
          {TAGLINE}
        </div>
        <div style={{ display: "flex", color: "#9CA3AF", fontSize: 28, fontWeight: 700, marginTop: 24 }}>
          {CREDIT}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData ? [{ name: "IBM Plex Sans Thai", data: fontData, style: "normal", weight: 700 }] : undefined,
    }
  );
}
