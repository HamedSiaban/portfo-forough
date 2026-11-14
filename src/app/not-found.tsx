"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-svh flex-col items-start justify-center gap-6 px-4 md:px-12"
    >
      <p className="text-mono-ui text-muted-foreground">404</p>
      <h1 className="text-display-md">This page doesn&apos;t exist.</h1>
      <Link href="/" className={buttonVariants({ variant: "solid", size: "md" })}>
        Back to home
      </Link>
    </main>
  );
}
