'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Glass } from '@/components/glass/Glass';
import { gsap, MQ, useGSAP } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Alerts() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from('.alerts', {
          y: 80, scale: 0.94, rotationX: 10, transformPerspective: 1000, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '.alerts', start: 'top 90%' },
        });
      });
    },
    { scope: ref },
  );

  const shake = contextSafe(() => {
    if (motionAllowed()) gsap.fromTo('.sub-form', { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1.4,.2)' });
  });
  const rise = contextSafe(() => {
    if (motionAllowed()) gsap.from('.sub-note', { y: 10, opacity: 0, duration: 0.5 });
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL.test(v)) {
      setNote({ ok: false, text: 'Enter an email address like name@example.com.' });
      shake();
      return;
    }
    setNote({ ok: true, text: `Done. We'll write to ${v} when the next drop goes live.` });
    setEmail('');
    requestAnimationFrame(rise);
  };

  return (
    <section className="section wrap" id="alerts" ref={ref}>
      <Glass refract className="alerts">
        <div>
          <span className="eyebrow">Drop alerts</span>
          <h2 data-reveal>Hear about the next drop first.</h2>
          <p>One email when a release goes live, plus early access to trade-in pricing. No other mail.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <Glass className="sub-form">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={note?.ok === false || undefined}
              aria-describedby="subNote"
            />
            <button className="btn btn-solid" type="submit">
              Notify me
            </button>
          </Glass>
          <p className={note?.ok ? 'sub-note ok' : 'sub-note'} id="subNote" aria-live="polite">
            {note?.text}
          </p>
        </form>
      </Glass>
    </section>
  );
}
