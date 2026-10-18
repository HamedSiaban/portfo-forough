/**
 * Umami (cookieless page analytics) and Microsoft Clarity (heatmaps + session replay).
 * Each loads only in production and only when its env var is set, so dev and previews
 * without keys stay silent. See .env.example and the privacy policy (§ analytics).
 */
import Script from "next/script";

const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export function Analytics() {
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
      {clarityId ? (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});`}
        </Script>
      ) : null}
    </>
  );
}
