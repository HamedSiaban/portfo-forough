"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";

import { useSmoothScroll } from "@/components/motion/smooth-scroll";
import { work } from "@/content/work";
import { useUiStore } from "@/stores/ui-store";

import { VideoStage, type VideoStageHandle } from "./video-stage";

/**
 * Showreel player (DESIGN_SPEC §6). Base UI Dialog supplies the focus trap, Esc, scroll lock
 * and focus return; the visuals are `VideoStage`, which owns the shared-element animation.
 * Every dismissal (Esc, ×, outside) is routed through the stage so it can animate back to the
 * tile first; `videoOpen` only flips to false once that has finished. Lenis is paused while open.
 */
function VideoModal() {
  const open = useUiStore((state) => state.videoOpen);
  const origin = useUiStore((state) => state.videoOrigin);
  const closeVideo = useUiStore((state) => state.closeVideo);
  const { setPaused } = useSmoothScroll();
  const stageRef = React.useRef<VideoStageHandle>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setPaused(true);
    return () => setPaused(false);
  }, [open, setPaused]);

  const { player } = work.showreel;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) stageRef.current?.close();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Popup
          ref={popupRef}
          // Focus the popup, not a control: Space on a focused Close button would dismiss the player.
          initialFocus={popupRef}
          tabIndex={-1}
          onKeyDown={(event) => stageRef.current?.onKeyDown(event)}
          className="fixed inset-0 z-50 overflow-hidden outline-none"
        >
          <DialogPrimitive.Title className="sr-only">{player.title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {player.description}
          </DialogPrimitive.Description>
          <VideoStage
            ref={stageRef}
            origin={origin}
            showreel={work.showreel}
            onClosed={closeVideo}
          />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { VideoModal };
