"use client";

/**
 * Umami (cookieless page analytics, always on) and Microsoft Clarity (heatmaps + session replay,
 * only after the visitor accepts in <CookieBanner />). Production only, and each loads only when
 * its env var is set. See .env.example and the privacy policy.
 */
import Script from "next/script";
import * as React from "react";

import { useConsentStore } from "@/stores/consent-store";

const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

type ClarityFn = (command: string, ...args: unknown[]) => void;

export function Analytics() {
  const consent = useConsentStore((s) => s.analytics);
  const granted = consent === "granted";
  const wasGranted = React.useRef(false);

  React.useEffect(() => {
    // Withdrawing after Clarity has loaded: tell it to drop its cookies and stop recording.
    if (wasGranted.current && !granted) {
      (window as unknown as { clarity?: ClarityFn }).clarity?.("consent", false);
    }
    wasGranted.current = granted;
  }, [granted]);

  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {umamiScriptUrl && umamiWebsiteId ? (
        <Script
          src={umamiScriptUrl}
          data-website-id={umamiWebsiteId}
          data-do-not-track="true"
          strategy="afterInteractive"
        />
      ) : null}
      {clarityId && granted ? (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});`}
        </Script>
      ) : null}
    </>
  );
}
