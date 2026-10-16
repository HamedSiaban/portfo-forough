"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  `
    group/button inline-flex shrink-0 items-center justify-center
    border border-transparent bg-clip-padding text-mono-ui whitespace-nowrap
    transition-all outline-none select-none
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    active:not-aria-[haspopup]:translate-y-px
    disabled:pointer-events-none disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-1
    aria-invalid:ring-destructive/20
    dark:aria-invalid:border-destructive/50
    dark:aria-invalid:ring-destructive/40
    [&_svg]:pointer-events-none [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        solid: `
          bg-primary text-primary-foreground
          hover:bg-primary/85
        `,
        outline: `
          border-foreground/70 bg-background text-foreground
          hover:bg-muted
          aria-expanded:bg-muted
        `,
        secondary: `
          bg-secondary text-secondary-foreground
          hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]
          aria-expanded:bg-secondary aria-expanded:text-secondary-foreground
        `,
        ghost: `
          hover:bg-muted hover:text-foreground
          aria-expanded:bg-muted aria-expanded:text-foreground
        `,
        destructive: `
          bg-destructive/10 text-destructive
          hover:bg-destructive/20
          focus-visible:border-destructive/40 focus-visible:ring-destructive/20
          dark:bg-destructive/20
          dark:hover:bg-destructive/30
          dark:focus-visible:ring-destructive/40
        `,
        link: `
          text-primary no-underline
          hover:underline
        `,
      },
      size: {
        sm: `
          h-7 gap-1 px-2.5
          has-data-[icon=inline-end]:pr-1.5
          has-data-[icon=inline-start]:pl-1.5
          [&_svg:not([class*='size-'])]:size-3.5
        `,
        md: `
          h-9 gap-1.5 px-3
          has-data-[icon=inline-end]:pr-2.5
          has-data-[icon=inline-start]:pl-2.5
        `,
        icon: "size-9",
        "icon-xs": `
          size-6
          [&_svg:not([class*='size-'])]:size-3
        `,
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
      shape: {
        default: "rounded-input",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      shape: "default",
    },
  },
);

function Button({
  className,
  variant = "solid",
  size = "md",
  shape = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
