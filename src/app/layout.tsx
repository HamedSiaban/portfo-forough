import "./globals.css";

import type { Metadata } from "next";

import { fontVariables } from "@/fonts";
import { cn } from "@/lib/cn";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "foroughforoughi.com (scaffold)",
  description: "Portfolio scaffold — placeholder metadata, replaced in a later phase.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full antialiased", fontVariables)}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
