"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useGSAP } from "@gsap/react";
import { XIcon } from "@phosphor-icons/react";
import * as React from "react";

import { PatternArt } from "@/components/effects/pattern-art";
import type { WorkContent } from "@/content/work";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { gsap } from "@/lib/gsap";
import { hideOrigin } from "@/lib/video-player";

import { VideoControls } from "./video-controls";

type VideoStageHandle = {
  close: () => void;
  /** Player shortcuts; the modal wires this to the dialog popup so they work before any control is focused. */
  onKeyDown: (event: React.KeyboardEvent) => void;
};

type VideoStageProps = {
  ref: React.Ref<VideoStageHandle>;
  origin: HTMLElement | null;
  showreel: WorkContent["showreel"];
  /** Called once the close animation has finished; the modal unmounts the stage. */
  onClosed: () => void;
};

const IDLE_MS = 2800;

/**
 * Shared-element player (GSAP). A dedicated fixed frame is placed on the origin tile's measured
 * rect and tweened to the viewport (x/y/width/height + border-radius); close re-measures the
 * tile and tweens back, so it works at any scroll position and after resizes. Reduced motion
 * swaps the flight for a crossfade. The video element only exists (and so only downloads) while
 * this stage is mounted, i.e. after the user opened the player.
 */
function VideoStage({ ref, origin, showreel, onClosed }: VideoStageProps) {
  const { videoSrc, captions, comingSoon, player: labels } = showreel;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const controlsRef = React.useRef<HTMLDivElement>(null);
  const openTl = React.useRef<gsap.core.Timeline | null>(null);
  const closeTl = React.useRef<gsap.core.Animation | null>(null);
  const closing = React.useRef(false);
  const reducedMotion = useReducedMotion();
  const player = useVideoPlayer(Boolean(captions));
  const { videoRef } = player;
  const [idle, setIdle] = React.useState(false);
  const idleTimer = React.useRef<number | undefined>(undefined);
  const hasVideo = Boolean(videoSrc);

  const wake = React.useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  }, []);

  // Start the first idle countdown; `wake` (pointer events) restarts it afterwards.
  React.useEffect(() => {
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
    return () => window.clearTimeout(idleTimer.current);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const frame = frameRef.current;
      const backdrop = backdropRef.current;
      const controls = controlsRef.current;
      if (!root || !frame || !backdrop || !controls) return;

      let restoreOrigin: (() => void) | undefined;
      void videoRef.current?.play().catch(() => undefined);

      if (reducedMotion || !origin) {
        gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      } else {
        const from = origin.getBoundingClientRect();
        const radius = getComputedStyle(origin).borderTopLeftRadius;
        // Plain style (not a tween) so the restore below can't be undone by a GSAP revert.
        restoreOrigin = hideOrigin(origin);
        openTl.current = gsap
          .timeline()
          .set(frame, {
            x: from.left,
            y: from.top,
            width: from.width,
            height: from.height,
            borderRadius: radius,
          })
          .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
          // Lift, then expand: the tile rises a touch before it takes the screen.
          .to(frame, { scale: 1.03, duration: 0.18, ease: "power2.out" }, 0)
          .to(
            frame,
            {
              x: 0,
              y: 0,
              width: root.clientWidth,
              height: root.clientHeight,
              borderRadius: "1rem",
              scale: 1,
              duration: 0.9,
              ease: "expo.inOut",
            },
            0.18,
          )
          .fromTo(
            controls,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            ">-0.25",
          );
      }

      return () => {
        closeTl.current?.kill();
        restoreOrigin?.();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion, origin] },
  );

  const close = React.useCallback(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const backdrop = backdropRef.current;
    const controls = controlsRef.current;
    if (closing.current || !root || !frame || !backdrop || !controls) return;
    closing.current = true;
    videoRef.current?.pause();
    // Interrupting the open flight is fine: the close tween starts from wherever the frame is.
    openTl.current?.kill();

    const finish = () => {
      onClosed();
    };

    if (reducedMotion || !origin) {
      closeTl.current = gsap.to(root, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: finish,
      });
      return;
    }
    const to = origin.getBoundingClientRect();
    closeTl.current = gsap
      .timeline({ onComplete: finish })
      .to(controls, { opacity: 0, duration: 0.15, ease: "power2.out" }, 0)
      .to(
        frame,
        {
          x: to.left,
          y: to.top,
          width: to.width,
          height: to.height,
          borderRadius: getComputedStyle(origin).borderTopLeftRadius,
          scale: 1,
          duration: 0.75,
          ease: "expo.inOut",
        },
        0.05,
      )
      .to(backdrop, { opacity: 0, duration: 0.55, ease: "power2.out" }, 0.2);
  }, [origin, reducedMotion, onClosed, videoRef]);

  const { onKeyDown } = player;
  React.useImperativeHandle(
    ref,
    () => ({
      close,
      onKeyDown: (event) => {
        wake();
        onKeyDown(event);
      },
    }),
    [close, onKeyDown, wake],
  );

  const controlsVisible = idle === false || !player.playing;

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 text-on-player"
      onPointerMove={wake}
      onPointerDown={wake}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-player/90" />
      <div
        ref={frameRef}
        className="absolute top-0 left-0 size-full overflow-hidden bg-player will-change-transform"
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            preload="metadata"
            onClick={player.toggle}
            className="size-full object-contain"
          >
            {captions && <track kind="captions" src={captions} srcLang="en" label="English" />}
          </video>
        ) : (
          <div className="relative size-full">
            <div aria-hidden className="absolute inset-0 opacity-40 [&_svg]:size-full">
              <PatternArt variant="diamond" seed="showreel" preserveAspectRatio="xMidYMid slice" />
            </div>
            <p className="absolute inset-0 flex items-center justify-center text-center text-heading">
              {comingSoon}
            </p>
          </div>
        )}
        <div
          ref={controlsRef}
          className="pointer-events-none absolute inset-0 flex flex-col justify-between"
        >
          <div
            className={`flex size-full flex-col justify-between transition-opacity duration-300 **:pointer-events-auto ${
              controlsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex justify-end p-3 md:p-5">
              <DialogPrimitive.Close
                aria-label={labels.close}
                className="inline-flex size-11 items-center justify-center rounded-full bg-player/60 text-on-player backdrop-blur-sm transition-colors outline-none hover:bg-player/80 focus-visible:ring-2 focus-visible:ring-on-player"
              >
                <XIcon className="size-5" />
              </DialogPrimitive.Close>
            </div>
            <VideoControls
              player={player}
              labels={labels}
              hasVideo={hasVideo}
              hasCaptions={Boolean(captions)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { VideoStage };
export type { VideoStageHandle };
