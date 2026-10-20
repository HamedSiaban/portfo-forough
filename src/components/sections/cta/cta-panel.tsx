"use client";

import * as React from "react";

import { CardCascade } from "@/components/effects/card-cascade";
import { WaveField } from "@/components/effects/wave-field";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { cta } from "@/content/cta";
import { useIsTouch } from "@/hooks/use-is-touch";
import { useUiStore } from "@/stores/ui-store";

/**
 * Client shell for the CTA panel. Layer order inside the panel: gradient + halftone → card
 * cascade → text → wave glow (the Panel `overlay` slot sits above the text so the glow tints the
 * letters like in the hero). The server-rendered heading is passed in as `children`.
 */
function CtaPanel({ children }: { children: React.ReactNode }) {
  const panelRef = React.useRef<HTMLElement>(null);
  const isTouch = useIsTouch();
  const openInquiry = useUiStore((state) => state.openInquiry);

  return (
    <Panel
      ref={panelRef}
      className="min-h-[calc(100svh-2rem)]"
      contentClassName="flex min-h-[calc(100svh-2rem)] flex-col justify-end gap-8 px-6 pt-28 pb-12 md:flex-row md:items-end md:px-12 md:pb-16"
      overlay={
        <WaveField
          className="absolute inset-0"
          palette="accent"
          chromatic
          halftone
          backdrop={false}
          idleDrift={isTouch}
          pointerTarget={panelRef}
        />
      }
    >
      <CardCascade />
      {children}
      <Button
        data-cascade-floor
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
