import "./globals.css";

import type { Metadata } from "next";

import { Analytics } from "@/components/analytics";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { InquiryModal } from "@/components/modals/inquiry-modal";
import { VideoModal } from "@/components/modals/video-modal";
import { site } from "@/config/site";
import { fontVariables } from "@/fonts";
import { cn } from "@/lib/cn";
import { Providers } from "@/providers/providers";

const description =
  "Portfolio of Foroughozaman (Foro) Foroughi, a senior product and UX designer. Case studies in AI systems, trust and marketplace UX.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Product & UX designer`, template: `%s · ${site.shortName}` },
  description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · Product & UX designer`,
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full antialiased", fontVariables)}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-60 focus-visible:rounded-input focus-visible:bg-foreground focus-visible:px-3 focus-visible:py-2 focus-visible:text-background focus-visible:outline-none"
          >
            Skip to content
          </a>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <InquiryModal />
          <VideoModal />
          <JsonLd />
          <Analytics />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
