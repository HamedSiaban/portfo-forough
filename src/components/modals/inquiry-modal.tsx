"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/stores/ui-store";

/** Placeholder — the full 4-step form (DESIGN_SPEC §6) lands in Phase 10. */
function InquiryModal() {
  const open = useUiStore((state) => state.inquiryOpen);
  const closeInquiry = useUiStore((state) => state.closeInquiry);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeInquiry()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project enquiry</DialogTitle>
          <DialogDescription>Coming in Phase 10.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export { InquiryModal };
