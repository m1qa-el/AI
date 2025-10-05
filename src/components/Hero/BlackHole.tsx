import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Ring {
  radius: number;
  angle: number;
  speed: number;
  opacity: number;
  spiralOffset: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinklePhase: number;
}

interface BlackHoleProps {
  ringCount?: number;
  tiltAngle?: number;
  rotationSpeed?: number;
}

export const BlackHole = ({
  ringCount = 400,
  tiltAngle = 70,
  rotationSpeed = 0.00015,
}: BlackHoleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();
  const centerRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const qualityRef = useRef(1);
  const eventHorizonRadiusRef = useRef(120);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      centerRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      if (window.innerWidth < 768) {
        qualityRef.current = 0.5;
        eventHorizonRadiusRef.current = 80;
      } else if (window.innerWidth < 1024) {
        qualityRef.current = 0.7;
        eventHorizonRadiusRef.current = 100;
      } else {
        qualityRef.current = 1;
        eventHorizonRadiusRef.current = 120;
      }
    };

    const initRings = () => {
      const adjustedRingCount = Math.floor(ringCount * qualityRef.current);
      const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;
      const minRadius = eventHorizonRadiusRef.current;
      const spiralTightness = 0.012;

      ringsRef.current = Array.from({ length: adjustedRingCount }, (_, i) => {
        const t = i / adjustedRingCount;
        const radius = minRadius + (maxRadius - minRadius) * Math.exp(t * spiralTightness * adjustedRingCount) / Math.exp(spiralTightness * adjustedRingCount);

        const angle = Math.random() * Math.PI * 2;
        const speed = (1 / (radius * 0.01)) * 0.1 + rotationSpeed * 50;
        const spiralOffset = (i / adjustedRingCount) * Math.PI * 0.5;

        return {
          radius,
          angle,
          speed,
          opacity: 0.3 + Math.random() * 0.4,
          spiralOffset,
        };
      });
    };

    const initStars = () => {
      const starCount = 150;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const drawStars = (time: number) => {
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * 0.001 + star.twinklePhase) * 0.3 + 0.7;
        const opacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
        ctx.fill();
      });
    };

    const drawEllipticalRing = (
      centerX: number,
      centerY: number,
      radius: number,
      angle: number,
      tilt: number,
      opacity: number,
      isBack: boolean
    ) => {
      const segments = 100;
      const tiltRad = (tilt * Math.PI) / 180;
      const semiMinor = radius * Math.sin(tiltRad);
      const semiMajor = radius;

      ctx.beginPath();
      let firstPoint = true;

      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2;

        const localX = semiMajor * Math.cos(t);
        const localY = semiMinor * Math.sin(t);

        const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
        const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);

        const x = centerX + rotatedX;
        const y = centerY + rotatedY;

        const z = semiMinor * Math.sin(t);
        const isBackHalf = z < 0;

        if (isBack === isBackHalf) {
          const distFromCenter = Math.sqrt(
            (x - centerX) ** 2 + (y - centerY) ** 2
          );

          if (distFromCenter > eventHorizonRadiusRef.current) {
            if (firstPoint) {
              ctx.moveTo(x, y);
              firstPoint = false;
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
      }

      const depthFactor = isBack ? 0.4 : 1.0;
      const finalOpacity = opacity * depthFactor;

      ctx.strokeStyle = `rgba(229, 229, 229, ${finalOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawEventHorizon = (centerX: number, centerY: number, time: number) => {
      const pulseIntensity = Math.sin(time * 0.0008) * 0.05 + 0.95;
      const horizonRadius = eventHorizonRadiusRef.current * pulseIntensity;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        horizonRadius * 1.2
      );

      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.85, 'rgba(20, 20, 20, 0.8)');
      gradient.addColorStop(1, 'rgba(40, 40, 40, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawCenterText = (centerX: number, centerY: number, time: number) => {
      ctx.save();

      const text = 'm1qa';
      const fontSize = window.innerWidth < 768 ? 36 : window.innerWidth < 1024 ? 46 : 56;

      ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.translate(centerX, centerY);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = 'rgba(40, 40, 40, 0.3)';
      ctx.fillText(text, 0, 0);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const glowIntensity = Math.sin(time * 0.0015) * 0.15 + 0.85;

      for (let i = 0; i < 5; i++) {
        const layerOpacity = (0.25 - i * 0.04) * glowIntensity;
        const layerBlur = 12 + i * 6;

        ctx.shadowColor = `rgba(255, 255, 255, ${layerOpacity})`;
        ctx.shadowBlur = layerBlur;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillText(text, 0, 0);
      }

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fillText(text, 0, 0);

      const shimmerPhase = (time * 0.0025) % 1;
      const shimmerX = (shimmerPhase * 2 - 1) * fontSize * 2.5;
      const shimmerGradient = ctx.createLinearGradient(
        shimmerX - fontSize * 0.8,
        -fontSize * 0.5,
        shimmerX + fontSize * 0.8,
        fontSize * 0.5
      );
      shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
      shimmerGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = shimmerGradient;
      ctx.fillText(text, 0, 0);

      ctx.globalCompositeOperation = 'source-over';

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.strokeText(text, 0, 0);

      ctx.restore();
    };

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      timeRef.current = currentTime;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const centerX = centerRef.current.x;
      const centerY = centerRef.current.y;

      drawStars(currentTime);

      ringsRef.current.forEach((ring) => {
        if (!prefersReducedMotion) {
          ring.angle += ring.speed * rotationSpeed;
          ring.radius -= 0.015;

          if (ring.radius <= eventHorizonRadiusRef.current) {
            const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;
            ring.radius = maxRadius;
            ring.angle = Math.random() * Math.PI * 2;
          }
        }
      });

      ringsRef.current.forEach((ring) => {
        drawEllipticalRing(
          centerX,
          centerY,
          ring.radius,
          ring.angle + ring.spiralOffset,
          tiltAngle,
          ring.opacity,
          true
        );
      });

      drawEventHorizon(centerX, centerY, currentTime);

      ringsRef.current.forEach((ring) => {
        drawEllipticalRing(
          centerX,
          centerY,
          ring.radius,
          ring.angle + ring.spiralOffset,
          tiltAngle,
          ring.opacity,
          false
        );
      });

      drawCenterText(centerX, centerY, currentTime);

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initRings();
    initStars();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initRings();
      initStars();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [ringCount, tiltAngle, rotationSpeed, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};
