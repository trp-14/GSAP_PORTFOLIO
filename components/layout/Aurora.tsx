'use client';

import { useRef } from 'react';
import { gsap, MQ, useGSAP } from '@/lib/gsap';

/** Fixed ambient background: five drifting colour blobs plus a masked dot grid. */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>('.blob').forEach((b, i) => {
          gsap.to(b, {
            x: () => gsap.utils.random(-1, 1) * innerWidth * 0.22,
            y: () => gsap.utils.random(-1, 1) * innerHeight * 0.25,
            scale: () => gsap.utils.random(0.85, 1.25),
            duration: gsap.utils.random(12, 20),
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            ease: 'sine.inOut',
            delay: i * -3,
          });
        });
        gsap.to(ref.current, { yPercent: -12, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
      });
    },
    { scope: ref },
  );

  return (
    <>
      <div className="aurora" ref={ref} aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
        <div className="blob b5" />
      </div>
      <div className="dots" aria-hidden="true" />
    </>
  );
}
