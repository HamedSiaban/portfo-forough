import * as React from "react";

import { SmoothScrollProvider } from "@/components/motion/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import { MotionPrefsProvider } from "@/providers/motion-prefs-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MotionPrefsProvider>
          <SmoothScrollProvider>
            {children}
            <Toaster />
          </SmoothScrollProvider>
        </MotionPrefsProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export { Providers };
