'use client';

import { useEffect } from 'react';

/** One document-level listener that feeds --mx/--my to the glass surface under the pointer (specular highlight). */
export function GlobalPointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const g = (e.target as Element | null)?.closest?.('.glass') as HTMLElement | null;
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', `${e.clientX - r.left}px`);
      g.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}
