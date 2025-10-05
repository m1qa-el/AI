import { useEffect, useRef } from 'react';

interface UseTouchNavigationProps {
  onNavigate: (direction: 'next' | 'prev') => void;
  isEnabled: boolean;
  threshold?: number;
}

export const useTouchNavigation = ({
  onNavigate,
  isEnabled,
  threshold = 50,
}: UseTouchNavigationProps) => {
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  useEffect(() => {
    if (!isEnabled) return;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY.current === null) return;

      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = Date.now() - touchStartTime.current;

      if (Math.abs(deltaY) > threshold && deltaTime < 300) {
        event.preventDefault();

        if (deltaY > 0) {
          onNavigate('next');
        } else {
          onNavigate('prev');
        }

        touchStartY.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isEnabled, onNavigate, threshold]);
};
