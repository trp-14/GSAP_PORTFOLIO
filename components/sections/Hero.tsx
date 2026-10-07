'use client';

import { useEffect, useRef, useState } from 'react';
import { Glass } from '@/components/glass/Glass';
import { ArrowIcon } from '@/components/ui/icons';
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { useUI } from '@/store/ui';

const jakartaTime = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date());

function JakartaClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(jakartaTime());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 20000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return (
    <div className="dv-time" suppressHydrationWarning>
      {time ?? '--:--'}
    </div>
  );
}

function DeviceMock() {
  return (
    <Glass refract className="device" id="device">
      <div className="device-in">
        <div className="island" />
        <div className="dv-city">Jakarta</div>
        <JakartaClock />
        <div className="dv-tiles">
          <Glass className="tile">
            <span>Battery</span>
            <b>82%</b>
          </Glass>
          <Glass className="tile">
            <span>Storage</span>
            <b>256 GB</b>
          </Glass>
          <Glass className="tile wide">
            <span>
              Now playing
              <br />
              <b style={{ fontSize: '.95rem' }}>Glasshouse</b>
            </span>
            <span className="eq">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </Glass>
        </div>
      </div>
    </Glass>
  );
}

function SpecChip({ cls, depth, label, value }: { cls: string; depth: number; label: string; value: string }) {
  return (
    <Glass className={`chip ${cls}`} data-depth={depth}>
      <small>{label}</small>
      <b>{value}</b>
    </Glass>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const nav = document.getElementById('nav'); // outside this component's scope
        const split = SplitText.create('#heroTitle', { type: 'words,chars', mask: 'words', maskClass: 'split-mask' });

        gsap.set(split.chars, { yPercent: 115, rotation: 8 });
        gsap.set('.hero-fade', { y: 30, opacity: 0 });
        gsap.set(nav, { y: -90, opacity: 0 });
        gsap.set('#device', { y: 160, rotationX: 35, rotationY: -20, scale: 0.85, opacity: 0 });
        gsap.set('.chip', { scale: 0 });
        gsap.set('.halo', { scale: 0.6, opacity: 0 });

        const floatIdle = () => {
          gsap.to('#device', { y: -14, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          gsap.utils.toArray<HTMLElement>('.chip').forEach((c, i) =>
            gsap.to(c, { y: i % 2 ? 12 : -12, duration: 2.4 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          );
        };

        intro.current = gsap
          .timeline({ paused: true, defaults: { ease: 'expo.out' } })
          .to(nav, { y: 0, opacity: 1, duration: 1.1 })
          .to(split.chars, { yPercent: 0, rotation: 0, duration: 1.1, stagger: 0.022 }, 0.05)
          .to('.halo', { scale: 1, opacity: 1, duration: 1.6, stagger: 0.1 }, 0.15)
          .to('#device', { y: 0, rotationX: 0, rotationY: 0, scale: 1, opacity: 1, duration: 1.6 }, 0.2)
          .to('.hero-fade', { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.45)
          .to('.chip', { scale: 1, duration: 1, stagger: 0.12, ease: 'elastic.out(1,.55)' }, 0.8)
          .add(() => {
            split.revert(); // drop the word masks so the <em> glow isn't clipped
            floatIdle();
            ScrollTrigger.refresh();
          });

        // ambient loops
        gsap.to('.halo', { rotation: 360, duration: 18, repeat: -1, ease: 'none' });
        gsap.to('.halo.h2', { rotation: -360, duration: 26, repeat: -1, ease: 'none', overwrite: true });
        gsap.utils.toArray<HTMLElement>('.eq i').forEach((b, i) =>
          gsap.fromTo(b, { scaleY: 0.2 }, { scaleY: 1, duration: 0.35 + i * 0.07, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.1 }),
        );

        // scroll scrub
        gsap.to('#stage', {
          yPercent: 14, scale: 0.9, rotation: -4, ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-copy', {
          yPercent: -10, opacity: 0.3, ease: 'none',
          scrollTrigger: { trigger: ref.current, start: '30% top', end: 'bottom top', scrub: true },
        });

        return () => {
          intro.current = null;
        };
      });

      // pointer parallax: device tilt + chips by depth
      mm.add(MQ.fine, () => {
        const hero = ref.current!;
        const rx = gsap.quickTo('#device', 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo('#device', 'rotationY', { duration: 0.8, ease: 'power3' });
        const chips = gsap.utils.toArray<HTMLElement>('.chip').map((c) => ({
          d: Number(c.dataset.depth),
          x: gsap.quickTo(c, 'x', { duration: 1, ease: 'power3' }),
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          rx(-ny * 16);
          ry(nx * 22);
          chips.forEach((o) => o.x(nx * 40 * o.d));
        };
        const leave = () => {
          rx(0);
          ry(0);
          chips.forEach((o) => o.x(0));
        };
        hero.addEventListener('pointermove', move);
        hero.addEventListener('pointerleave', leave);
        return () => {
          hero.removeEventListener('pointermove', move);
          hero.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: ref },
  );

  // play the intro once the loader hands over
  useEffect(() => {
    const play = () => intro.current?.play();
    if (useUI.getState().introReady) play();
    return useUI.subscribe((s, prev) => {
      if (s.introReady && !prev.introReady) play();
    });
  }, []);

  return (
    <section className="hero wrap" ref={ref}>
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-fade">Jakarta · Autumn drop 2026</span>
          <h1 id="heroTitle">
            Tech you can <em>see through.</em>
          </h1>
          <p className="hero-sub hero-fade">
            Phones, laptops, audio and wearables, delivered across Jakarta in two hours with a two-year warranty on
            everything.
          </p>
          <div className="hero-ctas hero-fade">
            <a className="btn btn-solid magnetic" href="#drop">
              Shop the drop
              <ArrowIcon />
            </a>
            <Glass as="a" className="btn magnetic" href="#shop">
              Browse all 9
            </Glass>
          </div>
          <div className="hero-meta mono hero-fade">
            <span>
              <b>0%</b> installments, 12 months
            </span>
            <span>
              <b>2 h</b> delivery
            </span>
            <span>
              <b>Trade-in</b> any phone
            </span>
          </div>
        </div>

        <div className="stage" id="stage" aria-hidden="true">
          <div className="halo" />
          <div className="halo h2" />
          <DeviceMock />
          <SpecChip cls="ch1" depth={1.4} label="display" value="120 Hz" />
          <SpecChip cls="ch2" depth={-1.2} label="battery" value="5,000 mAh" />
          <SpecChip cls="ch3" depth={0.9} label="Halo 3 Pro" value="Rp 18.999.000" />
        </div>
      </div>
    </section>
  );
}
