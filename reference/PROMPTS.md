# Prompt urutan build — Refract (Claude Code)

## Persiapan (sekali)

```bash
pnpm create next-app@latest refract --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd refract
pnpm add gsap @gsap/react zustand
mkdir reference
# copy CLAUDE.md ke root proyek, refract-prototype.html ke reference/
git init && git add -A && git commit -m "scaffold"
claude
```

Tips pakai Claude Code:
- Jalankan **satu fase per prompt**. Setelah tiap fase: cek di browser, lalu `git commit`. Kalau hasil melenceng, `/rewind` atau `git restore` lebih murah daripada tambal-sulam.
- Untuk fase berat (3, 5, 6) mulai dengan **plan mode** (Shift+Tab dua kali) supaya Claude menulis rencana dulu, kamu review, baru eksekusi.
- Selalu sebut "lihat `reference/refract-prototype.html`" — itu yang bikin hasilnya mirip.
- `/clear` di antara fase kalau konteks sudah panjang; CLAUDE.md akan dibaca ulang otomatis.

---

## Fase 1 — Fondasi, tokens, glass system

```
Baca CLAUDE.md dan reference/refract-prototype.html.

Fase 1: fondasi saja.
1. Setup font via next/font/google (Bricolage Grotesque, Geist, Geist Mono) sebagai CSS variable.
2. globals.css: tokens dari CLAUDE.md, body background --ink, overflow-x: clip, focus ring.
3. glass.css: port PERSIS aturan .glass, .lg, .refract, ::before specular, ::after rim dari prototipe. Ikuti 6 jebakan di CLAUDE.md.
4. components/glass/LiquidFilter.tsx (svg filter #liquid) dan components/glass/Glass.tsx: komponen polimorfik
   props { as?, refract?, radius?, className, ...rest } yang selalu merender <span className="lg"/> sebagai anak pertama.
5. lib/gsap.ts: 'use client', register ScrollTrigger, Flip, SplitText. lib/motion.ts: useReducedMotion, usePointerFine.
6. Satu listener pointermove global (client component di layout) untuk --mx/--my specular.
7. components/layout/Aurora.tsx: 5 blob + layer dot grid (statis dulu, animasi di fase 6).
8. page.tsx sementara: tampilkan 3 contoh Glass (biasa, refract, button) di atas aurora untuk uji visual.

Jalankan typecheck, lint, build. Tunjukkan file apa saja yang dibuat.
```

## Fase 2 — Data, util, store

```
Fase 2.
1. lib/products.ts: tipe dari CLAUDE.md, salin 9 PRODUCTS dan 4 DROP persis dari prototipe (nama, harga, hue, m, tag, line, spec, copy).
2. lib/format.ts: formatRupiah(n) → "Rp 18.999.000" (Intl id-ID, dibulatkan).
3. components/ui/ProductArt.tsx: port fungsi art() prototipe jadi komponen SVG per ArtKind, id gradien pakai useId().
4. components/ui/icons.tsx: dots, bag, heart, eye, plus, minus, x, arrow.
5. store/cart.ts (zustand + persist 'refract-cart') dan store/ui.ts sesuai CLAUDE.md. Tambah hook useHydrated untuk hindari mismatch.
6. Tulis unit test kecil (vitest) untuk formatRupiah dan selector subtotal/count.
```

## Fase 3 — Layout statis semua section (tanpa animasi)

```
Fase 3: bangun semua section STATIS (belum ada GSAP), mirip prototipe di 1280px dan 400px.
Nav (glass refract, pill, link Shop/The Drop/Drop alerts, tombol Bag + badge),
Hero (copy kiri, stage kanan: 2 halo, DeviceMock glass dengan jam Asia/Jakarta live, 3 SpecChip),
Marquee (glass strip, item diduplikasi 2x),
ShopSection (heading, FilterBar chip aria-pressed, count, grid auto-fill minmax(260px,1fr), ProductCard + Meters),
DropRail (header + track horizontal overflow-x auto dengan scroll-snap sebagai fallback + progress bar),
Alerts (form email dengan validasi & pesan sukses, preventDefault),
Footer ("Refract is a demo storefront...").
Filter berfungsi tanpa animasi dulu (toggle class is-out). Add to bag langsung update store.
Cek tidak ada horizontal scroll di 400px.
```

