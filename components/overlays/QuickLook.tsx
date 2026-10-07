'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { Glass } from '@/components/glass/Glass';
import { PlusIcon, XIcon } from '@/components/ui/icons';
import { Meters } from '@/components/ui/Meters';
import { ProductArt } from '@/components/ui/ProductArt';
import { addToBag } from '@/lib/actions';
import { formatRupiah } from '@/lib/format';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';
import { PRODUCTS_BY_ID } from '@/lib/products';
import { restoreFocus, useUI } from '@/store/ui';

export function QuickLook() {
  const ref = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const quickId = useUI((s) => s.quickId);
  const closeQuick = useUI((s) => s.closeQuick);
  // keeps the last product on screen while the close animation runs
  const [shownId, setShownId] = useState<string | null>(null);
  if (quickId && quickId !== shownId) setShownId(quickId);
  const prev = useRef<string | null>(null);

  useGSAP(
    () => {
      const was = prev.current;
      prev.current = quickId;
      if (quickId === was) return;
      const card = ref.current!.querySelector<HTMLElement>('.ql-card')!;
      const motion = motionAllowed();

      if (quickId) {
        if (motion) {
          gsap.fromTo(card, { y: 60, scale: 0.92, rotationX: 12, opacity: 0 }, { y: 0, scale: 1, rotationX: 0, opacity: 1, duration: 0.8, ease: 'expo.out', transformPerspective: 1000 });
          gsap.from('.ql-art svg', { y: 40, rotation: -10, scale: 0.8, duration: 1.1, ease: 'elastic.out(1,.6)', delay: 0.1 });
          gsap.from('.ql-info > *', { y: 20, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out', delay: 0.15 });
          gsap.from('.ql-card .mf', { width: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out', delay: 0.35 });
        }
        const t = setTimeout(() => card.querySelector<HTMLButtonElement>('.ql-close')?.focus(), 50);
        return () => clearTimeout(t);
      }

      if (!was) return;
      if (!useUI.getState().drawerOpen) restoreFocus();
      if (motion) gsap.to(card, { y: 40, scale: 0.95, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => setShownId(null) });
      else setShownId(null);
    },
    { scope: ref, dependencies: [quickId] },
  );

  const p = shownId ? PRODUCTS_BY_ID[shownId] : null;

  return (
    <div
      className={shownId ? 'ql open' : 'ql'}
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qlTitle"
      aria-hidden={!shownId || undefined}
      onClick={(e) => e.target === e.currentTarget && closeQuick()}
    >
      <Glass refract className="ql-card" style={p ? ({ '--h': p.hue } as CSSProperties) : undefined}>
        {p && (
          <>
            <Glass as="button" className="icon-btn ql-close" aria-label="Close quick look" onClick={closeQuick}>
              <XIcon />
            </Glass>
            <div className="ql-art" ref={artRef}>
              <ProductArt kind={p.art} hue={p.hue} />
            </div>
            <div className="ql-info">
              {p.tag && <span className="eyebrow">{p.tag}</span>}
              <h3 id="qlTitle">{p.name}</h3>
              <p>{p.line}</p>
              <span className="mono ql-spec">{p.spec}</span>
              <Meters product={p} big />
              <div className="ql-buy">
                <span className="price">{formatRupiah(p.price)}</span>
                <button className="btn btn-solid" onClick={() => addToBag(p.id, artRef.current)}>
                  <PlusIcon />
                  Add to bag
                </button>
              </div>
              <span className="mono ql-install">or {formatRupiah(p.price / 12)} / month for 12 months at 0%</span>
            </div>
          </>
        )}
      </Glass>
    </div>
  );
}
