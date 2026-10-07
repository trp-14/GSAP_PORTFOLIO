'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart';

/** Loads the persisted bag after the first render, so SSR and hydration markup agree. */
export function StoreHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
