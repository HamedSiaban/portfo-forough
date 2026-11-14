import { ImageResponse } from "next/og";

import { site } from "@/config/site";

export const alt = `${site.name} · Product & UX designer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw colours are fine here: ImageResponse renders outside the CSS token layer.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b0b0d",
        color: "#f5f5f4",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 14,
          background: "#f5f5f4",
          color: "#0b0b0d",
          fontSize: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        F
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 84, lineHeight: 1.05 }}>{site.name}</div>
        <div style={{ fontSize: 36, color: "#ff5c88" }}>Product & UX designer</div>
      </div>
    </div>,
    size,
  );
}
