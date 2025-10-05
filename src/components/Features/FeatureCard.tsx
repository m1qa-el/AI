import { type LucideIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, className = '', delay = 0 }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(cardRef, { threshold: 0.2, freezeOnceVisible: true });
  const isVisible = !!entry?.isIntersecting;

  return (
    <div
      ref={cardRef}
      className={`glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-610 ease-ai-glide hover:shadow-glow group cursor-pointer animate-float ${className} ${
        isVisible ? 'animate-in' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-2xl bg-pearl/10 flex items-center justify-center mb-6 transition-all duration-610 ${
            isHovered ? 'scale-110 rotate-12' : ''
          }`}
        >
          <Icon
            className={`w-8 h-8 text-pearl transition-all duration-610 ${
              isHovered ? 'scale-110' : ''
            }`}
          />
        </div>

        <h3 className="text-h4 font-display font-bold text-pearl mb-3">{title}</h3>
        <p className="text-silver text-body leading-relaxed mb-4">{description}</p>

        <div
          className={`flex items-center gap-2 text-pearl font-medium text-sm transition-all duration-377 ${
            isHovered ? 'translate-x-2' : ''
          }`}
        >
          <span>Learn more</span>
          <svg
            className={`w-4 h-4 transition-transform duration-377 ${isHovered ? 'translate-x-1' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div
        className={`absolute inset-0 rounded-3xl border transition-all duration-610 pointer-events-none ${
          isHovered ? 'border-pearl/30 shadow-glow' : 'border-transparent'
        }`}
      />
    </div>
  );
};
