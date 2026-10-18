import { z } from "zod";

import { inquiry } from "@/content/inquiry";

const values = (options: { value: string }[]) =>
  options.map((o) => o.value) as [string, ...string[]];

/** Accepts "example.com" as well as full URLs; stores the normalised absolute URL. */
const websiteSchema = z
  .string()
  .trim()
  .max(300)
  .transform((value, ctx) => {
    if (value === "") return "";
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(candidate);
      if (!url.hostname.includes(".")) throw new Error("no tld");
      return url.toString();
    } catch {
      ctx.addIssue({ code: "custom", message: "Enter a valid website address" });
      return z.NEVER;
    }
  });

const dateSchema = z
  .string()
  .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Enter a valid date")
  .optional();

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").max(254),
  company: z.string().trim().max(160).optional(),
  website: websiteSchema.optional(),
  role: z.string().trim().max(160).optional(),
  employmentType: z.enum(values(inquiry.employmentTypes)).optional(),
  workSetup: z.enum(values(inquiry.workSetups)).optional(),
  startDate: dateSchema,
  message: z.string().trim().max(4000, "Please keep it under 4000 characters").optional(),
  /** Honeypot: hidden from people, irresistible to bots. The route drops submissions where it is filled. */
  companyWebsite: z.string().max(300).optional(),
});

/** Form-side type (before transforms) and the parsed type the server receives. */
type InquiryInput = z.input<typeof inquirySchema>;
type InquiryValues = z.output<typeof inquirySchema>;

type InquiryErrorCode = "invalid" | "rate_limited" | "server";
type InquiryResult = { ok: true } | { ok: false; error: InquiryErrorCode };

export { inquirySchema };
export type { InquiryErrorCode, InquiryInput, InquiryResult, InquiryValues };
