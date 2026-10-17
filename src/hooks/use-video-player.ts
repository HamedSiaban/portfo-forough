"use client";

import * as React from "react";

import { clampSeek, keyAction, setCaptions } from "@/lib/video-player";

type VideoPlayer = {
  /** Attach to the <video>. Owned here so the hook may drive the element imperatively. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playing: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  captionsOn: boolean;
  toggle: () => void;
  seekTo: (time: number) => void;
  seekBy: (delta: number) => void;
  toggleMute: () => void;
  toggleCaptions: () => void;
  /** Spread on the element that should own the shortcuts. Ignores keys aimed at buttons/inputs. */
  onKeyDown: (event: React.KeyboardEvent) => void;
};

/**
 * Mirrors a native <video> into React state and exposes the minimal control surface. Event
 * listeners are attached imperatively so `timeupdate` doesn't re-render through React props.
 */
function useVideoPlayer(hasCaptions: boolean): VideoPlayer {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [state, setState] = React.useState({
    playing: false,
    muted: false,
    currentTime: 0,
    duration: 0,
  });
  const [captionsOn, setCaptionsOn] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () =>
      setState({
        playing: !video.paused && !video.ended,
        muted: video.muted,
        currentTime: video.currentTime,
        duration: video.duration,
      });
    const events = ["play", "pause", "ended", "timeupdate", "durationchange", "volumechange"];
    events.forEach((name) => video.addEventListener(name, sync));
    sync();
    return () => events.forEach((name) => video.removeEventListener(name, sync));
  }, []);

  const toggle = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }, []);

  const seekTo = React.useCallback((time: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = clampSeek(time, 0, video.duration);
  }, []);

  const seekBy = React.useCallback((delta: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = clampSeek(video.currentTime, delta, video.duration);
  }, []);

  const toggleMute = React.useCallback(() => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }, []);

  const toggleCaptions = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || !hasCaptions) return;
    setCaptionsOn((on) => setCaptions(video, !on));
  }, [hasCaptions]);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      const action = keyAction(event.key);
      if (!action) return;
      // Native controls keep their own behaviour: Space clicks a focused button, arrows step the range.
      const onControl = Boolean(target.closest("button, input"));
      if (onControl && action === "toggle") return;
      if (target.closest("input") && (action === "back" || action === "forward")) return;
      event.preventDefault();
      if (action === "toggle") toggle();
      else if (action === "back") seekBy(-5);
      else if (action === "forward") seekBy(5);
      else if (action === "mute") toggleMute();
      else toggleCaptions();
    },
    [seekBy, toggle, toggleCaptions, toggleMute],
  );

  return {
    videoRef,
    ...state,
    captionsOn,
    toggle,
    seekTo,
    seekBy,
    toggleMute,
    toggleCaptions,
    onKeyDown,
  };
}

export { useVideoPlayer };
export type { VideoPlayer };
