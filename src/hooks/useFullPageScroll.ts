import { useState, useEffect, useCallback, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseFullPageScrollOptions {
  totalSections: number;
  animationDuration?: number;
  threshold?: number;
  onSectionChange?: (index: number) => void;
}

interface UseFullPageScrollReturn {
  currentSection: number;
  isAnimating: boolean;
  goToSection: (index: number, immediate?: boolean) => void;
  nextSection: () => void;
  previousSection: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useFullPageScroll = ({
  totalSections,
  animationDuration = 610,
  threshold = 50,
  onSectionChange,
}: UseFullPageScrollOptions): UseFullPageScrollReturn => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const goToSection = useCallback(
    (index: number, immediate = false) => {
      if (index < 0 || index >= totalSections || index === currentSection) {
        return;
      }

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      setCurrentSection(index);
      onSectionChange?.(index);

      if (!prefersReducedMotion && !immediate) {
        setIsAnimating(true);
        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, animationDuration);
      }

      const hash = `section-${index}`;
      if (window.location.hash !== `#${hash}`) {
        window.history.replaceState(null, '', `#${hash}`);
      }
    },
    [currentSection, totalSections, animationDuration, prefersReducedMotion, onSectionChange]
  );

  const nextSection = useCallback(() => {
    if (currentSection < totalSections - 1 && !isAnimating) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, totalSections, isAnimating, goToSection]);

  const previousSection = useCallback(() => {
    if (currentSection > 0 && !isAnimating) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, isAnimating, goToSection]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating && !prefersReducedMotion) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 100) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < threshold) {
        return;
      }

      e.preventDefault();
      lastScrollTime.current = now;

      if (e.deltaY > 0) {
        nextSection();
      } else {
        previousSection();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating && !prefersReducedMotion) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          nextSection();
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          previousSection();
          break;
        case 'Home':
          e.preventDefault();
          goToSection(0);
          break;
        case 'End':
          e.preventDefault();
          goToSection(totalSections - 1);
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) < threshold) {
        return;
      }

      if (diff > 0) {
        nextSection();
      } else {
        previousSection();
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const match = hash.match(/section-(\d+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (index >= 0 && index < totalSections) {
          goToSection(index, prefersReducedMotion);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);

    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      handleHashChange();
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [
    isAnimating,
    nextSection,
    previousSection,
    goToSection,
    totalSections,
    threshold,
    prefersReducedMotion,
  ]);

  return {
    currentSection,
    isAnimating,
    goToSection,
    nextSection,
    previousSection,
    containerRef,
  };
};
