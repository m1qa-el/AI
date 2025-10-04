import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  scrollDirection: 'up' | 'down' | null;
}

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: null,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollPosition({
            scrollY: currentScrollY,
            scrollX: window.scrollX,
            scrollDirection: currentScrollY > lastScrollY ? 'down' : 'up',
          });
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
};
