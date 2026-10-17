"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/stores/ui-store";

/** Placeholder — the shared-element showreel player (DESIGN_SPEC §6) lands in Phase 07. */
function VideoModal() {
  const open = useUiStore((state) => state.videoOpen);
  const closeVideo = useUiStore((state) => state.closeVideo);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeVideo()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Showreel</DialogTitle>
          <DialogDescription>Coming in Phase 07.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export { VideoModal };
