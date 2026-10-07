# Refract — liquid-glass tech store

A one-page demo storefront for a fictional Jakarta gadget shop, built to show off GSAP motion on
liquid-glass UI: a loader, a SplitText hero intro with pointer parallax, a velocity-boosted marquee,
Flip-animated filters, a pinned horizontal "Drop" rail, fly-to-cart, a radial quick-action menu,
a cart drawer and a quick-look dialog. Products, prices and delivery promises are made up.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck && pnpm lint && pnpm test
```

## Structure

```
app/                 layout, page, glass.css (glass system), globals.css (tokens + sections)
components/glass     Glass (polymorphic surface) + LiquidFilter (#liquid SVG displacement)
components/layout    Nav, Footer, Loader, Aurora, GlobalPointer, StoreHydrator
components/sections  Hero, Marquee, ShopSection, DropRail, Alerts
components/overlays  CartDrawer, QuickLook, RadialMenu, Toaster, Overlays (scrim + Escape)
components/motion    GlobalMotion (heading reveals, wobble, magnetic, cursor lens)
components/ui        ProductArt (SVG illustrations), Meters, icons
lib/                 products, format, gsap setup, motion hooks, flyToCart, addToBag
store/               cart (zustand + localStorage "refract-cart"), ui
reference/           the original HTML prototype and the phase prompts
tests/               vitest: formatRupiah, cart selectors and store
```

## Add a product

1. Append an entry to `PRODUCTS` in `lib/products.ts` (`id`, `name`, `cat`, `tag`, `price` in rupiah,
   `art`, `hue` 0–360, meters `m` = `[battery, power, portability]`, `line`, `spec`).
2. `art` must be one of the `ArtKind` illustrations in `components/ui/ProductArt.tsx`; add a new
   shape there if needed.
3. To feature it in The Drop, add `{ id, when, copy }` to `DROP`.
4. Update the "Browse all 9" / "Nine devices" copy if the count changes.

## Notes

- Refraction (`backdrop-filter: url(#liquid)`) only works in Chromium; Safari and Firefox get frosted blur.
- `prefers-reduced-motion: reduce` skips the loader and every animation; the Drop rail falls back to native
  horizontal scroll with snap.
