'use client';

import { useSyncExternalStore } from 'react';

function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const usePointerFine = () => useMedia('(pointer: fine)');

/** Non-hook check for event handlers. */
export const motionAllowed = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
