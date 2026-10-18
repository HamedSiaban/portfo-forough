"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepRow } from "@/components/ui/step-row";
import { Textarea } from "@/components/ui/textarea";
import { inquiry } from "@/content/inquiry";
import { cn } from "@/lib/cn";
import type { InquiryErrorCode, InquiryInput, InquiryValues } from "@/lib/schemas/inquiry";

type InquiryFormProps = {
  form: UseFormReturn<InquiryInput, unknown, InquiryValues>;
  onSubmit: (values: InquiryValues) => void;
  pending: boolean;
  error: InquiryErrorCode | null;
};

const emailSchema = z.email();

type DateFieldProps = React.ComponentProps<typeof Input> & { label: string; empty: boolean };

/** Native date input (best mobile UX) with a faux placeholder, since empty date inputs show "mm/dd/yyyy". */
function DateField({ label, empty, className, ...props }: DateFieldProps) {
  return (
    <div className="relative">
      <Input
        type="date"
        aria-label={label}
        className={cn(
          "peer h-14 px-5 text-base",
          empty && "text-transparent focus:text-foreground",
          className,
        )}
        {...props}
      />
      {empty ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-12 left-5 flex items-center truncate text-base text-muted-foreground peer-focus:hidden"
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="mt-1.5 min-h-4 px-1 text-xs text-destructive">
      {message}
    </p>
  );
}

/**
 * The 4-step enquiry form (DESIGN_SPEC §6). Steps 2–4 are dimmed — not disabled — until step 1
 * is valid, so keyboard and screen-reader users can still reach every field. Send stays disabled
 * until the whole schema validates and while a request is in flight (double-submit guard).
 */
function InquiryForm({ form, onSubmit, pending, error }: InquiryFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const [name, email, startDate, launchDate, plan] = useWatch({
    control,
    name: ["name", "email", "startDate", "launchDate", "plan"],
  });
  const youValid = Boolean(name?.trim()) && emailSchema.safeParse(email).success;
  const dimmed = !youValid;
  const f = inquiry.fields;
  const err = (key: keyof InquiryInput): string | undefined => errors[key]?.message;
  const describe = (key: keyof InquiryInput): string | undefined =>
    errors[key] ? `inquiry-${key}-error` : undefined;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* Honeypot: off-screen, unreachable by keyboard, ignored by assistive tech. */}
      <div aria-hidden className="absolute left-[-9999px] size-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
        </label>
      </div>

      <section aria-labelledby="inquiry-step-1" className="flex flex-col gap-4">
        <StepRow step={1} label={inquiry.steps.you} id="inquiry-step-1" />
        <div className="grid gap-x-4 sm:grid-cols-2">
          <div>
            <Input
              aria-label={f.name}
              placeholder={f.name}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
              className="h-14 px-5 text-base"
              {...register("name")}
            />
            <FieldError id="inquiry-name-error" message={err("name")} />
          </div>
          <div>
            <Input
              type="email"
              aria-label={f.email}
              placeholder={f.email}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describe("email")}
              className="h-14 px-5 text-base"
              {...register("email")}
            />
            <FieldError id="inquiry-email-error" message={err("email")} />
          </div>
        </div>
      </section>

      <section aria-labelledby="inquiry-step-2" className="flex flex-col gap-4">
        <StepRow step={2} label={inquiry.steps.company} id="inquiry-step-2" dimmed={dimmed} />
        <div
          className={cn("grid gap-x-4 transition-opacity sm:grid-cols-2", dimmed && "opacity-50")}
        >
          <div>
            <Input
              aria-label={f.company}
              placeholder={f.company}
              autoComplete="organization"
              className="h-14 px-5 text-base"
              {...register("company")}
            />
            <FieldError id="inquiry-company-error" message={err("company")} />
          </div>
          <div>
            <Input
              aria-label={f.website}
              placeholder={f.website}
              autoComplete="url"
              inputMode="url"
              aria-invalid={Boolean(errors.website)}
              aria-describedby={describe("website")}
              className="h-14 px-5 text-base"
              {...register("website")}
            />
            <FieldError id="inquiry-website-error" message={err("website")} />
          </div>
        </div>
      </section>

      <section aria-labelledby="inquiry-step-3" className="flex flex-col gap-4">
        <StepRow step={3} label={inquiry.steps.project} id="inquiry-step-3" dimmed={dimmed} />
        {plan ? (
          <p className="text-sm text-muted-foreground">
            {inquiry.planChip}:{" "}
            <span className="text-foreground">{inquiry.plans[plan] ?? plan}</span>
          </p>
        ) : null}
        <div
          className={cn("grid gap-x-4 transition-opacity md:grid-cols-3", dimmed && "opacity-50")}
        >
          <div>
            <Controller
              control={control}
              name="budget"
              render={({ field }) => (
                <Select
                  items={inquiry.budgets}
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    if (typeof value === "string") field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-label={f.budget}
                    aria-invalid={Boolean(errors.budget)}
                    aria-describedby={describe("budget")}
                    className="w-full px-5 text-base data-[size=default]:h-14"
                  >
                    <SelectValue placeholder={f.budget} />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {inquiry.budgets.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="inquiry-budget-error" message={err("budget")} />
          </div>
          <div>
            <DateField
              label={f.startDate}
              empty={!startDate}
              aria-describedby={describe("startDate")}
              {...register("startDate")}
            />
            <FieldError id="inquiry-startDate-error" message={err("startDate")} />
          </div>
          <div>
            <DateField
              label={f.launchDate}
              empty={!launchDate}
              min={startDate || undefined}
              aria-invalid={Boolean(errors.launchDate)}
              aria-describedby={describe("launchDate")}
              {...register("launchDate")}
            />
            <FieldError id="inquiry-launchDate-error" message={err("launchDate")} />
          </div>
        </div>
      </section>

      <section aria-labelledby="inquiry-step-4" className="flex flex-col gap-4">
        <StepRow step={4} label={inquiry.steps.more} id="inquiry-step-4" dimmed={dimmed} />
        <div className={cn("transition-opacity", dimmed && "opacity-50")}>
          <Textarea
            aria-label={f.message}
            placeholder={f.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe("message")}
            className="min-h-40 px-5 py-4 text-base"
            {...register("message")}
          />
          <FieldError id="inquiry-message-error" message={err("message")} />
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {inquiry.consent.before}{" "}
          {/* New tab: the modal lives in the root layout and survives client navigation, and a
              same-tab visit would also discard the draft. */}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {inquiry.consent.link}
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
          .
        </p>
        <Button
          type="submit"
          shape="pill"
          className="h-14 px-10 text-base sm:min-w-40"
          disabled={!isValid || pending}
        >
          {pending ? inquiry.sending : inquiry.send}
        </Button>
      </div>

      <div role="alert" aria-live="assertive">
        {error ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <WarningCircleIcon aria-hidden className="size-4 shrink-0" />
            {inquiry.error.message}{" "}
            <button
              type="submit"
              disabled={pending}
              className="underline underline-offset-2 disabled:opacity-50"
            >
              {inquiry.error.retry}
            </button>
          </p>
        ) : null}
      </div>
    </form>
  );
}

export { InquiryForm };
