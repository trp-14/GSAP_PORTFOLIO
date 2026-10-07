/** Refraction filter used by `.glass.refract > .lg`. Must stay in the DOM (zero-size, never display:none). */
export function LiquidFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves={2} seed={11} result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2.2" result="soft" />
        <feDisplacementMap id="disp" in="SourceGraphic" in2="soft" scale={42} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
