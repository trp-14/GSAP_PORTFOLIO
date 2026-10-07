import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', 'aria-hidden': true } as const;
const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const DotsIcon = (p: P) => (
  <svg {...base} fill="currentColor" {...p}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export const BagIcon = (p: P) => (
  <svg {...base} {...stroke} strokeWidth={2} {...p}>
    <path d="M6 7h12l-1 13H7L6 7Z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

export const HeartIcon = (p: P) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M12 21s-7.5-4.6-9.5-9.3C1 8.2 3.3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.7 5 21 8.2 19.5 11.7 17.5 16.4 12 21 12 21Z" />
  </svg>
);

export const EyeIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base} {...stroke} strokeWidth={2.4} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base} {...stroke} strokeWidth={2.4} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base} {...stroke} strokeWidth={2} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowIcon = (p: P) => (
  <svg {...base} {...stroke} strokeWidth={2} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
