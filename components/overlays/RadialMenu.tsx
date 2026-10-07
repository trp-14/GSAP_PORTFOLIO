'use client';

import { useEffect, useRef, type ComponentType, type SVGProps } from 'react';
import { Glass } from '@/components/glass/Glass';
import { BagIcon, EyeIcon, HeartIcon } from '@/components/ui/icons';
import { addToBag } from '@/lib/actions';
import { gsap, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';
import { PRODUCTS_BY_ID } from '@/lib/products';
import { restoreFocus, useUI } from '@/store/ui';

type Act = 'add' | 'wish' | 'quick';
const ITEMS: { act: Act; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { act: 'add', label: 'Add', Icon: BagIcon },
  { act: 'wish', label: 'Save', Icon: HeartIcon },
  { act: 'quick', label: 'Look', Icon: EyeIcon },
];
const ANGLES = [110, 160, 210].map((a) => (a * Math.PI) / 180);
const R = 82;
/** Fan downwards like the prototype; mirror upwards when the button sits near the bottom of the viewport. */
const offset = (i: number, up: boolean) => {
  const y = Math.sin(ANGLES[i]) * R + 40;
  return { x: Math.cos(ANGLES[i]) * R, y: up ? -y : y };
};

/** Three glass actions that fan out from a card's ⋯ button. Fixed-positioned at the button centre. */
export function RadialMenu() {
  const ref = useRef<HTMLDivElement>(null);
  const radial = useUI((s) => s.radial);
  const open = !!radial;

  useGSAP(
    () => {
      const btns = gsap.utils.toArray<HTMLElement>('.rad-btn');
      const motion = motionAllowed();
      if (radial) {
        const up = radial.y > innerHeight - 150;
        btns.forEach((b, i) => {
          const { x, y } = offset(i, up);
          if (motion) gsap.fromTo(b, { x: 0, y: 0, scale: 0, rotation: -90 }, { x, y, scale: 1, rotation: 0, duration: 0.65, delay: i * 0.06, ease: 'back.out(2.2)', overwrite: true });
          else gsap.set(b, { x, y, scale: 1, rotation: 0 });
        });
        const t = setTimeout(() => btns[0]?.focus(), 30);
        return () => clearTimeout(t);
      }
      if (motion) gsap.to(btns, { x: 0, y: 0, scale: 0, duration: 0.3, stagger: 0.03, ease: 'power3.in', overwrite: true });
      else gsap.set(btns, { x: 0, y: 0, scale: 0 });
    },
    { scope: ref, dependencies: [radial] },
  );

  // close on outside press or scroll
  useEffect(() => {
    if (!open) return;
    const close = () => useUI.getState().closeRadial();
    const startY = window.scrollY;
    // ignore tiny scrolls (touch jitter, focus scrolling)
    const onScroll = () => Math.abs(window.scrollY - startY) > 8 && close();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!t.closest('.radial') && !t.closest('[data-act="radial"]')) close();
    };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  const run = (act: Act) => {
    const ui = useUI.getState();
    const id = ui.radial?.id;
    if (!id) return;
    if (act === 'quick') return ui.openQuick(id);
    ui.closeRadial();
    restoreFocus();
    if (act === 'add') addToBag(id, document.querySelector(`.card[data-id="${id}"] .card-art`));
    if (act === 'wish') {
      const on = ui.toggleWish(id);
      const name = PRODUCTS_BY_ID[id].name;
      ui.showToast(on ? `${name} saved to your wishlist` : `${name} removed from your wishlist`);
    }
  };

  return (
    <div
      className={open ? 'radial open' : 'radial'}
      ref={ref}
      role="menu"
      aria-label="Quick actions"
      aria-hidden={!open || undefined}
      style={radial ? { left: radial.x, top: radial.y } : undefined}
    >
      {ITEMS.map(({ act, label, Icon }) => (
        <Glass
          as="button"
          refract
          key={act}
          className="rad-btn"
          role="menuitem"
          aria-label={label}
          tabIndex={open ? 0 : -1}
          onClick={() => run(act)}
        >
          <Icon />
          <span className="lbl" aria-hidden="true">
            {label}
          </span>
        </Glass>
      ))}
    </div>
  );
}
