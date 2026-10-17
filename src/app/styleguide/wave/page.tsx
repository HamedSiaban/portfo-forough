import { notFound } from "next/navigation";

import { ThemeToggle } from "@/components/layout/theme-toggle";

import { WaveTuning } from "./_components/wave-tuning";

export default function WaveStyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-12">
      <header className="flex items-center justify-between border-b border-border py-6">
        <p className="text-label text-muted-foreground">Phase 03 · Wave field engine</p>
        <ThemeToggle />
      </header>
      <WaveTuning />
    </main>
  );
}
