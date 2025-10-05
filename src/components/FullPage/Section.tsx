import { ReactNode, useEffect, useRef } from 'react';

interface SectionProps {
  id: string;
  index?: number;
  isActive?: boolean;
  isTransitioning?: boolean;
  transitionDuration?: number;
  direction?: 'up' | 'down' | null;
  prefersReducedMotion?: boolean;
  onRegister?: (id: string, index: number) => void;
  children: ReactNode;
  className?: string;
}

export const Section = ({
  id,
  index = 0,
  isActive = false,
  isTransitioning = false,
  transitionDuration = 600,
  direction = null,
  prefersReducedMotion = false,
  onRegister,
  children,
  className = '',
}: SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (onRegister) {
      onRegister(id, index);
    }
  }, [id, index, onRegister]);

  const getTransform = () => {
    if (prefersReducedMotion) {
      return isActive ? 'translateY(0)' : 'translateY(100%)';
    }

    if (isActive) {
      return 'translateY(0)';
    }

    if (direction === 'down') {
      return 'translateY(-100%)';
    }

    return 'translateY(100%)';
  };

  const getTransition = () => {
    if (prefersReducedMotion) {
      return 'none';
    }

    if (isTransitioning) {
      return `transform ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }

    return 'none';
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      data-section-index={index}
      aria-hidden={!isActive}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={isActive ? -1 : undefined}
      className={`full-page-section ${className}`}
      style={{
        transform: getTransform(),
        transition: getTransition(),
        willChange: isTransitioning ? 'transform' : 'auto',
      }}
    >
      {children}
    </section>
  );
};
