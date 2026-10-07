'use client';

import { useRef, useState } from 'react';
import { Glass } from '@/components/glass/Glass';
import { gsap, MQ, useGSAP } from '@/lib/gsap';
import { useUI } from '@/store/ui';

const STATUS = [
  'Warming up the glass…',
  'Polishing bezels…',
  'Calibrating 120 Hz…',
  'Untangling earbud cables…',
  'Charging to 100%…',
  'Counting pixels…',
];

/**
 * Full-screen intro. Hidden by CSS under prefers-reduced-motion; in that case
 * it signals the hero immediately and unmounts.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [gone, setGone] = useState(false);
  const setIntroReady = useUI((s) => s.setIntroReady);

  useGSAP(
    () => {
      const finish = () => {
        setIntroReady();
        setGone(true);
      };
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
        if (ctx.conditions?.reduce) {
          finish();
          return;
        }
        const status = ref.current!.querySelector('.load-status')!;
        gsap.set(ref.current, { clipPath: 'circle(150% at 50% 50%)' });
        const t = gsap.timeline({ onComplete: finish });
        t.from('.load-card', { y: 30, scale: 0.9, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' })
          .to('.lens', { rotation: 720, duration: 2.4, ease: 'power2.inOut' }, 0)
          .to('.load-bar i', { scaleX: 1, duration: 2.2, ease: 'steps(12)' }, 0.1);
        STATUS.forEach((s, i) => t.call(() => void (status.textContent = s), undefined, 0.1 + i * 0.36));
        t.to('.load-card', { scale: 0.85, opacity: 0, filter: 'blur(8px)', duration: 0.45, ease: 'power3.in' }, '+=.15')
          .to(ref.current, { clipPath: 'circle(0% at 50% 50%)', duration: 0.8, ease: 'expo.inOut' }, '-=.2');
        tl.current = t;
        const skip = () => t.progress(1);
        window.addEventListener('keydown', skip, { once: true });
        return () => window.removeEventListener('keydown', skip);
      });
    },
    { scope: ref },
  );

  if (gone) return null;
  return (
    <div id="loader" ref={ref} onClick={() => tl.current?.progress(1)}>
      <Glass refract className="load-card" role="status" aria-live="polite">
        <div className="lens" />
        <div className="load-brand">Refract</div>
        <div className="load-bar">
          <i />
        </div>
        <div className="load-status">{STATUS[0]}</div>
        <div className="load-skip">Tap to skip</div>
      </Glass>
    </div>
  );
}
