export type Category = 'phones' | 'computing' | 'audio' | 'wearables' | 'home';
export type ArtKind =
  | 'phone'
  | 'laptop'
  | 'tablet'
  | 'buds'
  | 'headphones'
  | 'watch'
  | 'ring'
  | 'speaker'
  | 'projector';

export type Product = {
  id: string;
  name: string;
  cat: Category;
  tag: string | null;
  /** Price in rupiah. */
  price: number;
  art: ArtKind;
  /** Base hue (0–360) for the art gradients and card glow. */
  hue: number;
  /** Meter values for Battery, Power, Portability (0–100). */
  m: [number, number, number];
  line: string;
  spec: string;
};

export type DropItem = { id: string; when: string; copy: string };

export const METERS = ['Battery', 'Power', 'Portability'] as const;

export const PRODUCTS: Product[] = [
  { id: 'halo3', name: 'Halo 3 Pro', cat: 'phones', tag: 'New', price: 18999000, art: 'phone', hue: 205, m: [82, 94, 74],
    line: 'A 6.3″ 120 Hz phone with a 50 MP periscope camera and a frosted glass back.', spec: '6.3″ OLED · 256 GB · 5,000 mAh' },
  { id: 'slate14', name: 'Slate Book 14', cat: 'computing', tag: 'Drop', price: 24499000, art: 'laptop', hue: 252, m: [90, 88, 70],
    line: 'A 1.2 kg aluminium laptop that runs 18 hours on one charge.', spec: '14″ 2.8K · 16 GB · 1 TB SSD' },
  { id: 'atlas11', name: 'Atlas Tab 11', cat: 'computing', tag: null, price: 9799000, art: 'tablet', hue: 168, m: [78, 66, 88],
    line: 'Paper-textured 11″ tablet for notes, sketching and reading. Stylus included.', spec: '11″ LCD · 128 GB · stylus' },
  { id: 'drift2', name: 'Drift Buds 2', cat: 'audio', tag: 'Best seller', price: 2799000, art: 'buds', hue: 192, m: [72, 60, 98],
    line: 'Noise-cancelling earbuds. The case refills them in 15 minutes.', spec: 'ANC · 32 h with case · IPX5' },
  { id: 'echo', name: 'Echo Over-Ear', cat: 'audio', tag: null, price: 5499000, art: 'headphones', hue: 318, m: [96, 70, 46],
    line: 'Over-ear headphones with memory-foam cushions and spatial audio.', spec: '40 mm drivers · 60 h · USB-C' },
  { id: 'orbit', name: 'Orbit Watch S', cat: 'wearables', tag: 'New', price: 6299000, art: 'watch', hue: 142, m: [58, 62, 96],
    line: 'Sapphire-glass smartwatch that tracks sleep, heart rate and swim laps.', spec: '1.9″ AMOLED · 5 ATM · GPS' },
  { id: 'pulse', name: 'Pulse Ring', cat: 'wearables', tag: null, price: 4199000, art: 'ring', hue: 44, m: [86, 38, 100],
    line: 'A 4-gram titanium ring that reads sleep and recovery overnight.', spec: 'Titanium · 7-day battery · 100 m' },
  { id: 'tide', name: 'Tide Speaker', cat: 'home', tag: null, price: 3199000, art: 'speaker', hue: 280, m: [64, 74, 52],
    line: '360° room speaker with a glowing crown. Pair two for stereo.', spec: '360° · Wi-Fi + BT · 24 h' },
  { id: 'beam', name: 'Beam Mini Projector', cat: 'home', tag: 'Drop', price: 7899000, art: 'projector', hue: 18, m: [40, 72, 80],
    line: 'Fits in a tote bag and throws a 100″ picture onto any wall.', spec: '1080p · 500 lm · 2.5 h' },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const CATEGORIES: [Category | 'all', string][] = [
  ['all', 'All'],
  ['phones', 'Phones'],
  ['computing', 'Computing'],
  ['audio', 'Audio'],
  ['wearables', 'Wearables'],
  ['home', 'Home'],
];

export const DROP: DropItem[] = [
  { id: 'halo3', when: 'Out now', copy: 'The periscope lens moves inside the frame, so the phone stays flat while the camera reaches 5× optical zoom.' },
  { id: 'slate14', when: 'Ships 14 Oct', copy: 'A machined unibody, a 2.8K matte screen and a battery that lasts a full working day plus the commute home.' },
  { id: 'echo', when: 'Ships 21 Oct', copy: 'Memory-foam cushions, 60 hours of playback and noise cancelling tuned for Jakarta traffic.' },
  { id: 'orbit', when: 'Ships 28 Oct', copy: 'A sapphire face, a swim mode that counts laps by itself and a band you swap without tools.' },
];

export const MARQUEE_ITEMS = [
  'Free 2-hour delivery in Jakarta',
  '0% installments for 12 months',
  'Two-year warranty on everything',
  'Trade in any phone',
  'Pick up in Kemang',
  'Tested before it ships',
];

export type MeterLevel = 'good' | 'warn' | 'bad';
export const meterLevel = (v: number): MeterLevel => (v >= 70 ? 'good' : v >= 45 ? 'warn' : 'bad');
