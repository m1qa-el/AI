import { Hero } from './components/Hero/Hero';
import { Navigation } from './components/Navigation/Navigation';
import { Features } from './components/Features/Features';
import { Stats } from './components/Stats/Stats';
import { Pricing } from './components/Pricing/Pricing';
import { CTA } from './components/CTA/CTA';
import { FullPageContainer } from './components/FullPage/FullPageContainer';
import { Section } from './components/FullPage/Section';

function App() {
  return (
    <>
      <Navigation />
      <FullPageContainer transitionDuration={600}>
        <Section id="hero" className="relative min-h-screen">
          <Hero />
        </Section>

        <Section id="features" className="relative min-h-screen">
          <Features />
        </Section>

        <Section id="stats" className="relative min-h-screen">
          <Stats />
        </Section>

        <Section id="pricing" className="relative min-h-screen">
          <Pricing />
        </Section>

        <Section id="cta" className="relative min-h-screen">
          <CTA />
        </Section>

        <Section id="footer" className="relative min-h-screen flex items-center justify-center">
          <footer className="relative py-12 px-6 w-full">
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
        </Section>
      </FullPageContainer>
    </>
  );
}

export default App;
