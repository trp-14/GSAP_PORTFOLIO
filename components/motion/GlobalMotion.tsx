'use client';

import { useRef } from 'react';
import { Glass } from '@/components/glass/Glass';
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';

/**
 * Page-wide effects that query the DOM. Render it LAST in the page so every
 * section has mounted (and DropRail has pinned) before these triggers are created.
 */
export function GlobalMotion() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // heading word reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((h) => {
        const split = SplitText.create(h, { type: 'words', mask: 'words', maskClass: 'split-mask' });
        gsap.from(split.words, {
          yPercent: 110, rotation: 6, duration: 1, stagger: 0.06, ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 88%' },
        });
      });

      // liquid wobble: briefly boost the displacement on refracting hovers
      const disp = document.getElementById('disp');
      const wobble = () => gsap.fromTo(disp, { attr: { scale: 42 } }, { attr: { scale: 90 }, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' });
      const hot = gsap.utils.toArray<HTMLElement>('.nav, .btn-solid.magnetic, .chip, .chip-f');
      hot.forEach((el) => el.addEventListener('pointerenter', wobble));

      const refresh = () => ScrollTrigger.refresh();
      void document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);

      return () => {
        hot.forEach((el) => el.removeEventListener('pointerenter', wobble));
        window.removeEventListener('load', refresh);
      };
    });

    mm.add(MQ.fine, () => {
      // magnetic buttons
      const offs = gsap.utils.toArray<HTMLElement>('.magnetic').map((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.35);
          yTo((e.clientY - r.top - r.height / 2) * 0.45);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });

      // glass cursor lens
      const cur = cursorRef.current!;
      const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
      const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.to(cur, { opacity: 1, duration: 0.3 });
        }
        cx(e.clientX);
        cy(e.clientY);
        const t = e.target as Element;
        const interactive = t.closest?.('a,button,input,.card');
        const onCardBody = t.closest?.('.card') && !t.closest('button,a');
        gsap.to(cur, { scale: interactive ? (onCardBody ? 1.6 : 0.55) : 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      };
      const onLeave = () => {
        shown = false;
        gsap.to(cur, { opacity: 0, duration: 0.3 });
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);

      return () => {
        offs.forEach((off) => off());
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      };
    });
  });

  return <Glass refract className="cursor" aria-hidden="true" ref={cursorRef} />;
}
