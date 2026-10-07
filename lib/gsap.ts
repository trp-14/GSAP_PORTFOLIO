'use client';

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, SplitText);
}

/** gsap.matchMedia conditions shared by every animated component. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  fine: '(prefers-reduced-motion: no-preference) and (pointer: fine)',
} as const;

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
