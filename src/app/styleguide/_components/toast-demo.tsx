"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function ToastDemo() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => toast("Message sent.", { description: "We'll reply within 48h." })}
    >
      Trigger toast
    </Button>
  );
}

export { ToastDemo };
