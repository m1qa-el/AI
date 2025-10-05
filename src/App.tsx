import { Hero } from './components/Hero/Hero';
import { Navigation } from './components/Navigation/Navigation';
import { Features } from './components/Features/Features';
import { Stats } from './components/Stats/Stats';
import { Pricing } from './components/Pricing/Pricing';
import { CTA } from './components/CTA/CTA';
import { FullPageScroll } from './components/FullPageScroll/FullPageScroll';

function App() {
  const sectionLabels = ['Home', 'Features', 'Stats', 'Pricing', 'Get Started'];

  return (
    <>
      <Navigation />
      <FullPageScroll sectionLabels={sectionLabels}>
        <Hero />
        <Features />
        <Stats />
        <Pricing />
        <section className="relative flex flex-col">
          <div className="flex-1">
            <CTA />
          </div>
          <footer className="relative py-8 px-6 border-t border-slate/20 mt-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-pearl font-display font-semibold text-xl">NEURAL</div>

                <div className="flex items-center gap-8">
                  <a href="#" className="text-silver hover:text-pearl transition-colors text-sm">
                    Privacy
                  </a>
                  <a href="#" className="text-silver hover:text-pearl transition-colors text-sm">
                    Terms
                  </a>
                  <a href="#" className="text-silver hover:text-pearl transition-colors text-sm">
                    Contact
                  </a>
                </div>

                <div className="text-silver text-sm font-mono">
                  © 2025 Neural AI. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </section>
      </FullPageScroll>
    </>
  );
}

export default App;
