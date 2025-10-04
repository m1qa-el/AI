import { useState, useEffect, useRef } from 'react';
import { lerp } from '../utils/math';

interface MousePosition {
  x: number;
  y: number;
}

interface MousePositionWithVelocity extends MousePosition {
  vx: number;
  vy: number;
}

interface UseMousePositionOptions {
  smoothing?: number;
  includeVelocity?: boolean;
}

export const useMousePosition = (options: UseMousePositionOptions = {}) => {
  const { smoothing = 0.12, includeVelocity = false } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const targetRef = useRef<MousePosition>({ x: 0, y: 0 });
  const currentRef = useRef<MousePosition>({ x: 0, y: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 16.67;
      lastTimeRef.current = now;

      const adjustedSmoothing = Math.min(smoothing * dt, 1);

      const prevX = currentRef.current.x;
      const prevY = currentRef.current.y;

      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, adjustedSmoothing);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, adjustedSmoothing);

      if (includeVelocity) {
        velocityRef.current.vx = (currentRef.current.x - prevX) * 0.8 + velocityRef.current.vx * 0.2;
        velocityRef.current.vy = (currentRef.current.y - prevY) * 0.8 + velocityRef.current.vy * 0.2;
      }

      setMousePosition({ ...currentRef.current });

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [smoothing, includeVelocity]);

  if (includeVelocity) {
    return { ...mousePosition, ...velocityRef.current } as MousePositionWithVelocity;
  }

  return mousePosition;
};
