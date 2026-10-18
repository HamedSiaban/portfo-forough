"use client";

import { cookies } from "@/content/cookies";
import { useConsentStore } from "@/stores/consent-store";

const clarityConfigured = Boolean(process.env.NEXT_PUBLIC_CLARITY_ID);

/** Footer link that re-opens the banner so a visitor can change or withdraw their choice. */
function CookieSettingsButton() {
  const reopen = useConsentStore((s) => s.reopen);
  if (!clarityConfigured) return null;
  return (
    <button type="button" onClick={reopen} className="hover:text-foreground">
      {cookies.settings}
    </button>
  );
}

export { CookieSettingsButton };
