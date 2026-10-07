'use client';

import { useRef } from 'react';
import { Glass } from '@/components/glass/Glass';
import { BagIcon } from '@/components/ui/icons';
import { CART_BUTTON_ID } from '@/lib/actions';
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { cartCount, useCart } from '@/store/cart';
import { useUI } from '@/store/ui';

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bff0ff" />
          <stop offset=".55" stopColor="#8fe3ff" />
          <stop offset="1" stopColor="#b9a2ff" />
        </linearGradient>
      </defs>
      <path d="M16 2 29 16 16 30 3 16Z" fill="url(#lg-logo)" />
      <path d="M16 2 16 30 3 16Z" fill="#fff" opacity=".35" />
      <path d="M3 16h26" stroke="#071029" strokeOpacity=".25" />
    </svg>
  );
}

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const n = useCart((s) => cartCount(s.items));
  const pulse = useUI((s) => s.bagPulse);
  const openDrawer = useUI((s) => s.openDrawer);

  // shrink after 80px of scroll
  useGSAP(() => {
    ScrollTrigger.create({
      start: 80,
      end: 'max',
      onToggle: (s) => ref.current?.classList.toggle('scrolled', s.isActive),
    });
  });

  // badge pop + button wiggle whenever something lands in the bag
  useGSAP(
    () => {
      if (!pulse) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo('.badge', { scale: 0.3 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1.2,.4)' });
        gsap.fromTo('.cart-btn', { rotation: -8 }, { rotation: 0, duration: 0.8, ease: 'elastic.out(1.4,.3)' });
      });
    },
    { scope: ref, dependencies: [pulse] },
  );

  return (
    <Glass as="header" refract className="nav" id="nav" ref={ref}>
      <a className="logo" href="#top" aria-label="Refract home">
        <Logo />
        Refract
      </a>
      <nav className="nav-links" aria-label="Sections">
        <a href="#shop">Shop</a>
        <a href="#drop">The Drop</a>
        <a href="#alerts">Drop alerts</a>
      </nav>
      <button
        id={CART_BUTTON_ID}
        className="btn btn-solid cart-btn magnetic"
        aria-label={`Open bag, ${n} item${n === 1 ? '' : 's'}`}
        onClick={openDrawer}
      >
        <BagIcon />
        <span className="cart-label">Bag</span>
        <span className="badge">{n || ''}</span>
      </button>
    </Glass>
  );
}
