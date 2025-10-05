import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  onNavigate: (direction: 'next' | 'prev') => void;
  onNavigateToStart?: () => void;
  onNavigateToEnd?: () => void;
  isEnabled: boolean;
}

export const useKeyboardNavigation = ({
  onNavigate,
  onNavigateToStart,
  onNavigateToEnd,
  isEnabled,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          event.preventDefault();
          onNavigate('next');
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          onNavigate('prev');
          break;
        case 'Home':
          if (onNavigateToStart) {
            event.preventDefault();
            onNavigateToStart();
          }
          break;
        case 'End':
          if (onNavigateToEnd) {
            event.preventDefault();
            onNavigateToEnd();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled, onNavigate, onNavigateToStart, onNavigateToEnd]);
};
