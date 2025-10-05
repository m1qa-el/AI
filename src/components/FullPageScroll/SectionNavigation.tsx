interface SectionNavigationProps {
  totalSections: number;
  currentSection: number;
  onNavigate: (index: number) => void;
  sectionLabels?: string[];
}

export const SectionNavigation = ({
  totalSections,
  currentSection,
  onNavigate,
  sectionLabels,
}: SectionNavigationProps) => {
  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block"
      aria-label="Section navigation"
    >
      <ul className="flex flex-col gap-4">
        {Array.from({ length: totalSections }).map((_, index) => {
          const isActive = index === currentSection;
          const label = sectionLabels?.[index] || `Section ${index + 1}`;

          return (
            <li key={index}>
              <button
                onClick={() => onNavigate(index)}
                className="group relative flex items-center justify-center"
                aria-label={label}
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`block rounded-full transition-all duration-233 ${
                    isActive
                      ? 'w-3 h-3 bg-pearl shadow-glow'
                      : 'w-2 h-2 bg-silver/50 group-hover:bg-pearl/80 group-hover:w-2.5 group-hover:h-2.5'
                  }`}
                />
                <span className="absolute right-6 whitespace-nowrap text-sm font-mono text-pearl opacity-0 group-hover:opacity-100 transition-opacity duration-233 pointer-events-none">
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
