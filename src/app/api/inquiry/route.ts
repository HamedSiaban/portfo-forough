import { NextResponse } from "next/server";

import { sendInquiryEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { type InquiryResult, inquirySchema } from "@/lib/schemas/inquiry";

const LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

function respond(body: InquiryResult, status: number): NextResponse<InquiryResult> {
  return NextResponse.json(body, { status });
}

function clientKey(request: Request): string {
  // First hop of x-forwarded-for is the client on Vercel; "unknown" shares one bucket locally.
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request): Promise<NextResponse<InquiryResult>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return respond({ ok: false, error: "invalid" }, 400);
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) return respond({ ok: false, error: "invalid" }, 400);

  // Bots fill the honeypot. Pretend success so they don't learn to adapt.
  if (parsed.data.companyWebsite) return respond({ ok: true }, 200);

  if (!rateLimit(clientKey(request), LIMIT)) {
    return respond({ ok: false, error: "rate_limited" }, 429);
  }

  const sent = await sendInquiryEmail(parsed.data);
  return sent ? respond({ ok: true }, 200) : respond({ ok: false, error: "server" }, 502);
}
