export const staggerDelay = (index: number, baseDelay: number = 100): number => {
  return index * baseDelay;
};

export const staggeredAnimation = <T>(
  items: T[],
  callback: (item: T, index: number) => void,
  delay: number = 100
): void => {
  items.forEach((item, index) => {
    setTimeout(() => callback(item, index), staggerDelay(index, delay));
  });
};

export const smoothScrollTo = (targetY: number, duration: number = 1000): void => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const scroll = (currentTime: number): void => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};

export const getScrollProgress = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementHeight = rect.height;

  if (rect.top > windowHeight) return 0;
  if (rect.bottom < 0) return 1;

  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  return visibleHeight / elementHeight;
};
