import { Hero } from './components/Hero/Hero';
import { Navigation } from './components/Navigation/Navigation';
import { Features } from './components/Features/Features';
import { Stats } from './components/Stats/Stats';
import { CTA } from './components/CTA/CTA';

function App() {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Stats />
      <CTA />

      <footer className="relative py-12 px-6 border-t border-slate/20">
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
    </div>
  );
}

export default App;
