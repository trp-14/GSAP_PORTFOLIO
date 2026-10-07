'use client';

import { useEffect, useRef } from 'react';
import { Glass } from '@/components/glass/Glass';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';
import { useUI } from '@/store/ui';

/** Glass pill at the bottom centre. Each new toast replaces the last; hides after 2.6s. */
export function Toaster() {
  const ref = useRef<HTMLDivElement>(null);
  const toast = useUI((s) => s.toast);

  useGSAP(
    () => {
      const el = ref.current!;
      if (!toast) return;
      el.classList.add('on');
      if (motionAllowed()) {
        gsap.killTweensOf(el);
        gsap.fromTo(el, { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });
      }
    },
    { dependencies: [toast?.key] },
  );

  useEffect(() => {
    if (!toast) return;
    const el = ref.current!;
    const t = setTimeout(() => {
      if (motionAllowed()) gsap.to(el, { y: 20, opacity: 0, duration: 0.35, onComplete: () => el.classList.remove('on') });
      else el.classList.remove('on');
    }, 2600);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <Glass className="toast" role="status" aria-live="polite" ref={ref}>
      <i />
      <span>{toast?.msg}</span>
    </Glass>
  );
}
