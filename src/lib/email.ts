import { Resend } from "resend";

import { inquiry } from "@/content/inquiry";
import type { InquiryValues } from "@/lib/schemas/inquiry";

const DEFAULT_FROM = "Portfolio inquiry <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function rows(values: InquiryValues): [string, string][] {
  const budget = inquiry.budgets.find((b) => b.value === values.budget)?.label ?? values.budget;
  const plan = values.plan ? (inquiry.plans[values.plan] ?? values.plan) : "";
  return [
    ["Name", values.name],
    ["Email", values.email],
    ["Company", values.company ?? ""],
    ["Website", values.website ?? ""],
    ["Budget", budget],
    ["Plan", plan],
    ["Start date", values.startDate ?? ""],
    ["Launch date", values.launchDate ?? ""],
    ["Message", values.message ?? ""],
  ].filter((row): row is [string, string] => row[1] !== "");
}

/** Never throws: returns false when unconfigured or when Resend rejects, so the route can map it to a status. */
async function sendInquiryEmail(values: InquiryValues): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!apiKey || !to) return false;

  const lines = rows(values);
  const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table>${lines
    .map(
      ([k, v]) =>
        `<tr><th align="left">${k}</th><td>${escapeHtml(v).replaceAll("\n", "<br>")}</td></tr>`,
    )
    .join("")}</table>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || DEFAULT_FROM,
      to,
      replyTo: values.email,
      subject: `New enquiry — ${values.name}`,
      text,
      html,
    });
    return error === null;
  } catch {
    return false;
  }
}

export { sendInquiryEmail };
