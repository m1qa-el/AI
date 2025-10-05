import { useState, useCallback, useRef, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { useScrollLock } from './useScrollLock';
import { useWheelNavigation } from './useWheelNavigation';
import { useTouchNavigation } from './useTouchNavigation';
import { useKeyboardNavigation } from './useKeyboardNavigation';

interface UseFullPageScrollProps {
  totalSections: number;
  transitionDuration?: number;
  initialSection?: number;
}

export const useFullPageScroll = ({
  totalSections,
  transitionDuration = 600,
  initialSection = 0,
}: UseFullPageScrollProps) => {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const transitionTimeoutRef = useRef<number | null>(null);
  const sectionIdsRef = useRef<string[]>([]);

  const effectiveDuration = prefersReducedMotion ? 0 : transitionDuration;

  useScrollLock(true);

  const navigateToSection = useCallback(
    (targetSection: number, updateHash = true) => {
      if (
        isTransitioning ||
        targetSection < 0 ||
        targetSection >= totalSections ||
        targetSection === currentSection
      ) {
        return;
      }

      setIsTransitioning(true);
      setCurrentSection(targetSection);

      if (updateHash && sectionIdsRef.current[targetSection]) {
        window.history.pushState(
          null,
          '',
          `#${sectionIdsRef.current[targetSection]}`
        );
      }

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;

        const targetElement = document.querySelector(
          `[data-section-index="${targetSection}"]`
        );
        if (targetElement instanceof HTMLElement) {
          targetElement.focus({ preventScroll: true });
        }
      }, effectiveDuration);
    },
    [currentSection, isTransitioning, totalSections, effectiveDuration]
  );

  const handleNavigate = useCallback(
    (direction: 'next' | 'prev') => {
      const targetSection =
        direction === 'next' ? currentSection + 1 : currentSection - 1;
      navigateToSection(targetSection);
    },
    [currentSection, navigateToSection]
  );

  const navigateToStart = useCallback(() => {
    navigateToSection(0);
  }, [navigateToSection]);

  const navigateToEnd = useCallback(() => {
    navigateToSection(totalSections - 1);
  }, [navigateToSection, totalSections]);

  useWheelNavigation({
    onNavigate: handleNavigate,
    isEnabled: !isTransitioning,
    cooldown: effectiveDuration + 200,
  });

  useTouchNavigation({
    onNavigate: handleNavigate,
    isEnabled: !isTransitioning,
  });

  useKeyboardNavigation({
    onNavigate: handleNavigate,
    onNavigateToStart: navigateToStart,
    onNavigateToEnd: navigateToEnd,
    isEnabled: !isTransitioning,
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const index = sectionIdsRef.current.indexOf(hash);
      if (index !== -1 && index !== currentSection) {
        navigateToSection(index, false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      const index = sectionIdsRef.current.indexOf(initialHash);
      if (index !== -1) {
        setCurrentSection(index);
      }
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentSection, navigateToSection]);

  const registerSection = useCallback((id: string, index: number) => {
    sectionIdsRef.current[index] = id;
  }, []);

  return {
    currentSection,
    isTransitioning,
    navigateToSection,
    registerSection,
    prefersReducedMotion,
    transitionDuration: effectiveDuration,
  };
};
