"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";

type NumberRollProps = {
  value: number;
  format?: (value: number) => string;
  className?: string;
};

const defaultFormat = (value: number): string => new Intl.NumberFormat("en").format(value);

/**
 * Number roll: a GSAP tween on a proxy object writes the interpolated value to the DOM,
 * so React never re-renders per frame. The visual node is aria-hidden; the screen-reader
 * node always holds the final value, so assistive tech isn't spammed with intermediate numbers.
 */
function NumberRoll({ value, format = defaultFormat, className }: NumberRollProps) {
  const visualRef = React.useRef<HTMLSpanElement>(null);
  const fromRef = React.useRef(value);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const node = visualRef.current;
      if (!node) return;
      if (reducedMotion) {
        node.textContent = format(value);
        fromRef.current = value;
        return;
      }
      const proxy = { v: fromRef.current };
      gsap.to(proxy, {
        v: value,
        duration: 0.9,
        ease: "expo.out",
        onUpdate: () => {
          node.textContent = format(Math.round(proxy.v));
          fromRef.current = proxy.v;
        },
        onComplete: () => {
          node.textContent = format(value);
          fromRef.current = value;
        },
      });
    },
    { dependencies: [value, reducedMotion], scope: visualRef },
  );

  return (
    <span className={className}>
      <span ref={visualRef} aria-hidden="true">
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}

export { NumberRoll };
