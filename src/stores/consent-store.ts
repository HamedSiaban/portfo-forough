import { create } from "zustand";

export type ConsentChoice = "granted" | "denied";

type ConsentStore = {
  /** False until localStorage has been read, so server and first client render match. */
  hydrated: boolean;
  analytics: ConsentChoice | null;
  /** Banner visibility: shown while undecided, or re-opened from the footer. */
  bannerOpen: boolean;
  hydrate: () => void;
  choose: (choice: ConsentChoice) => void;
  reopen: () => void;
};

const STORAGE_KEY = "analytics-consent";

function read(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/** Cross-tree UI state (CLAUDE.md §6): the footer re-opens the banner, Analytics reads the choice. */
export const useConsentStore = create<ConsentStore>((set) => ({
  hydrated: false,
  analytics: null,
  bannerOpen: false,
  hydrate: () => {
    const analytics = read();
    set({ hydrated: true, analytics, bannerOpen: analytics === null });
  },
  choose: (choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    set({ analytics: choice, bannerOpen: false });
  },
  reopen: () => set({ bannerOpen: true }),
}));
