import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#111111",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(79,140,255,0.55), transparent 60%)",
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
