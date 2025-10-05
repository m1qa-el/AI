import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Stats', href: '#stats' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const scrollToSection = (href: string) => {
    window.location.hash = href;
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-377 ease-ai-glide">
        <div className="glass-heavy px-8 py-4 rounded-full shadow-depth-3">
          <div className="hidden md:flex items-center gap-8">
            <button
              className="text-pearl font-display font-semibold text-lg hover:text-gradient-animated transition-all"
              onClick={() => (window.location.hash = '#hero')}
            >
              NEURAL
            </button>

            <div className="h-6 w-px bg-pearl/20" />

            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-silver hover:text-pearl transition-colors duration-233 font-medium relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pearl transition-all duration-233 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-pearl/20" />

            <button className="btn-ghost">Get Started</button>
          </div>

          <div className="flex md:hidden items-center justify-between gap-4">
            <button
              className="text-pearl font-display font-semibold text-lg"
              onClick={() => (window.location.hash = '#hero')}
            >
              NEURAL
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-pearl p-2 hover:bg-pearl/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative h-full flex flex-col items-center justify-center gap-8 p-6">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-h2 text-pearl hover:text-gradient-animated transition-all animate-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.label}
              </button>
            ))}

            <button
              className="btn-primary mt-8 animate-in"
              style={{ animationDelay: '300ms' }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
};
