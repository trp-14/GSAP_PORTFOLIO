'use client';

import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { Glass } from '@/components/glass/Glass';
import { DotsIcon, HeartIcon, PlusIcon } from '@/components/ui/icons';
import { Meters } from '@/components/ui/Meters';
import { ProductArt } from '@/components/ui/ProductArt';
import { addToBag } from '@/lib/actions';
import { formatRupiah, plural } from '@/lib/format';
import { Flip, gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';
import { CATEGORIES, PRODUCTS, type Category, type Product } from '@/lib/products';
import { useUI } from '@/store/ui';

type Filter = Category | 'all';

function ProductCard({ p, out }: { p: Product; out: boolean }) {
  const wished = useUI((s) => !!s.wishlist[p.id]);
  const radialOpenHere = useUI((s) => s.radial?.id === p.id);
  const artRef = useRef<HTMLDivElement>(null);

  const toggleRadial = (btn: HTMLButtonElement) => {
    const ui = useUI.getState();
    if (radialOpenHere) return ui.closeRadial();
    const r = btn.getBoundingClientRect();
    ui.openRadial({ id: p.id, x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <Glass
      as="article"
      className={['card', out && 'is-out', wished && 'wished'].filter(Boolean).join(' ')}
      data-id={p.id}
      data-cat={p.cat}
      style={{ '--h': p.hue } as CSSProperties}
      aria-hidden={out || undefined}
    >
      <div className="card-art" ref={artRef}>
        {p.tag && <span className="tag">{p.tag}</span>}
        <span className="wish-dot" aria-label={wished ? 'Saved' : undefined}>
          <HeartIcon />
        </span>
        <ProductArt kind={p.art} hue={p.hue} />
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>{p.name}</h3>
          <Glass
            as="button"
            className="more"
            data-act="radial"
            aria-label={`More actions for ${p.name}`}
            aria-expanded={radialOpenHere}
            onClick={(e: MouseEvent<HTMLButtonElement>) => toggleRadial(e.currentTarget)}
          >
            <DotsIcon />
          </Glass>
        </div>
        <p className="line">{p.line}</p>
        <p className="spec mono">{p.spec}</p>
        <Meters product={p} />
        <div className="card-foot">
          <span className="price">{formatRupiah(p.price)}</span>
          <button className="btn btn-solid add" onClick={() => addToBag(p.id, artRef.current)}>
            <PlusIcon />
            Add
          </button>
        </div>
      </div>
    </Glass>
  );
}

export function ShopSection() {
  const ref = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const flipState = useRef<Flip.FlipState | null>(null);
  const count = filter === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === filter).length;

  // reveal, meters, art pop and pointer tilt
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.card');
        cards.forEach((c) => {
          if (c.getBoundingClientRect().top > innerHeight) gsap.set(c, { y: 80, opacity: 0.15, rotationX: 14, transformPerspective: 900 });
        });
        ScrollTrigger.batch(cards, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            const els = batch as HTMLElement[];
            gsap.to(els, { y: 0, opacity: 1, rotationX: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out' });
            gsap.from(els.flatMap((c) => Array.from(c.querySelectorAll('.mf'))), { width: 0, duration: 1.3, stagger: 0.04, ease: 'power3.out', delay: 0.2 });
            gsap.from(els.map((c) => c.querySelector('.card-art svg')), { y: 30, scale: 0.85, rotation: -6, duration: 1.4, stagger: 0.09, ease: 'elastic.out(1,.6)' });
          },
        });
        gsap.from('.chip-f', { y: 20, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '.filters', start: 'top 92%' } });
      });

      mm.add(MQ.fine, () => {
        const offs = gsap.utils.toArray<HTMLElement>('.card').map((c) => {
          const svg = c.querySelector('.card-art svg');
          const move = (e: PointerEvent) => {
            const r = c.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(c, { rotationY: nx * 10, rotationX: -ny * 10, transformPerspective: 900, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
            gsap.to(svg, { x: nx * 18, y: ny * 12 - 6, rotation: nx * 6, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
          };
          const leave = () => {
            gsap.to(c, { rotationY: 0, rotationX: 0, duration: 0.9, ease: 'elastic.out(1,.5)' });
            gsap.to(svg, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1,.5)' });
          };
          c.addEventListener('pointermove', move);
          c.addEventListener('pointerleave', leave);
          return () => {
            c.removeEventListener('pointermove', move);
            c.removeEventListener('pointerleave', leave);
          };
        });
        return () => offs.forEach((off) => off());
      });
    },
    { scope: ref },
  );

  // Flip from the state captured in the click handler, after React has toggled .is-out
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.75,
        ease: 'power3.inOut',
        absolute: true,
        scale: true,
        stagger: 0.03,
        targets: '.card',
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.7, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.04 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.7, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: ref, dependencies: [filter] },
  );

  const choose = (k: Filter, btn: HTMLButtonElement) => {
    if (k === filter) return;
    useUI.getState().closeRadial();
    if (motionAllowed()) {
      const cards = gsap.utils.toArray<HTMLElement>('.card', ref.current);
      flipState.current = Flip.getState(cards);
      gsap.set(cards, { rotationX: 0, rotationY: 0 });
      gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2,.4)' });
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    setFilter(k);
  };

  return (
    <section className="section wrap" id="shop" ref={ref}>
      <div className="sec-head">
        <div>
          <span className="eyebrow">The lineup</span>
          <h2 data-reveal>Nine devices. One finish.</h2>
          <p>Every product ships sealed, tested in our Kemang studio and backed for two years.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter by category">
          {CATEGORIES.map(([k, label]) => (
            <Glass
              as="button"
              key={k}
              className="chip-f"
              aria-pressed={filter === k}
              onClick={(e: MouseEvent<HTMLButtonElement>) => choose(k, e.currentTarget)}
            >
              {label}
            </Glass>
          ))}
        </div>
      </div>
      <p className="count mono" aria-live="polite">
        {plural(count, 'product')}
      </p>
      <div className="grid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} p={p} out={filter !== 'all' && p.cat !== filter} />
        ))}
      </div>
    </section>
  );
}
