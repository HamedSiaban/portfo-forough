"use client";

import { motion } from "motion/react";
import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pricing } from "@/content/pricing";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { RecurringPanel } from "./recurring-panel";
import { SingleProjectCard } from "./single-project-card";

type TabValue = "single" | "recurring";

/**
 * Segmented control. The pill is a Motion `layoutId` element that slides between triggers;
 * panels fade/rise in on mount (Base UI unmounts the inactive panel, so each switch is an
 * enter animation). Reduced motion: the pill snaps and panels appear instantly.
 */
function PricingTabs() {
  const [value, setValue] = React.useState<TabValue>("single");
  const reducedMotion = useReducedMotion();
  const tabs = [
    { value: "single", label: pricing.tabs.single },
    { value: "recurring", label: pricing.tabs.recurring },
  ] as const;

  const panelMotion = {
    initial: reducedMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] },
  } as const;

  return (
    <Tabs value={value} onValueChange={(next) => setValue(next as TabValue)} className="gap-4">
      <TabsList className="bg-surface p-2 group-data-horizontal/tabs:h-14">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-6 text-base data-active:bg-transparent"
          >
            {value === tab.value ? (
              <motion.span
                layoutId="pricing-tab-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-surface-muted"
                transition={
                  reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            ) : null}
            <span className="relative">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="single">
        <motion.div {...panelMotion}>
          <SingleProjectCard />
        </motion.div>
      </TabsContent>
      <TabsContent value="recurring">
        <motion.div {...panelMotion}>
          <RecurringPanel />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}

export { PricingTabs };
