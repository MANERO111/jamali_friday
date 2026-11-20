import Hero from './components/hero';
import VisageShowcase from './components/VisageShowcase';
import FAQ from './components/faq';
import CorpsShowcase from './components/CorpsShowcase';
// Default discount section (kept intact)
// import DiscountShowcase from './components/DiscountShowcase';

// Black Friday special sections (Comment these and uncomment DiscountShowcase after Black Friday ends)
import BlackFridayShowcase from './components/BlackFridayShowcase';
import BlackFridayBannerSection from './components/BlackFridayBannerSection';

import BrandsSlider from './components/BrandsSlider';
import CapillaireShowcase from './components/CapillaireShowcase';
import HygieneShowcase from './components/hygieneShowcase';


export default function Home() {
  return (
    <main className="bg-[#F9F6F3] min-h-screen pb-0">
      <Hero />

      {/* Black Friday Product Showcase */}
      <BlackFridayShowcase />
      {/* <DiscountShowcase /> */}

      <BrandsSlider />
      <VisageShowcase />

      {/* Black Friday Spotlight & Perks Section */}
      <BlackFridayBannerSection />

      <CorpsShowcase />
      <CapillaireShowcase />
      <HygieneShowcase />
      <FAQ />
    </main>
  );
}


