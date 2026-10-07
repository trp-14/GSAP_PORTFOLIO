'use client';

import { flyToCart } from '@/lib/flyToCart';
import { motionAllowed } from '@/lib/motion';
import { PRODUCTS_BY_ID } from '@/lib/products';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';

export const CART_BUTTON_ID = 'cartBtn';

/**
 * Adds one unit to the bag. When motion is allowed and `source` contains an
 * SVG, the art flies to the bag button first and the store updates on landing.
 */
export async function addToBag(id: string, source?: Element | null) {
  const p = PRODUCTS_BY_ID[id];
  if (!p) return;
  useUI.getState().showToast(`${p.name} added to your bag`);
  const svg = source?.querySelector('svg');
  const target = document.getElementById(CART_BUTTON_ID);
  if (motionAllowed() && svg && target) await flyToCart(svg, target);
  useCart.getState().add(id);
  useUI.getState().pulseBag();
}
