"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import * as React from "react";

import { Halftone } from "@/components/effects/halftone";
import { useSmoothScroll } from "@/components/motion/smooth-scroll";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { inquiry } from "@/content/inquiry";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useUiStore } from "@/stores/ui-store";

import { ContactGrid } from "./contact-grid";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Contact modal (DESIGN_SPEC §6, ref 01). Base UI Dialog supplies the focus trap, Esc, scroll
 * lock and focus return (same approach as VideoModal). The dialog's own open/close fade uses
 * data-open/data-closed CSS (Base UI waits for it before unmounting); Motion owns the cards'
 * staggered rise. Lenis is paused while open.
 */
function InquiryModal() {
  const open = useUiStore((state) => state.inquiryOpen);
  const closeInquiry = useUiStore((state) => state.closeInquiry);
  const { setPaused } = useSmoothScroll();
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    setPaused(true);
    return () => setPaused(false);
  }, [open, setPaused]);

  const rise = (index: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 32 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.08 * index },
  });

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeInquiry();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-background/80 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-surface-muted duration-200 outline-none md:inset-3 md:rounded-panel data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        >
          <Halftone />
          <DialogPrimitive.Close
            render={
              <Button
                variant="outline"
                size="icon"
                className="fixed top-5 right-5 z-20 md:absolute md:top-6 md:right-6"
              />
            }
          >
            <XIcon aria-hidden />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="relative mx-auto grid w-full max-w-6xl gap-4 px-4 pt-20 pb-8 md:px-8 md:py-24 lg:grid-cols-[5fr_8fr] lg:items-start">
            <div className="flex flex-col gap-4">
              <motion.div {...rise(0)} className="rounded-card bg-surface p-8 md:p-14">
                <DialogPrimitive.Title className="text-display-sm">
                  {inquiry.title}
                </DialogPrimitive.Title>
              </motion.div>
              <motion.div
                {...rise(1)}
                className="flex flex-col gap-5 rounded-card bg-surface p-8 text-body-lg text-muted-foreground md:p-14"
              >
                <DialogPrimitive.Description className="sr-only">
                  {inquiry.description}
                </DialogPrimitive.Description>
                {inquiry.intro.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p className="text-sm text-subtle-foreground">
                  {site.location} · {site.timezone}
                </p>
              </motion.div>
            </div>

            <motion.div {...rise(2)} className="relative">
              <ContactGrid />
            </motion.div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { InquiryModal };
