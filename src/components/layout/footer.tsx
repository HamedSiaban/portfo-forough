import Link from "next/link";

import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";

function Footer() {
  return (
    <footer className="flex items-center border-t border-border px-4 py-6 text-mono-ui text-muted-foreground md:px-12">
      <nav className="flex items-center gap-4">
        <Link href="/privacy" className="hover:text-foreground">
          Privacy
        </Link>
        <CookieSettingsButton />
      </nav>
    </footer>
  );
}

export { Footer };
