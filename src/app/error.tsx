"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      id="main-content"
      className="flex min-h-svh flex-col items-start justify-center gap-6 px-4 md:px-12"
    >
      <p className="text-mono-ui text-muted-foreground">Error</p>
      <h1 className="text-display-md">Something went wrong.</h1>
      <Button variant="solid" size="md" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
