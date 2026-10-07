import { Footer } from '@/components/layout/Footer';
import { Loader } from '@/components/layout/Loader';
import { Nav } from '@/components/layout/Nav';
import { StoreHydrator } from '@/components/layout/StoreHydrator';
import { GlobalMotion } from '@/components/motion/GlobalMotion';
import { Overlays } from '@/components/overlays/Overlays';
import { Alerts } from '@/components/sections/Alerts';
import { DropRail } from '@/components/sections/DropRail';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { ShopSection } from '@/components/sections/ShopSection';

export default function Home() {
  return (
    <>
      <StoreHydrator />
      <Loader />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <ShopSection />
        <DropRail />
        <Alerts />
      </main>
      <Footer />
      <Overlays />
      {/* keep last: creates triggers after every section has mounted */}
      <GlobalMotion />
    </>
  );
}
