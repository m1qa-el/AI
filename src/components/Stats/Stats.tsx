import { useEffect, useState, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface StatProps {
  value: string;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatCard = ({ value, label, suffix = '', delay = 0 }: StatProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(cardRef, { threshold: 0.5 });
  const isVisible = entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);

      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value, hasAnimated]);

  const formatValue = (val: number): string => {
    if (value.includes('%')) {
      return val.toFixed(1);
    }
    if (value.includes('M')) {
      return (val / 1000000).toFixed(0);
    }
    if (value.includes('ms')) {
      return val.toFixed(0);
    }
    return val.toFixed(1);
  };

  return (
    <div
      ref={cardRef}
      className="group cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-center transition-transform duration-610 group-hover:scale-110">
        <div className="text-display font-display font-bold text-gradient glow-text mb-4">
          {isVisible ? formatValue(displayValue) : '0'}
          {suffix}
        </div>
        <div className="text-body text-silver font-mono uppercase tracking-wider">{label}</div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-610 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pearl/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export const Stats = () => {
  const stats = [
    { value: '99.9', suffix: '%', label: 'Uptime SLA', delay: 0 },
    { value: '10000000', suffix: 'M+', label: 'Decisions Daily', delay: 100 },
    { value: '47', suffix: 'ms', label: 'Response Time', delay: 200 },
    { value: '95', suffix: '%', label: 'Accuracy', delay: 300 },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pearl/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pearl/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-h1 font-display font-bold text-gradient mb-6">
            Performance That Speaks
          </h2>
          <p className="text-h4 text-silver max-w-2xl mx-auto font-light">
            Real metrics from real-world deployments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative">
          {stats.map((stat, index) => (
            <div key={stat.label} className="relative">
              <StatCard {...stat} />
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-8 w-px h-24 -translate-y-1/2">
                  <div className="w-full h-full bg-gradient-to-b from-transparent via-pearl/20 to-transparent animate-pulse-slow" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
