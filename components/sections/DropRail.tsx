'use client';

import { useRef, type CSSProperties } from 'react';
import { Glass } from '@/components/glass/Glass';
import { PlusIcon } from '@/components/ui/icons';
import { ProductArt } from '@/components/ui/ProductArt';
import { addToBag } from '@/lib/actions';
import { formatRupiah } from '@/lib/format';
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { DROP, PRODUCTS_BY_ID, type DropItem } from '@/lib/products';
import { useUI } from '@/store/ui';

const pad = (n: number) => String(n).padStart(2, '0');

function Panel({ d, i }: { d: DropItem; i: number }) {
  const p = PRODUCTS_BY_ID[d.id];
  const artRef = useRef<HTMLDivElement>(null);
  return (
    <Glass as="article" refract className="panel" data-id={p.id} style={{ '--h': p.hue } as CSSProperties}>
      <div className="panel-art" ref={artRef}>
        <ProductArt kind={p.art} hue={p.hue} />
      </div>
      <div className="panel-copy">
        <span className="panel-idx">
          {pad(i + 1)} / {pad(DROP.length)} · {d.when}
        </span>
        <h3>{p.name}</h3>
        <p>{d.copy}</p>
        <span className="mono panel-spec">{p.spec}</span>
        <div className="row">
          <span className="price">{formatRupiah(p.price)}</span>
          <button className="btn btn-solid" onClick={() => addToBag(p.id, artRef.current)}>
            <PlusIcon />
            Add to bag
          </button>
          <Glass as="button" className="btn" onClick={() => useUI.getState().openQuick(p.id)}>
            Quick look
          </Glass>
        </div>
      </div>
    </Glass>
  );
}

/**
 * Horizontal release rail. With motion: pinned + scrubbed sideways, art parallax via containerAnimation.
 * Reduced motion: native overflow-x scroll with scroll-snap.
 */
export function DropRail() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const section = ref.current!;
        const track = section.querySelector<HTMLElement>('.drop-track')!;
        const bar = section.querySelector<HTMLElement>('.drop-progress i')!;
        section.classList.add('has-pin');

        const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        const rail = gsap.to(track, { x: () => -dist(), ease: 'none' });
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => '+=' + (dist() + innerHeight * 0.3),
          pin: true,
          scrub: 1,
          animation: rail,
          invalidateOnRefresh: true,
          onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }),
        });

        gsap.utils.toArray<HTMLElement>('.panel').forEach((panel) => {
          gsap.fromTo(
            panel.querySelector('.panel-art svg'),
            { x: 90, rotation: -12, scale: 0.85 },
            { x: -40, rotation: 8, scale: 1.05, ease: 'none',
              scrollTrigger: { trigger: panel, containerAnimation: rail, start: 'left right', end: 'right left', scrub: true } },
          );
          // panels already in view when the rail starts would only reveal after the pin begins; trigger those off the section
          const visibleAtStart = panel.getBoundingClientRect().left < innerWidth * 0.75;
          gsap.from(panel.querySelectorAll('.panel-copy > *'), {
            x: 60, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out',
            scrollTrigger: visibleAtStart
              ? { trigger: section, start: 'top 60%' }
              : { trigger: panel, containerAnimation: rail, start: 'left 75%' },
          });
        });

        return () => section.classList.remove('has-pin');
      });

      // fallback: progress bar follows native horizontal scroll
      mm.add(MQ.reduce, () => {
        const track = ref.current!.querySelector<HTMLElement>('.drop-track')!;
        const bar = ref.current!.querySelector<HTMLElement>('.drop-progress i')!;
        const onScroll = () => {
          const max = track.scrollWidth - track.clientWidth;
          bar.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 0})`;
        };
        onScroll();
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => track.removeEventListener('scroll', onScroll);
      });
    },
    { scope: ref },
  );

  return (
    <section id="drop" aria-label="The Drop" ref={ref}>
      <div className="wrap drop-head">
        <div>
          <span className="eyebrow">The Drop</span>
          <h2 className="drop-title" data-reveal>
            Four releases this month
          </h2>
        </div>
        <p className="mono drop-hint">Scroll to move through →</p>
      </div>
      <div className="drop-track">
        {DROP.map((d, i) => (
          <Panel key={d.id} d={d} i={i} />
        ))}
      </div>
      <div className="wrap">
        <div className="drop-progress">
          <i />
        </div>
      </div>
    </section>
  );
}
