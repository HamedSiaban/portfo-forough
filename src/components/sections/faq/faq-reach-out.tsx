"use client";

import { useUiStore } from "@/stores/ui-store";

/** The underlined "reach out" link in the FAQ header — opens the inquiry modal. */
function FaqReachOut({ children }: { children: React.ReactNode }) {
  const openInquiry = useUiStore((state) => state.openInquiry);

  return (
    <button
      type="button"
      onClick={() => openInquiry()}
      className="underline underline-offset-3 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

export { FaqReachOut };
