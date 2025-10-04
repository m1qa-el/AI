import { useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { distance, lerp, clamp } from '../../utils/math';

interface Particle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface BlackHoleProps {
  radius?: number;
  particleCount?: number;
  rotationSpeed?: number;
}

export const BlackHole = ({
  radius = 250,
  particleCount = 150,
  rotationSpeed = 0.0005,
}: BlackHoleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mousePosition = useMousePosition();
  const prefersReducedMotion = useReducedMotion();
  const centerRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const fpsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(0);
  const qualityRef = useRef(1);
  const responsiveRadiusRef = useRef(radius);

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
        responsiveRadiusRef.current = radius * 0.6;
      } else if (window.innerWidth < 1024) {
        qualityRef.current = 0.7;
        responsiveRadiusRef.current = radius * 0.8;
      } else {
        qualityRef.current = 1;
        responsiveRadiusRef.current = radius;
      }
    };

    const initParticles = () => {
      const adjustedCount = Math.floor(particleCount * qualityRef.current);
      const currentRadius = responsiveRadiusRef.current;
      particlesRef.current = Array.from({ length: adjustedCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = currentRadius * 0.8 + Math.random() * currentRadius * 1.2;

        return {
          angle,
          distance: dist,
          speed: (1 / dist) * 5000 + rotationSpeed * 100,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          trail: [],
        };
      });
    };

    const monitorPerformance = (currentTime: number) => {
      if (lastFrameTimeRef.current > 0) {
        const delta = currentTime - lastFrameTimeRef.current;
        const fps = 1000 / delta;
        fpsRef.current.push(fps);

        if (fpsRef.current.length > 30) {
          fpsRef.current.shift();
        }

        if (fpsRef.current.length === 30) {
          const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / 30;

          if (avgFps < 30 && qualityRef.current > 0.3) {
            qualityRef.current = Math.max(0.3, qualityRef.current - 0.1);
            initParticles();
          } else if (avgFps > 55 && qualityRef.current < 1) {
            qualityRef.current = Math.min(1, qualityRef.current + 0.05);
          }
        }
      }
      lastFrameTimeRef.current = currentTime;
    };

    const drawEventHorizon = (centerX: number, centerY: number, time: number) => {
      const pulseIntensity = Math.sin(time * 0.001) * 0.1 + 0.9;
      const eventHorizonRadius = responsiveRadiusRef.current * 0.35 * pulseIntensity;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        eventHorizonRadius
      );

      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.5, 'rgba(13, 13, 13, 0.95)');
      gradient.addColorStop(0.8, 'rgba(38, 38, 38, 0.7)');
      gradient.addColorStop(1, 'rgba(64, 64, 64, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const innerGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        eventHorizonRadius * 0.3
      );

      innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, eventHorizonRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = innerGradient;
      ctx.fill();
    };

    const drawPhotonSphere = (centerX: number, centerY: number, time: number) => {
      const photonRadius = responsiveRadiusRef.current * 0.5;
      const segments = 60;
      const waveOffset = time * 0.002;

      ctx.strokeStyle = 'rgba(229, 229, 229, 0.15)';
      ctx.lineWidth = 2;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const layerRadius = photonRadius + i * 15;

        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          const wave = Math.sin(angle * 3 + waveOffset + i * 0.5) * 5;
          const r = layerRadius + wave;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }
    };

    const drawGravitationalLensing = (centerX: number, centerY: number) => {
      const currentRadius = responsiveRadiusRef.current;
      const lensRadius = currentRadius * 1.5;

      for (let i = 0; i < 5; i++) {
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          currentRadius * 0.6 + i * 30,
          centerX,
          centerY,
          currentRadius * 0.8 + i * 30
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.03 - i * 0.005})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.01 - i * 0.002})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 0.8 + i * 30, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const drawAccretionDisk = (centerX: number, centerY: number, time: number) => {
      const currentRadius = responsiveRadiusRef.current;
      particlesRef.current.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.angle += (particle.speed * rotationSpeed);

          const distToCenter = particle.distance;
          const eventHorizonRadius = currentRadius * 0.35;

          if (distToCenter > eventHorizonRadius) {
            const pullStrength = 1 / (distToCenter * 0.01);
            particle.distance = Math.max(eventHorizonRadius, particle.distance - pullStrength * 0.3);
          } else {
            particle.opacity *= 0.95;
            if (particle.opacity < 0.01) {
              particle.angle = Math.random() * Math.PI * 2;
              particle.distance = currentRadius * 0.8 + Math.random() * currentRadius * 1.2;
              particle.opacity = Math.random() * 0.8 + 0.2;
            }
          }
        }

        const x = centerX + Math.cos(particle.angle) * particle.distance;
        const y = centerY + Math.sin(particle.angle) * particle.distance;

        if (particle.trail.length > 8) {
          particle.trail.shift();
        }
        particle.trail.push({ x, y, opacity: particle.opacity });

        particle.trail.forEach((point, index) => {
          const trailOpacity = (index / particle.trail.length) * point.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(163, 163, 163, ${trailOpacity})`;
          ctx.fill();
        });

        const distanceFromCenter = particle.distance;
        const normalizedDist = clamp(distanceFromCenter / (currentRadius * 2), 0, 1);
        const brightness = 1 - normalizedDist;

        const dopplerSide = Math.cos(particle.angle - time * 0.001);
        const dopplerBrightness = dopplerSide > 0 ? 1.3 : 0.7;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 2);
        gradient.addColorStop(0, `rgba(229, 229, 229, ${particle.opacity * brightness * dopplerBrightness})`);
        gradient.addColorStop(0.5, `rgba(163, 163, 163, ${particle.opacity * brightness * dopplerBrightness * 0.5})`);
        gradient.addColorStop(1, 'rgba(115, 115, 115, 0)');

        ctx.beginPath();
        ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    const drawHawkingRadiation = (centerX: number, centerY: number, time: number) => {
      const eventHorizonRadius = responsiveRadiusRef.current * 0.35;
      const particleCount = 20;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.0005;
        const distance = eventHorizonRadius + ((time + i * 100) % 1000) * 0.1;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const opacity = Math.max(0, 1 - (distance - eventHorizonRadius) / 100);

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 229, 229, ${opacity * 0.4})`;
        ctx.fill();
      }
    };

    const drawGravitationalWaves = (centerX: number, centerY: number, time: number) => {
      const waveCount = 3;
      const maxRadius = responsiveRadiusRef.current * 2.5;

      for (let i = 0; i < waveCount; i++) {
        const waveRadius = ((time * 0.05 + i * 100) % maxRadius);
        const opacity = Math.max(0, 1 - (waveRadius / maxRadius));

        ctx.strokeStyle = `rgba(229, 229, 229, ${opacity * 0.08})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      monitorPerformance(currentTime);
      timeRef.current = currentTime;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const centerX = centerRef.current.x;
      const centerY = centerRef.current.y;

      drawGravitationalWaves(centerX, centerY, currentTime);
      drawGravitationalLensing(centerX, centerY);
      drawAccretionDisk(centerX, centerY, currentTime);
      drawPhotonSphere(centerX, centerY, currentTime);
      drawEventHorizon(centerX, centerY, currentTime);

      if (!prefersReducedMotion) {
        drawHawkingRadiation(centerX, centerY, currentTime);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [radius, particleCount, rotationSpeed, mousePosition, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};
