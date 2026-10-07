import { beforeEach, describe, expect, it } from 'vitest';
import { cartCount, cartLines, cartSubtotal, useCart } from '@/store/cart';

describe('cart selectors', () => {
  it('count and subtotal ignore unknown ids and empty lines', () => {
    const items = { halo3: 2, drift2: 1, ghost: 4, echo: 0 };
    expect(cartLines(items)).toEqual(['halo3', 'drift2']);
    expect(cartCount(items)).toBe(3);
    expect(cartSubtotal(items)).toBe(18999000 * 2 + 2799000);
  });
  it('empty bag', () => {
    expect(cartCount({})).toBe(0);
    expect(cartSubtotal({})).toBe(0);
  });
});

describe('cart store', () => {
  beforeEach(() => useCart.getState().clear());

  it('add / inc / dec', () => {
    const { add, inc, dec } = useCart.getState();
    add('pulse');
    inc('pulse');
    expect(useCart.getState().items).toEqual({ pulse: 2 });
    dec('pulse');
    dec('pulse');
    expect(useCart.getState().items).toEqual({});
  });
});
