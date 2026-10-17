"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useInViewport } from "@/hooks/use-in-viewport";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useUiStore } from "@/stores/ui-store";

type ShowreelTileProps = {
  label: string;
  comingSoon: string;
  poster?: string | undefined;
  previewSrc?: string | undefined;
  /** Server-rendered placeholder art shown while there is no reel. */
  fallback: React.ReactNode;
};

/**
 * Dark showreel tile. The muted preview loop only gets a `src` once the tile is within 200px of
 * the viewport and plays only while visible; reduced motion keeps the poster. With no reel yet
 * (OPEN_QUESTIONS Q7) it shows generated art and a "coming soon" note. The stable id is the
 * shared-element anchor for the Phase 07 video modal.
 */
function ShowreelTile({ label, comingSoon, poster, previewSrc, fallback }: ShowreelTileProps) {
  const openVideo = useUiStore((state) => state.openVideo);
  const tileRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const { inViewport, hasBeenInViewport } = useInViewport(tileRef, "200px");
  const playable = Boolean(previewSrc) && !reducedMotion;

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !playable) return;
    if (inViewport) void video.play().catch(() => undefined);
    else video.pause();
  }, [inViewport, playable, hasBeenInViewport]);

  return (
    <div
      ref={tileRef}
      id="showreel-tile"
      data-work-panel
      className="relative isolate min-h-64 overflow-hidden rounded-panel bg-surface-inverse text-on-inverse"
    >
      {previewSrc ? (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          src={hasBeenInViewport && playable ? previewSrc : undefined}
          className="absolute inset-0 -z-10 size-full object-cover opacity-70"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10 opacity-40 [&_svg]:size-full">
          {fallback}
        </div>
      )}
      <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-3 p-6">
        <Button
          variant="outline"
          size="md"
          className="border-on-inverse/70 bg-transparent text-on-inverse uppercase hover:bg-on-inverse/10"
          onClick={() => openVideo("showreel")}
        >
          {label}
        </Button>
        {!previewSrc && <p className="text-label text-on-inverse/70">{comingSoon}</p>}
      </div>
    </div>
  );
}

export { ShowreelTile };
