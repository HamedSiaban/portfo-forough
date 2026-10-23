"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/ui-store";

/** Opens the contact modal. Outline button beside the section heading. */
function WorkCta({ label, className }: { label: string; className?: string }) {
  const openInquiry = useUiStore((state) => state.openInquiry);

  return (
    <Button variant="outline" size="md" className={cn(className)} onClick={() => openInquiry()}>
      {label}
    </Button>
  );
}

export { WorkCta };
