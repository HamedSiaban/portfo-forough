"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { PlusIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between gap-4 border border-transparent py-5 text-left text-title transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:shrink-0 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
        {/* "+" rotates 45deg into "×" on open (DESIGN_SPEC §5 FAQ). */}
        <PlusIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 transition-transform duration-200 ease-(--ease-ui) group-aria-expanded/accordion-trigger:rotate-45"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * Body height/opacity is animated by Motion (CLAUDE.md motion ownership rule), not Base UI's
 * CSS-animation detection, which can't see JS-driven tweens and would hide the panel before the
 * exit finishes. The panel stays mounted; Base UI's own `hidden` is dropped and replaced by
 * `visibility: hidden` once collapsed, which also removes the content from the tab order and the
 * accessibility tree.
 */
function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  const reducedMotion = useReducedMotion();

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      keepMounted
      className="text-body text-muted-foreground"
      render={(panelProps, state) => {
        // Base UI's `hidden`/`style` would fight the Motion tween; the rest (ref, aria, data-*) stays.
        const rest: Record<string, unknown> = { ...panelProps };
        delete rest.hidden;
        delete rest.style;
        return (
          <motion.div
            {...rest}
            initial={false}
            animate={
              state.open
                ? { height: "auto", opacity: 1, visibility: "visible" }
                : { height: 0, opacity: 0, transitionEnd: { visibility: "hidden" } }
            }
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          />
        );
      }}
      {...props}
    >
      <div
        className={cn(
          "max-w-prose pt-0 pb-5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
