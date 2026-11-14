import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/config/site";

export const alt = `${site.name} · Product & UX designer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw colours are fine here: ImageResponse renders outside the CSS token layer.
export default async function OpengraphImage() {
  const avatar = await readFile(join(process.cwd(), "public/media/avatar.svg"));
  const avatarSrc = `data:image/svg+xml;base64,${avatar.toString("base64")}`;
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
      {/* satori renders plain <img>, not next/image */}
      <img src={avatarSrc} alt="" width={160} height={158} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 84, lineHeight: 1.05 }}>{site.name}</div>
        <div style={{ fontSize: 36, color: "#ff5c88" }}>Product & UX designer</div>
      </div>
    </div>,
    size,
  );
}
