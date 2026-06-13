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
          background: "linear-gradient(135deg, #C0C0C0, #7A7A7A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: "-2",
          }}
        >
          Gt
        </span>
      </div>
    ),
    { ...size },
  );
}
