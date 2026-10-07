import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PRODUCTS_BY_ID } from '@/lib/products';

export type CartItems = Record<string, number>;

type CartState = {
  items: CartItems;
  add: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
};

/** Only ids that exist in the catalogue and have a positive quantity. */
export const cartLines = (items: CartItems) =>
  Object.keys(items).filter((id) => PRODUCTS_BY_ID[id] && items[id] > 0);

export const cartCount = (items: CartItems) => cartLines(items).reduce((n, id) => n + items[id], 0);

export const cartSubtotal = (items: CartItems) =>
  cartLines(items).reduce((s, id) => s + PRODUCTS_BY_ID[id].price * items[id], 0);

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (id) => set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + 1 } })),
      inc: (id) => set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + 1 } })),
      dec: (id) =>
        set((s) => {
          const next = { ...s.items };
          const q = (next[id] ?? 0) - 1;
          if (q <= 0) delete next[id];
          else next[id] = q;
          return { items: next };
        }),
      clear: () => set({ items: {} }),
    }),
    {
      name: 'refract-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      // Rehydrated from <StoreHydrator/> after mount so server and first client render match.
      skipHydration: true,
    },
  ),
);
