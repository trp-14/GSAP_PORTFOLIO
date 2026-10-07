'use client';

import { gsap } from '@/lib/gsap';

/**
 * Clones `svg`, flies the clone along an arc into `target` and removes it.
 * Resolves when the clone has landed.
 */
export function flyToCart(svg: SVGElement, target: Element): Promise<void> {
  return new Promise((resolve) => {
    const r = svg.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const c = svg.cloneNode(true) as SVGElement;
    Object.assign(c.style, {
      position: 'fixed',
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      margin: '0',
      zIndex: '140',
      pointerEvents: 'none',
      filter: 'drop-shadow(0 10px 20px rgba(143,227,255,.5))',
    });
    c.removeAttribute('class');
    document.body.appendChild(c);

    const dx = t.left + t.width / 2 - (r.left + r.width / 2);
    const dy = t.top + t.height / 2 - (r.top + r.height / 2);
    gsap
      .timeline({
        onComplete: () => {
          c.remove();
          resolve();
        },
      })
      .to(c, { x: dx, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(c, { y: dy, duration: 0.9, ease: 'back.in(1.6)' }, 0)
      .to(c, { scale: 0.12, rotation: 25, duration: 0.9, ease: 'power2.in' }, 0)
      .to(c, { opacity: 0, duration: 0.2 }, 0.72);
  });
}
