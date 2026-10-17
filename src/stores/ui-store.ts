import { create } from "zustand";

/** Shape refined in Phase 10 once the real pricing plans exist. */
type InquiryPrefill = { plan?: string };

type UiStore = {
  inquiryOpen: boolean;
  inquiryPrefill: InquiryPrefill | undefined;
  openInquiry: (prefill?: InquiryPrefill) => void;
  closeInquiry: () => void;
  videoOpen: boolean;
  activeVideo: string | null;
  openVideo: (id: string) => void;
  closeVideo: () => void;
};

/**
 * Cross-tree UI state (CLAUDE.md §6). Consumers must select the slice they
 * need (`useUiStore((s) => s.openInquiry)`), never the whole store.
 */
export const useUiStore = create<UiStore>((set) => ({
  inquiryOpen: false,
  inquiryPrefill: undefined,
  openInquiry: (prefill) => set({ inquiryOpen: true, inquiryPrefill: prefill }),
  closeInquiry: () => set({ inquiryOpen: false }),
  videoOpen: false,
  activeVideo: null,
  openVideo: (id) => set({ videoOpen: true, activeVideo: id }),
  closeVideo: () => set({ videoOpen: false }),
}));
