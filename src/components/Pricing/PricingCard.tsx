import { useState, useRef } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface PricingCardProps {
  plan: Plan;
  isAnnual: boolean;
  delay: number;
}

export const PricingCard = ({ plan, isAnnual, delay }: PricingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.2 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const displayPrice = price !== null ? (isAnnual ? price / 12 : price) : null;

  return (
    <div
      ref={cardRef}
      className={`relative perspective-1200 transition-all duration-610 ease-ai-emerge ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative h-full preserve-3d transition-transform duration-233 ease-out ${
          plan.highlighted ? 'lg:-mt-4 lg:mb-4' : ''
        }`}
        style={{
          transform: isHovered
            ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)',
        }}
      >
        {plan.highlighted && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pearl to-silver text-obsidian font-semibold text-sm shadow-glow">
              <Star className="w-4 h-4 fill-current" />
              <span>Most Popular</span>
            </div>
          </div>
        )}

        <div
          className={`relative h-full flex flex-col p-8 rounded-3xl transition-all duration-377 ${
            plan.highlighted
              ? 'glass-heavy border-2 border-pearl/20 shadow-depth-5'
              : 'glass border border-pearl/10 shadow-depth-3'
          } ${isHovered ? 'shadow-depth-6' : ''}`}
        >
          <div
            className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-377 pointer-events-none ${
              isHovered ? 'opacity-100' : ''
            }`}
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 50%)',
            }}
          />

          <div className="relative z-10">
            <h3 className="text-h3 font-display font-bold text-pearl mb-2">
              {plan.name}
            </h3>
            <p className="text-base text-silver mb-8 font-light">
              {plan.description}
            </p>

            <div className="mb-8">
              {displayPrice !== null ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-bold text-pearl">
                    ${Math.floor(displayPrice)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-silver text-sm">/month</span>
                    {isAnnual && (
                      <span className="text-green-400 text-xs font-semibold">
                        billed annually
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-pearl">
                    Custom
                  </span>
                </div>
              )}
            </div>

            <button
              className={`w-full mb-8 group ${
                plan.highlighted ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {plan.cta}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <div className="space-y-4">
              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 transition-all duration-233 hover:translate-x-1"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pearl/10 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-pearl" />
                  </div>
                  <span className="text-silver text-sm leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
