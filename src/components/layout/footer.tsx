import Link from "next/link";

import { site } from "@/config/site";

function Footer() {
  return (
    <footer className="grid grid-cols-3 items-center border-t border-border px-4 py-6 text-mono-ui text-muted-foreground md:px-12">
      <nav className="flex items-center gap-4 justify-self-start">
        <Link href="/legals" className="hover:text-foreground">
          Legals
        </Link>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy
        </Link>
      </nav>
      <a href={`mailto:${site.email}`} className="justify-self-center hover:text-foreground">
        {site.email}
      </a>
      <a
        href={site.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="justify-self-end hover:text-foreground"
      >
        LinkedIn
      </a>
    </footer>
  );
}

export { Footer };
