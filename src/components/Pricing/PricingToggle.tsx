import { Sparkles } from 'lucide-react';

interface PricingToggleProps {
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}

export const PricingToggle = ({ isAnnual, setIsAnnual }: PricingToggleProps) => {
  const savings = 17;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => setIsAnnual(false)}
        className={`px-6 py-2.5 rounded-full font-semibold text-base transition-all duration-233 ${
          !isAnnual
            ? 'text-obsidian bg-pearl shadow-glow'
            : 'text-silver hover:text-pearl'
        }`}
      >
        Monthly
      </button>

      <div className="relative">
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-16 h-8 rounded-full transition-all duration-233 ${
            isAnnual ? 'bg-pearl' : 'bg-carbon'
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 rounded-full bg-obsidian transition-all duration-233 ease-ai-snap ${
              isAnnual ? 'left-9' : 'left-1'
            }`}
          />
        </button>
      </div>

      <button
        onClick={() => setIsAnnual(true)}
        className={`px-6 py-2.5 rounded-full font-semibold text-base transition-all duration-233 ${
          isAnnual
            ? 'text-obsidian bg-pearl shadow-glow'
            : 'text-silver hover:text-pearl'
        }`}
      >
        Annual
      </button>

      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full glass transition-all duration-377 ${
          isAnnual
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'
        }`}
      >
        <Sparkles className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-sm font-semibold">
          Save {savings}%
        </span>
      </div>
    </div>
  );
};
