import { create } from 'zustand';

export type RadialState = { id: string; x: number; y: number } | null;

type UIState = {
  /** Loader finished (or skipped) — the hero intro may play. */
  introReady: boolean;
  drawerOpen: boolean;
  quickId: string | null;
  radial: RadialState;
  wishlist: Record<string, boolean>;
  toast: { msg: string; key: number } | null;
  /** Bumped every time something lands in the bag; the nav button reacts to it. */
  bagPulse: number;

  setIntroReady: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openQuick: (id: string) => void;
  closeQuick: () => void;
  openRadial: (r: NonNullable<RadialState>) => void;
  closeRadial: () => void;
  toggleWish: (id: string) => boolean;
  showToast: (msg: string) => void;
  pulseBag: () => void;
};

/** Element that had focus before an overlay opened; restored on close. */
let lastFocus: HTMLElement | null = null;
const rememberFocus = () => {
  if (typeof document !== 'undefined') lastFocus = document.activeElement as HTMLElement | null;
};
export const restoreFocus = () => {
  lastFocus?.focus?.();
  lastFocus = null;
};

export const useUI = create<UIState>()((set, get) => ({
  introReady: false,
  drawerOpen: false,
  quickId: null,
  radial: null,
  wishlist: {},
  toast: null,
  bagPulse: 0,

  setIntroReady: () => set({ introReady: true }),
  openDrawer: () => {
    rememberFocus();
    set({ drawerOpen: true, radial: null });
  },
  closeDrawer: () => set({ drawerOpen: false }),
  openQuick: (id) => {
    if (!get().radial) rememberFocus();
    set({ quickId: id, radial: null });
  },
  closeQuick: () => set({ quickId: null }),
  openRadial: (r) => {
    rememberFocus();
    set({ radial: r });
  },
  closeRadial: () => set({ radial: null }),
  toggleWish: (id) => {
    const on = !get().wishlist[id];
    set((s) => ({ wishlist: { ...s.wishlist, [id]: on } }));
    return on;
  },
  showToast: (msg) => set({ toast: { msg, key: Date.now() } }),
  pulseBag: () => set((s) => ({ bagPulse: s.bagPulse + 1 })),
}));