## Fase 4 — Cart drawer, quick look, radial menu, toast

```
Fase 4: overlay & interaksi (masih tanpa GSAP, pakai CSS transition).
- CartDrawer: glass refract kanan, inert saat tertutup, scrim, daftar CartLine (art mini, nama, harga, qty -/+),
  subtotal, "Delivery in Jakarta: Free, within 2 hours", cicilan 0% /12, tombol Check out → toast demo.
  Empty state dengan tombol "Browse the lineup".
- QuickLook: dialog glass refract 2 kolom (1 kolom di mobile), meter besar dengan angka, harga + cicilan, Add to bag.
- RadialMenu: dibuka dari tombol ⋯ kartu, posisi fixed di tengah tombol, 3 aksi Add/Save/Look. Save toggle wishlist (hati di kartu).
- Toaster: pill glass bawah tengah, auto hide 2.6s.
- Keyboard: Escape menutup radial → quick look → drawer. Fokus dikelola sesuai CLAUDE.md.
```

## Fase 5 — Animasi inti GSAP

```
Fase 5 (pakai plan mode dulu). Tambahkan animasi sesuai tabel "Spesifikasi animasi" di CLAUDE.md, pakai useGSAP + gsap.matchMedia.
Urutan:
1. Loader (komponen client, hanya saat motion diizinkan) → saat selesai panggil hero intro + ScrollTrigger.refresh().
2. Hero intro (SplitText chars dengan mask per kata), idle float, pointer parallax (quickTo), scroll scrub.
3. Heading word reveal di semua h2 bertanda data-reveal.
4. Kartu: ScrollTrigger.batch reveal + isi meter + art elastic; tilt & art parallax (pointer fine saja).
5. Filter dengan Flip (onEnter/onLeave/onComplete refresh).
6. Drawer, quick look, radial, toast: ganti transisi CSS ke tween GSAP (contextSafe).
7. flyToCart.ts: util yang menerima elemen SVG sumber dan elemen tombol bag, return Promise selesai; store di-update setelah promise.
Pastikan reduced motion: semua konten langsung terlihat, tidak ada loader.
```

## Fase 6 — Efek premium

```
Fase 6.
1. DropRail: pin + horizontal scrub + containerAnimation parallax art + progress bar. Fallback scroll-snap saat reduced motion.
   Tambah class has-pin di section hanya saat pin aktif.
2. Marquee: loop + boost dari scroll velocity (gsap.ticker, decay 0.93).
3. Aurora: drift blob random repeatRefresh + parallax scrub.
4. Liquid wobble: tween attr scale #disp saat hover nav/tombol utama/chip.
5. Magnetic button (.magnetic) dan Cursor lens glass refract (pointer fine saja).
6. Nav menyusut setelah scroll 80px.
Cek FPS di Chrome DevTools Performance; kalau drop, kurangi refract dulu sebelum mengurangi animasi.
```

## Fase 7 — QA & polish

```
Fase 7: QA.
- Bandingkan setiap section dengan reference/refract-prototype.html di 1280px dan 400px; sebutkan perbedaan lalu perbaiki.
- Uji Safari/Firefox fallback (tanpa url(#liquid)) tetap terlihat seperti frosted glass.
- Uji reduced motion (DevTools > Rendering > prefers-reduced-motion).
- Tidak ada error console, tidak ada hydration warning, tidak ada horizontal scroll.
- Lighthouse mobile: laporkan skor, perbaiki yang termurah dulu.
- Tulis README singkat: cara jalan, struktur, cara tambah produk.
```

---

## Opsional setelah selesai

- **Halaman detail produk** `/p/[id]` dengan shared-element transition: Flip dari kartu ke hero detail.
- **Data nyata**: pindahkan products ke PostgreSQL (Drizzle/Prisma) + Route Handler; cart tetap di client.
- **Checkout sungguhan**: Midtrans/Xendit (sandbox) kalau ingin dipakai sebagai portfolio piece yang lengkap.
- **Deploy** ke Vercel, tambahkan link live + GIF demo ke README untuk portfolio GitHub.
