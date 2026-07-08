import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "BeyondLab";
const TAGLINE = "เรียนเขียนโปรแกรมโอลิมปิก C++";
const CREDIT = "ติวโดยพี่โม & พี่มิก · วิศวะคอม (CEDT) จุฬาฯ";

async function loadSarabunBold() {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=Sarabun:wght@800&text=${encodeURIComponent(
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
  const fontData = await loadSarabunBold();

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
          background: "#111111",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(79,140,255,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            borderRadius: 20,
            background: "#ffffff",
            color: "#111111",
            fontSize: 44,
            fontWeight: 800,
            marginBottom: 40,
          }}
        >
          B
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 88, fontWeight: 800 }}>{TITLE}</div>
        <div style={{ display: "flex", color: "#4F8CFF", fontSize: 40, fontWeight: 800, marginTop: 20 }}>
          {TAGLINE}
        </div>
        <div style={{ display: "flex", color: "#9CA3AF", fontSize: 28, fontWeight: 800, marginTop: 24 }}>
          {CREDIT}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData ? [{ name: "Sarabun", data: fontData, style: "normal", weight: 800 }] : undefined,
    }
  );
}
