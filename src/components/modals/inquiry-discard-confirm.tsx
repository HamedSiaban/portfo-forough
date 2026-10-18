"use client";

import { motion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { inquiry } from "@/content/inquiry";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type InquiryDiscardConfirmProps = { onKeep: () => void; onDiscard: () => void };

/**
 * Close guard for a dirty form. Rendered inside the dialog popup (a second dialog would stack
 * focus traps); focus lands on "Keep editing" so Esc/Enter never destroy work by accident.
 */
function InquiryDiscardConfirm({ onKeep, onDiscard }: InquiryDiscardConfirmProps) {
  const reduced = useReducedMotion();
  const keepRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => keepRef.current?.focus(), []);

  return (
    <motion.div
      role="alertdialog"
      aria-labelledby="inquiry-discard-title"
      aria-describedby="inquiry-discard-body"
      initial={reduced ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onKeep();
        }
      }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 p-4 backdrop-blur-xs"
    >
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-card bg-surface p-8 shadow-lg ring-1 ring-foreground/10">
        <div className="flex flex-col gap-2">
          <h2 id="inquiry-discard-title" className="text-heading">
            {inquiry.discard.title}
          </h2>
          <p id="inquiry-discard-body" className="text-body text-muted-foreground">
            {inquiry.discard.body}
          </p>
        </div>
        <div className="flex gap-3">
          <Button ref={keepRef} shape="pill" className="h-11 flex-1" onClick={onKeep}>
            {inquiry.discard.keep}
          </Button>
          <Button variant="outline" shape="pill" className="h-11 flex-1" onClick={onDiscard}>
            {inquiry.discard.discard}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export { InquiryDiscardConfirm };
