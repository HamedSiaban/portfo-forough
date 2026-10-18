"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Halftone } from "@/components/effects/halftone";
import { useSmoothScroll } from "@/components/motion/smooth-scroll";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { inquiry } from "@/content/inquiry";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSubmitInquiry } from "@/hooks/use-submit-inquiry";
import { type InquiryInput, inquirySchema, type InquiryValues } from "@/lib/schemas/inquiry";
import { useUiStore } from "@/stores/ui-store";

import { InquiryDiscardConfirm } from "./inquiry-discard-confirm";
import { InquiryForm } from "./inquiry-form";
import { InquirySuccess } from "./inquiry-success";

const EASE = [0.16, 1, 0.3, 1] as const;

const emptyValues: InquiryInput = {
  name: "",
  email: "",
  company: "",
  website: "",
  budget: undefined as unknown as string,
  startDate: "",
  launchDate: "",
  message: "",
  plan: undefined,
  companyWebsite: "",
};

/** Renders "{email}" / "{whatsapp}" tokens in the intro copy as links. */
function InfoCopy({ text }: { text: string }) {
  const parts = text.split(/(\{email\}|\{whatsapp\})/);
  return (
    <p>
      {parts.map((part, i) => {
        if (part === "{email}")
          return (
            <a key={i} href={`mailto:${site.email}`} className="underline underline-offset-2">
              {inquiry.emailLinkLabel}
            </a>
          );
        if (part === "{whatsapp}")
          return (
            <a
              key={i}
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {inquiry.whatsappLinkLabel}
            </a>
          );
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}

/**
 * Inquiry modal (DESIGN_SPEC §6, ref 01). Base UI Dialog supplies the focus trap, Esc, scroll
 * lock and focus return (same approach as VideoModal). The dialog's own open/close fade uses
 * data-open/data-closed CSS (Base UI waits for it before unmounting); Motion owns the cards'
 * staggered rise and the success/confirm swaps inside. Lenis is paused while open.
 * Form state lives here so the close guard can see `isDirty`.
 */
function InquiryModal() {
  const open = useUiStore((state) => state.inquiryOpen);
  const prefill = useUiStore((state) => state.inquiryPrefill);
  const closeInquiry = useUiStore((state) => state.closeInquiry);
  const { setPaused } = useSmoothScroll();
  const reduced = useReducedMotion();
  const [confirming, setConfirming] = React.useState(false);
  const mutation = useSubmitInquiry();
  const { reset: resetMutation } = mutation;

  const form = useForm<InquiryInput, unknown, InquiryValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onChange",
    defaultValues: emptyValues,
  });
  const { reset: resetForm } = form;
  const { isDirty } = form.formState;
  const sent = mutation.isSuccess;

  // Fresh form on every open; prefill (e.g. the pricing plan) is captured here because the
  // store clears it on close, which would otherwise blank the chip during the exit fade.
  React.useEffect(() => {
    if (!open) return;
    resetForm({ ...emptyValues, plan: prefill?.plan });
    resetMutation();
  }, [open, prefill, resetForm, resetMutation]);

  React.useEffect(() => {
    if (!open) return;
    setPaused(true);
    return () => setPaused(false);
  }, [open, setPaused]);

  const requestClose = React.useCallback(() => {
    if (isDirty && !sent) setConfirming(true);
    else closeInquiry();
  }, [isDirty, sent, closeInquiry]);

  const rise = (index: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 32 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.08 * index },
  });

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) requestClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-background/80 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-surface-muted duration-200 outline-none md:inset-3 md:rounded-panel data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        >
          <Halftone />
          <DialogPrimitive.Close
            render={
              <Button
                variant="outline"
                size="icon"
                className="fixed top-5 right-5 z-20 md:absolute md:top-6 md:right-6"
              />
            }
            onClick={(event) => {
              // Route the × through the same guard as Esc / backdrop.
              event.preventDefault();
              requestClose();
            }}
          >
            <XIcon aria-hidden />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="relative mx-auto grid w-full max-w-6xl gap-4 px-4 pt-20 pb-8 md:px-8 md:py-24 lg:grid-cols-[5fr_8fr] lg:items-start">
            <div className="flex flex-col gap-4">
              <motion.div {...rise(0)} className="rounded-card bg-surface p-8 md:p-14">
                <DialogPrimitive.Title className="text-display-sm">
                  {inquiry.title}
                </DialogPrimitive.Title>
              </motion.div>
              <motion.div
                {...rise(1)}
                className="flex flex-col gap-5 rounded-card bg-surface p-8 text-body-lg text-muted-foreground md:p-14"
              >
                <DialogPrimitive.Description className="sr-only">
                  Send a project enquiry by filling in the form.
                </DialogPrimitive.Description>
                {inquiry.intro.map((line) => (
                  <InfoCopy key={line} text={line} />
                ))}
                <p className="text-sm text-subtle-foreground">
                  {site.location} · {site.timezone}
                </p>
              </motion.div>
            </div>

            <motion.div {...rise(2)} className="relative rounded-card bg-surface p-6 md:p-14">
              {sent ? (
                <InquirySuccess onClose={closeInquiry} />
              ) : (
                <InquiryForm
                  form={form}
                  pending={mutation.isPending}
                  error={mutation.error?.code ?? null}
                  onSubmit={(values) => mutation.mutate(values)}
                />
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {confirming ? (
              <InquiryDiscardConfirm
                onKeep={() => setConfirming(false)}
                onDiscard={() => {
                  setConfirming(false);
                  closeInquiry();
                }}
              />
            ) : null}
          </AnimatePresence>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { InquiryModal };
