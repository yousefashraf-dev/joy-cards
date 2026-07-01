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
          background: "linear-gradient(135deg, #1A237E, #D50000)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#ECEFF1",
            letterSpacing: "-0.5",
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size },
  );
}
