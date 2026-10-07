import { describe, expect, it } from 'vitest';
import { formatRupiah, plural } from '@/lib/format';

describe('formatRupiah', () => {
  it('uses id-ID thousands separators', () => {
    expect(formatRupiah(18999000)).toBe('Rp 18.999.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });
  it('rounds to whole rupiah', () => {
    expect(formatRupiah(18999000 / 12)).toBe('Rp 1.583.250');
    expect(formatRupiah(1234.5)).toBe('Rp 1.235');
  });
});

describe('plural', () => {
  it('adds an s except for one', () => {
    expect(plural(1, 'product')).toBe('1 product');
    expect(plural(9, 'product')).toBe('9 products');
  });
});
