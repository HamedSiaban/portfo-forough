"use client";

import {
  ClosedCaptioningIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";
import * as React from "react";

import type { PlayerLabels } from "@/content/work";
import type { VideoPlayer } from "@/hooks/use-video-player";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/video-player";

type VideoControlsProps = {
  player: VideoPlayer;
  labels: PlayerLabels;
  /** No reel, or no captions track: the matching controls render disabled. */
  hasVideo: boolean;
  hasCaptions: boolean;
};

const iconButton =
  "inline-flex size-10 items-center justify-center rounded-full text-on-player outline-none transition-colors hover:bg-on-player/15 focus-visible:ring-2 focus-visible:ring-on-player disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-5";

/** Bottom bar: scrub, play/pause, time, captions, mute. Always dark (player tokens). */
function VideoControls({ player, labels, hasVideo, hasCaptions }: VideoControlsProps) {
  const { playing, muted, currentTime, duration, captionsOn } = player;
  const known = Number.isFinite(duration) && duration > 0;

  return (
    <div className="flex flex-col gap-1 bg-linear-to-t from-player/80 to-transparent px-4 pt-16 pb-4 md:px-8 md:pb-6">
      <input
        type="range"
        aria-label={labels.scrub}
        aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
        min={0}
        max={known ? duration : 0}
        step={0.1}
        value={known ? currentTime : 0}
        disabled={!hasVideo || !known}
        onChange={(event) => player.seekTo(Number(event.target.value))}
        className="h-6 w-full cursor-pointer accent-on-player disabled:cursor-default disabled:opacity-40"
      />
      <div className="flex items-center gap-1 text-on-player">
        <button
          type="button"
          className={iconButton}
          disabled={!hasVideo}
          onClick={player.toggle}
          aria-label={playing ? labels.pause : labels.play}
        >
          {playing ? <PauseIcon weight="fill" /> : <PlayIcon weight="fill" />}
        </button>
        <span className="px-2 text-mono-ui tabular-nums" aria-hidden>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          className={cn(iconButton, captionsOn && "bg-on-player/20")}
          disabled={!hasVideo || !hasCaptions}
          onClick={player.toggleCaptions}
          aria-pressed={captionsOn}
          aria-label={
            !hasCaptions
              ? labels.captionsUnavailable
              : captionsOn
                ? labels.captionsOn
                : labels.captionsOff
          }
        >
          <ClosedCaptioningIcon weight={captionsOn ? "fill" : "regular"} />
        </button>
        <button
          type="button"
          className={iconButton}
          disabled={!hasVideo}
          onClick={player.toggleMute}
          aria-label={muted ? labels.unmute : labels.mute}
        >
          {muted ? <SpeakerSlashIcon /> : <SpeakerHighIcon />}
        </button>
      </div>
    </div>
  );
}

export { VideoControls };
