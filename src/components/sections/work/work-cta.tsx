"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/ui-store";

/** Opens the contact modal. Styled for the dark reel tile it sits on. */
function WorkCta({ label, className }: { label: string; className?: string }) {
  const openInquiry = useUiStore((state) => state.openInquiry);

  return (
    <Button
      variant="outline"
      size="md"
      className={cn(
        "border-on-inverse/70 bg-transparent text-on-inverse hover:bg-on-inverse/10",
        className,
      )}
      onClick={() => openInquiry()}
    >
      {label}
    </Button>
  );
}

export { WorkCta };
