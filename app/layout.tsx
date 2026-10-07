import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';
import { LiquidFilter } from '@/components/glass/LiquidFilter';
import { Aurora } from '@/components/layout/Aurora';
import { GlobalPointer } from '@/components/layout/GlobalPointer';
// glass.css must load first: component rules (.chip, .rad-btn, .marquee…) override .glass, as in the prototype
import './glass.css';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'] });
const body = Geist({ subsets: ['latin'], variable: '--font-body' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono-geist' });

export const metadata: Metadata = {
  title: 'Refract Tech Store',
  description: 'Phones, laptops, audio and wearables delivered across Jakarta in two hours. A liquid-glass GSAP demo storefront.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060a1c',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <LiquidFilter />
        <Aurora />
        <GlobalPointer />
        {children}
      </body>
    </html>
  );
}
