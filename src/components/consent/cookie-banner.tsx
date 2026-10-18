"use client";

/**
 * Consent for Microsoft Clarity (the only cookie-setting script). Shown only when Clarity is
 * configured. Non-modal on purpose: it never blocks the page, and Decline is as prominent as Accept.
 */
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cookies } from "@/content/cookies";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useConsentStore } from "@/stores/consent-store";

const clarityConfigured = Boolean(process.env.NEXT_PUBLIC_CLARITY_ID);

function CookieBanner() {
  const hydrated = useConsentStore((s) => s.hydrated);
  const open = useConsentStore((s) => s.bannerOpen);
  const hydrate = useConsentStore((s) => s.hydrate);
  const choose = useConsentStore((s) => s.choose);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (clarityConfigured) hydrate();
  }, [hydrate]);

  if (!clarityConfigured) return null;

  return (
    <AnimatePresence>
      {hydrated && open ? (
        <motion.section
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-4 bottom-4 z-60 max-w-sm rounded-card border border-border bg-background p-5 shadow-lg md:right-auto md:left-12"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 id="cookie-banner-title" className="text-mono-ui">
            {cookies.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{cookies.body}</p>
          <Link href="/privacy" className="mt-2 inline-block text-sm underline">
            {cookies.policyLink}
          </Link>
          <div className="mt-4 flex gap-2">
            <Button variant="solid" shape="pill" onClick={() => choose("granted")}>
              {cookies.accept}
            </Button>
            <Button variant="outline" shape="pill" onClick={() => choose("denied")}>
              {cookies.decline}
            </Button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

export { CookieBanner };
