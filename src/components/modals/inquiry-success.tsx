"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { inquiry } from "@/content/inquiry";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * In-place confirmation (DESIGN_SPEC §6: not a toast). The check is drawn with a path-length
 * tween; reduced motion shows it fully drawn. Focus moves to the heading so it is announced.
 */
function InquirySuccess({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion();
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => headingRef.current?.focus(), []);

  return (
    <motion.div
      role="status"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-96 flex-col items-start justify-center gap-6"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <CheckIcon aria-hidden weight="bold" className="size-8" />
      </span>
      <div className="flex flex-col gap-3">
        <h2 ref={headingRef} tabIndex={-1} className="text-display-sm outline-none">
          {inquiry.success.title}
        </h2>
        <p className="max-w-md text-body text-muted-foreground">{inquiry.success.body}</p>
      </div>
      <Button shape="pill" className="h-14 px-10 text-base" onClick={onClose}>
        {inquiry.success.close}
      </Button>
    </motion.div>
  );
}

export { InquirySuccess };
