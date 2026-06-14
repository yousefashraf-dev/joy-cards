import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 32,
          background: "linear-gradient(135deg, #1A237E, #D50000)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: "#ECEFF1",
            letterSpacing: "-2",
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size },
  );
}
