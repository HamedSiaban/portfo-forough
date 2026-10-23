import Image from "next/image";

import { PatternArt } from "@/components/effects/pattern-art";
import type { ImageBlock, VideoBlock } from "@/content/case-studies";
import { cn } from "@/lib/cn";

const frameClass = "overflow-hidden rounded-card bg-surface";

/** Draft stand-in so an unfinished page keeps its rhythm; disappears once `src` is set. */
function Placeholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={cn(frameClass, "relative flex items-center justify-center")}
    >
      <PatternArt
        variant="steps"
        seed={label}
        aria-hidden
        className="absolute inset-0 size-full opacity-60"
      />
      <span className="relative text-mono-ui text-muted-foreground">Media placeholder</span>
    </div>
  );
}

function CaseStudyImage({ block }: { block: ImageBlock }) {
  const { src, alt, width = 1600, height = 900 } = block;
  return src ? (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 1024px) 1024px, 100vw"
      className={cn(frameClass, "h-auto w-full")}
    />
  ) : (
    <Placeholder label={alt} ratio={`${width} / ${height}`} />
  );
}

/** Native controls keep keyboard and caption support for free; nothing loads until played. */
function CaseStudyVideo({ block }: { block: VideoBlock }) {
  if (!block.src) return <Placeholder label={block.title} ratio="16 / 9" />;
  return (
    <video
      controls
      playsInline
      preload="none"
      poster={block.poster}
      aria-label={block.title}
      className={cn(frameClass, "aspect-video w-full bg-player")}
    >
      <source src={block.src} />
      {block.captions && (
        <track kind="captions" src={block.captions} srcLang="en" label="English" default />
      )}
    </video>
  );
}

export { CaseStudyImage, CaseStudyVideo };
