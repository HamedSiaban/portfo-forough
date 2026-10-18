"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import type { InquiryErrorCode, InquiryResult, InquiryValues } from "@/lib/schemas/inquiry";

class InquiryError extends Error {
  constructor(readonly code: InquiryErrorCode) {
    super(code);
  }
}

async function postInquiry(values: InquiryValues): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
  } catch {
    throw new InquiryError("server");
  }
  const result = (await response.json().catch(() => null)) as InquiryResult | null;
  if (!response.ok || !result?.ok) {
    throw new InquiryError(result && !result.ok ? result.error : "server");
  }
}

/** POSTs the validated inquiry. `retry: false` — a failed send is surfaced inline with a manual Retry. */
function useSubmitInquiry(): UseMutationResult<void, InquiryError, InquiryValues> {
  return useMutation({ mutationFn: postInquiry, retry: false });
}

export { InquiryError, useSubmitInquiry };
