const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** 18999000 → "Rp 18.999.000" (rounded to whole rupiah). */
export function formatRupiah(n: number): string {
  return 'Rp ' + rupiah.format(Math.round(n));
}

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
