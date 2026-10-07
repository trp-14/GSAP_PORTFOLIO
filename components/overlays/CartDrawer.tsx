'use client';

import { useRef, type CSSProperties } from 'react';
import { Glass } from '@/components/glass/Glass';
import { MinusIcon, PlusIcon, XIcon } from '@/components/ui/icons';
import { ProductArt } from '@/components/ui/ProductArt';
import { formatRupiah } from '@/lib/format';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';
import { PRODUCTS_BY_ID } from '@/lib/products';
import { cartCount, cartLines, cartSubtotal, useCart } from '@/store/cart';
import { restoreFocus, useUI } from '@/store/ui';

function CartLine({ id, qty }: { id: string; qty: number }) {
  const p = PRODUCTS_BY_ID[id];
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const pulse = useUI((s) => s.pulseBag);
  return (
    <Glass className="ln" style={{ '--h': p.hue } as CSSProperties}>
      <div className="ln-art">
        <ProductArt kind={p.art} hue={p.hue} />
      </div>
      <div>
        <div className="ln-name">{p.name}</div>
        <div className="ln-price">{formatRupiah(p.price)}</div>
      </div>
      <div className="qty">
        <button aria-label={`Remove one ${p.name}`} onClick={() => (dec(id), pulse())}>
          <MinusIcon />
        </button>
        <span aria-label={`Quantity ${qty}`}>{qty}</span>
        <button aria-label={`Add one ${p.name}`} onClick={() => (inc(id), pulse())}>
          <PlusIcon />
        </button>
      </div>
    </Glass>
  );
}

export function CartDrawer() {
  const ref = useRef<HTMLElement>(null);
  const open = useUI((s) => s.drawerOpen);
  const closeDrawer = useUI((s) => s.closeDrawer);
  const showToast = useUI((s) => s.showToast);
  const items = useCart((s) => s.items);
  const ids = cartLines(items);
  const sub = cartSubtotal(items);
  const wasOpen = useRef(false);

  useGSAP(
    () => {
      const el = ref.current!;
      if (open === wasOpen.current) return;
      wasOpen.current = open;
      const motion = motionAllowed();
      if (open) {
        if (motion) {
          gsap.fromTo(el, { x: el.offsetWidth + 30 }, { x: 0, duration: 0.6, ease: 'power4.out', clearProps: 'transform' });
          gsap.from('.ln, .empty', { x: 50, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.15 });
        }
        const t = setTimeout(() => el.querySelector<HTMLButtonElement>('.drawer-close')?.focus(), 60);
        return () => clearTimeout(t);
      }
      if (motion) gsap.fromTo(el, { x: 0 }, { x: el.offsetWidth + 30, duration: 0.6, ease: 'power3.inOut', clearProps: 'transform' });
      if (!useUI.getState().quickId) restoreFocus();
    },
    { scope: ref, dependencies: [open] },
  );

  const browse = () => {
    closeDrawer();
    document.getElementById('shop')?.scrollIntoView();
  };

  return (
    <Glass
      as="aside"
      refract
      className={open ? 'drawer open' : 'drawer'}
      aria-label="Your bag"
      inert={!open}
      ref={ref}
    >
      <div className="drawer-head">
        <h2>Your bag</h2>
        <Glass as="button" className="icon-btn drawer-close" aria-label="Close bag" onClick={closeDrawer}>
          <XIcon />
        </Glass>
      </div>
      <div className="drawer-list">
        {ids.length === 0 ? (
          <div className="empty">
            <p>Your bag is empty.</p>
            <Glass as="button" className="btn" onClick={browse}>
              Browse the lineup
            </Glass>
          </div>
        ) : (
          ids.map((id) => <CartLine key={id} id={id} qty={items[id]} />)
        )}
      </div>
      <div className="drawer-foot">
        <div className="row">
          <span>Subtotal</span>
          <strong>{formatRupiah(sub)}</strong>
        </div>
        <div className="row small">
          <span>Delivery in Jakarta</span>
          <span>Free, within 2 hours</span>
        </div>
        <div className="row small">
          <span>0% for 12 months</span>
          <span>{sub ? `${formatRupiah(sub / 12)} / month` : '–'}</span>
        </div>
        <button
          className="btn btn-solid wide"
          onClick={() =>
            showToast(cartCount(items) ? 'This is a demo store, so no order was placed.' : 'Add something to your bag first.')
          }
        >
          Check out
        </button>
      </div>
    </Glass>
  );
}
