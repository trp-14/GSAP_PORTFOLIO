@AGENTS.md

# Refract — project notes for Claude

Demo storefront (fictional products) built as a GSAP portfolio piece. Visual source of truth:
`reference/refract-prototype.html`. Build order and phase prompts: `reference/PROMPTS.md`.

## Stack
Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript · GSAP 3.15
(ScrollTrigger, Flip, SplitText) + `@gsap/react` · zustand · vitest. Tailwind is installed but the
styling is plain CSS ported from the prototype (`app/glass.css`, `app/globals.css`).

## Commands
`pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm test`

## Structure
- `app/` layout (fonts, `<LiquidFilter/>`, `<Aurora/>`, `<GlobalPointer/>`), page, CSS
- `components/glass` `Glass` (polymorphic, always renders `<span class="lg"/>` first) and the `#liquid` SVG filter
- `components/layout` Nav, Footer, Loader, Aurora, GlobalPointer, StoreHydrator
- `components/sections` Hero, Marquee, ShopSection, DropRail, Alerts
- `components/overlays` CartDrawer, QuickLook, RadialMenu, Toaster, Overlays (scrim + Escape)
- `components/motion/GlobalMotion` heading reveals, liquid wobble, magnetic buttons, cursor lens — rendered LAST in the page
- `lib/` products data + types, `formatRupiah`, gsap registration (`MQ` media queries), `flyToCart`, `addToBag`
- `store/cart.ts` persisted bag (`refract-cart`, `skipHydration`, rehydrated after mount); `store/ui.ts` overlays, wishlist, toast, intro flag

## Tokens
`--ink #060a1c` · `--fg #eef2ff` · `--muted #9ca8cf` · `--ice #8fe3ff` · `--violet #b9a2ff` ·
`--good #5be3a2` · `--warn #ffc65c` · `--bad #ff6f80` · fonts Bricolage Grotesque (display), Geist (body), Geist Mono.

## Glass: 6 jebakan (pitfalls)
1. `backdrop-filter` goes on the `.lg` child, never on `.glass` itself — otherwise `::before`/`::after` and content can't stack above it.
2. `.lg` must be the first child; content gets `position:relative; z-index:1` via `:where(.glass > *:not(.lg))`.
3. `glass.css` must load BEFORE component CSS: rules like `.chip`, `.rad-btn`, `.cursor` override `.glass{position:relative}`.
4. `url(#liquid)` in `backdrop-filter` is Chromium-only; the `.refract` rule must be a separate declaration so other browsers keep the plain blur.
5. The `#liquid` SVG must stay in the DOM with zero size — never `display:none`, or the filter disappears.
6. `overflow:hidden` on `.glass` clips children (radial labels) — override with `overflow:visible` where needed. Nested glass samples only its glass parent's backdrop.

## Animation rules
- Every animated component uses `useGSAP` + `gsap.matchMedia()` with `MQ.motion` / `MQ.fine`; reduced motion shows everything immediately, no loader.
- String selectors are scoped to the component ref — pass elements for anything outside (e.g. `#nav` from Hero).
- Loader → `useUI.setIntroReady()` → Hero plays its paused intro timeline → `ScrollTrigger.refresh()`.
- Flip filter: capture `Flip.getState` in the click handler, `Flip.from` in a `useGSAP` keyed on the filter.
- `addToBag` awaits `flyToCart` before updating the store; the nav reacts to `bagPulse`.
- DropRail adds `.has-pin` to `#drop` only while the pin is active; reduced motion keeps native scroll-snap.
