import { useEffect, useRef } from 'react';

interface UseWheelNavigationProps {
  onNavigate: (direction: 'next' | 'prev') => void;
  isEnabled: boolean;
  threshold?: number;
  cooldown?: number;
}

export const useWheelNavigation = ({
  onNavigate,
  isEnabled,
  threshold = 50,
  cooldown = 800,
}: UseWheelNavigationProps) => {
  const lastEventTime = useRef(0);
  const accumulatedDelta = useRef(0);

  useEffect(() => {
    if (!isEnabled) return;

    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();

      if (now - lastEventTime.current < cooldown) {
        event.preventDefault();
        return;
      }

      accumulatedDelta.current += event.deltaY;

      if (Math.abs(accumulatedDelta.current) >= threshold) {
        event.preventDefault();

        if (accumulatedDelta.current > 0) {
          onNavigate('next');
        } else {
          onNavigate('prev');
        }

        lastEventTime.current = now;
        accumulatedDelta.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isEnabled, onNavigate, threshold, cooldown]);
};
