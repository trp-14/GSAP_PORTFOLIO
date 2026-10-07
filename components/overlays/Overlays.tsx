'use client';

import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';
import { restoreFocus, useUI } from '@/store/ui';
import { CartDrawer } from './CartDrawer';
import { QuickLook } from './QuickLook';
import { RadialMenu } from './RadialMenu';
import { Toaster } from './Toaster';

function Scrim() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useUI((s) => s.drawerOpen || !!s.quickId);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (motionAllowed()) gsap.fromTo(ref.current, { opacity: on ? 0 : 1 }, { opacity: on ? 1 : 0, duration: 0.4, clearProps: 'opacity' });
    },
    { dependencies: [on] },
  );

  return (
    <div
      ref={ref}
      className={on ? 'scrim on' : 'scrim'}
      aria-hidden="true"
      onClick={() => {
        const ui = useUI.getState();
        ui.closeQuick();
        ui.closeDrawer();
      }}
    />
  );
}

/** All page-level overlays plus Escape handling: radial → quick look → drawer. */
export function Overlays() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const ui = useUI.getState();
      if (ui.radial) {
        ui.closeRadial();
        restoreFocus();
      } else if (ui.quickId) ui.closeQuick();
      else if (ui.drawerOpen) ui.closeDrawer();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Scrim />
      <CartDrawer />
      <QuickLook />
      <RadialMenu />
      <Toaster />
    </>
  );
}
