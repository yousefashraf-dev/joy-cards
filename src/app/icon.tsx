import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #C0C0C0, #7A7A7A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: "-0.5",
          }}
        >
          Gt
        </span>
      </div>
    ),
    { ...size },
  );
}
