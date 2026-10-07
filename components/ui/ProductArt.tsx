import { useId, type ReactNode } from 'react';
import type { ArtKind } from '@/lib/products';

type Props = { kind: ArtKind; hue: number; className?: string };

/** Stylised device illustration, port of the prototype's art(). Gradient ids come from useId(). */
export function ProductArt({ kind, hue: h, className }: Props) {
  const k = 'a' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const B = `url(#${k}b)`;
  const S = `url(#${k}s)`;

  const shapes: Record<ArtKind, ReactNode> = {
    phone: (
      <>
        <rect x="68" y="6" width="64" height="128" rx="15" fill={B} />
        <rect x="72" y="10" width="56" height="120" rx="12" fill={S} />
        <rect x="89" y="15" width="22" height="6" rx="3" fill="#02040c" />
        <path d="M76 16h20L78 76Z" fill="#fff" opacity=".14" />
      </>
    ),
    laptop: (
      <>
        <rect x="40" y="18" width="120" height="82" rx="7" fill={B} />
        <rect x="45" y="23" width="110" height="72" rx="3" fill={S} />
        <path d="M26 102h148l-10 14H36Z" fill={B} />
        <rect x="86" y="102" width="28" height="3" rx="1.5" fill="#000" opacity=".3" />
        <path d="M50 28h34L54 80Z" fill="#fff" opacity=".12" />
      </>
    ),
    tablet: (
      <>
        <rect x="44" y="16" width="108" height="112" rx="13" fill={B} />
        <rect x="50" y="22" width="96" height="100" rx="8" fill={S} />
        <rect x="160" y="22" width="7" height="98" rx="3.5" fill={B} />
        <path d="M56 28h36L60 96Z" fill="#fff" opacity=".12" />
      </>
    ),
    buds: (
      <>
        <rect x="60" y="74" width="80" height="54" rx="24" fill={B} />
        <path d="M62 96h76" stroke="#000" strokeOpacity=".25" />
        <circle cx="100" cy="112" r="2.5" fill={`hsl(${h} 90% 70%)`} />
        <rect x="71" y="44" width="10" height="30" rx="5" fill={B} />
        <ellipse cx="80" cy="42" rx="15" ry="13" fill={B} />
        <ellipse cx="88" cy="42" rx="6" ry="6" fill={S} />
        <rect x="119" y="44" width="10" height="30" rx="5" fill={B} />
        <ellipse cx="120" cy="42" rx="15" ry="13" fill={B} />
        <ellipse cx="112" cy="42" rx="6" ry="6" fill={S} />
      </>
    ),
    headphones: (
      <>
        <path d="M56 90C56 26 144 26 144 90" fill="none" stroke={B} strokeWidth="11" strokeLinecap="round" />
        <rect x="40" y="78" width="32" height="48" rx="14" fill={B} />
        <rect x="128" y="78" width="32" height="48" rx="14" fill={B} />
        <rect x="66" y="84" width="9" height="36" rx="4.5" fill={S} />
        <rect x="125" y="84" width="9" height="36" rx="4.5" fill={S} />
      </>
    ),
    watch: (
      <>
        <rect x="82" y="4" width="36" height="42" rx="9" fill={S} opacity=".8" />
        <rect x="82" y="96" width="36" height="42" rx="9" fill={S} opacity=".8" />
        <rect x="68" y="36" width="64" height="70" rx="20" fill={B} />
        <rect x="74" y="42" width="52" height="58" rx="15" fill={S} />
        <rect x="132" y="60" width="6" height="16" rx="3" fill={B} />
        <circle cx="100" cy="71" r="16" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeDasharray="70 40" strokeLinecap="round" />
      </>
    ),
    ring: (
      <>
        <ellipse cx="100" cy="76" rx="46" ry="42" fill="none" stroke={B} strokeWidth="16" />
        <ellipse cx="100" cy="76" rx="37" ry="33" fill="none" stroke={S} strokeWidth="3" />
        <rect x="94" y="110" width="12" height="7" rx="3" fill={`hsl(${h} 90% 70%)`} />
      </>
    ),
    speaker: (
      <>
        <rect x="64" y="28" width="72" height="100" rx="30" fill={B} />
        <ellipse cx="100" cy="36" rx="30" ry="8" fill={S} />
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx={80 + (i % 5) * 10} cy={62 + Math.floor(i / 5) * 12} r="2.2" fill="#000" opacity=".2" />
        ))}
      </>
    ),
    projector: (
      <>
        <rect x="36" y="48" width="128" height="64" rx="18" fill={B} />
        <circle cx="72" cy="80" r="22" fill={S} />
        <circle cx="72" cy="80" r="11" fill="#02040c" opacity=".7" />
        <circle cx="67" cy="75" r="4" fill="#fff" opacity=".6" />
        <path d="M110 70h40M110 80h40M110 90h40" stroke="#000" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 200 150" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${k}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 45% 82%)`} />
          <stop offset=".5" stopColor={`hsl(${h} 35% 58%)`} />
          <stop offset="1" stopColor={`hsl(${h} 55% 28%)`} />
        </linearGradient>
        <linearGradient id={`${k}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 85% 18%)`} />
          <stop offset=".6" stopColor={`hsl(${(h + 40) % 360} 85% 45%)`} />
          <stop offset="1" stopColor={`hsl(${(h + 80) % 360} 90% 70%)`} />
        </linearGradient>
        <radialGradient id={`${k}g`}>
          <stop offset="0" stopColor={`hsl(${h} 90% 65%)`} stopOpacity=".55" />
          <stop offset="1" stopColor={`hsl(${h} 90% 65%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="140" rx="62" ry="8" fill={`url(#${k}g)`} />
      {shapes[kind]}
    </svg>
  );
}
