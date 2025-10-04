import { ArrowRight, Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(sectionRef, { threshold: 0.3, freezeOnceVisible: true });
  const isVisible = !!entry?.isIntersecting;
  const [email, setEmail] = useState('');

  const trustIndicators = [
    'No credit card required',
    'Start creating in 60 seconds',
    'Free tier forever',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-pearl/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pearl/30 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div
          className={`transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-display font-display font-bold text-gradient mb-8 leading-tight">
            READY TO EXPERIENCE
            <br />
            TRUE INTELLIGENCE?
          </h2>
        </div>

        <div
          className={`transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-h3 text-silver mb-12 font-light">
            Join thousands of teams building the future with AI
          </p>
        </div>

        <div
          className={`transition-all duration-987 ease-ai-emerge ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 glass px-6 py-4 rounded-full text-pearl placeholder-ash focus-ring font-mono text-base"
                required
              />
              <button type="submit" className="btn-primary group whitespace-nowrap">
                <span className="flex items-center gap-2">
                  Begin Journey
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-silver text-sm">
            {trustIndicators.map((indicator, index) => (
              <div
                key={indicator}
                className="flex items-center gap-2 animate-in"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <Check className="w-4 h-4 text-green-400" />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
