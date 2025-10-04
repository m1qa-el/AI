import { useEffect, useState } from 'react';
import { ArrowRight, Activity } from 'lucide-react';
import { NeuralCanvas } from './NeuralCanvas';
import { BlackHole } from './BlackHole';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [responseTime, setResponseTime] = useState(47);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setResponseTime((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.max(40, Math.min(60, newValue));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-texture">
      <BlackHole />
      <NeuralCanvas
        mouseInfluenceRadius={180}
        mouseInfluenceStrength={0.08}
        mouseInfluenceFalloff="smooth"
        animationSpeed={1.0}
      />

      <div className="absolute top-6 right-6 z-10 animate-in" style={{ animationDelay: '200ms' }}>
        <div className="glass px-6 py-3 rounded-full flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-pearl" />
            <span className="text-pearl text-sm font-mono">NEURAL LINK ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-pearl/20" />
          <span className="text-silver text-sm font-mono">{responseTime}ms</span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div
          className={`transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-display font-display font-bold text-gradient mb-6 leading-none">
            INTELLIGENCE
            <br />
            THAT
            <br />
            UNDERSTANDS
          </h1>
        </div>

        <div
          className={`transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-h3 text-silver max-w-3xl mx-auto mb-12 font-light">
            Advanced AI that adapts to your world, not the other way around
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <button className="btn-primary group">
            <span className="flex items-center gap-2">
              Experience AI
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <button className="btn-secondary">Watch Demo</button>
        </div>

        <div
          className={`mt-16 transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex flex-col items-center gap-2 animate-float">
            <span className="text-silver text-sm font-mono">Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-pearl to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian pointer-events-none" />
    </section>
  );
};
