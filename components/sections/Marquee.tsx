'use client';

import { Fragment, useRef } from 'react';
import { Glass } from '@/components/glass/Glass';
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MARQUEE_ITEMS } from '@/lib/products';

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const loop = gsap.to('.marquee-track', { xPercent: -50, duration: 32, repeat: -1, ease: 'none' });
        let boost = 0;
        let dir = 1;
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (s) => {
            boost = Math.min(Math.abs(s.getVelocity()) / 250, 8);
            dir = s.direction;
          },
        });
        const tick = () => {
          boost *= 0.93;
          loop.timeScale(dir * (1 + boost));
        };
        gsap.ticker.add(tick);
        gsap.fromTo('.marquee-track span:nth-child(even)', { rotation: 0 }, { rotation: 360, duration: 6, repeat: -1, ease: 'none' });
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: ref },
  );

  return (
    <Glass className="marquee" aria-label="Store benefits" role="region" ref={ref}>
      <div className="marquee-track">
        {[0, 1].map((copy) =>
          MARQUEE_ITEMS.map((t) => (
            <Fragment key={`${copy}-${t}`}>
              <span aria-hidden={copy === 1 || undefined}>{t}</span>
              <span aria-hidden="true">✦</span>
            </Fragment>
          )),
        )}
      </div>
    </Glass>
  );
}
