"use client";

import * as React from "react";

import { ImageTrail } from "@/components/effects/image-trail/image-trail";
import { PatternArt } from "@/components/effects/pattern-art";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { cta } from "@/content/cta";
import { useUiStore } from "@/stores/ui-store";

/**
 * Client shell for the CTA panel. Layer order inside the panel: gradient → cursor image
 * trail (pointer target is the panel's content wrapper) → heading and button. The
 * server-rendered heading is passed in as `children`.
 */
function CtaPanel({ children }: { children: React.ReactNode }) {
  const openInquiry = useUiStore((state) => state.openInquiry);

  return (
    <Panel
      halftone={false}
      className="min-h-[calc(100svh-2rem)]"
      contentClassName="flex min-h-[calc(100svh-2rem)] flex-col justify-end gap-8 px-6 pt-28 pb-12 md:flex-row md:items-end md:px-12 md:pb-16"
    >
      <ImageTrail
        images={cta.trail.map((image) => (
          <PatternArt key={image.seed} variant={image.pattern} seed={image.seed} />
        ))}
      />
      {children}
      <Button
        size="md"
        shape="pill"
        className="relative h-14 px-8 md:mb-6"
        onClick={() => openInquiry()}
      >
        {cta.button}
      </Button>
    </Panel>
  );
}

export { CtaPanel };
