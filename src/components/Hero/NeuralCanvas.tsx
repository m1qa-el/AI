import { useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { distance, easeOutQuad } from '../../utils/math';
import { calculateMouseInfluence, type MouseInfluenceConfig } from '../../utils/physics';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  originalX: number;
  originalY: number;
  mouseInfluenceX: number;
  mouseInfluenceY: number;
}

interface NeuralCanvasProps {
  nodeCount?: number;
  connectionRadius?: number;
  mouseInfluenceRadius?: number;
  mouseInfluenceStrength?: number;
  mouseInfluenceFalloff?: 'linear' | 'quadratic' | 'smooth';
  blackHoleGravity?: number;
  animationSpeed?: number;
}

export const NeuralCanvas = ({
  nodeCount = 75,
  connectionRadius = 150,
  mouseInfluenceRadius = 180,
  mouseInfluenceStrength = 0.08,
  mouseInfluenceFalloff = 'smooth',
  blackHoleGravity = 0.5,
  animationSpeed = 1.0,
}: NeuralCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();
  const mousePosition = useMousePosition({ smoothing: 0.12 });
  const prefersReducedMotion = useReducedMotion();
  const lastFrameTimeRef = useRef<number>(performance.now());
  const mouseInfluenceConfig = useRef<MouseInfluenceConfig>({
    radius: mouseInfluenceRadius,
    strength: mouseInfluenceStrength,
    falloff: mouseInfluenceFalloff,
  });

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
    };

    const initNodes = () => {
      nodesRef.current = Array.from({ length: nodeCount }, () => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        return {
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          pulsePhase: Math.random() * Math.PI * 2,
          mouseInfluenceX: 0,
          mouseInfluenceY: 0,
        };
      });
    };

    const drawNode = (node: Node, time: number) => {
      if (!ctx) return;

      const pulseIntensity = Math.sin(time * 0.002 + node.pulsePhase) * 0.3 + 0.7;
      const alpha = 0.4 * pulseIntensity;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      const glowRadius = node.radius * 3;
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        node.radius,
        node.x,
        node.y,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawConnection = (node1: Node, node2: Node, dist: number) => {
      if (!ctx) return;

      const opacity = (1 - dist / connectionRadius) * 0.2;
      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      ctx.lineTo(node2.x, node2.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const updateNodes = (deltaTime: number) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const blackHoleRadius = 250;
      const dt = deltaTime * animationSpeed;

      mouseInfluenceConfig.current = {
        radius: mouseInfluenceRadius,
        strength: mouseInfluenceStrength,
        falloff: mouseInfluenceFalloff,
      };

      nodesRef.current.forEach((node) => {
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
        if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

        if (!prefersReducedMotion) {
          const dxToCenter = centerX - node.x;
          const dyToCenter = centerY - node.y;
          const distToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter);

          if (distToCenter > blackHoleRadius && distToCenter < blackHoleRadius * 3) {
            const gravitationalForce = blackHoleGravity / (distToCenter * 0.01);
            const forceX = (dxToCenter / distToCenter) * gravitationalForce * 0.001 * dt;
            const forceY = (dyToCenter / distToCenter) * gravitationalForce * 0.001 * dt;

            node.x += forceX;
            node.y += forceY;

            const tangentAngle = Math.atan2(dyToCenter, dxToCenter) + Math.PI / 2;
            node.x += Math.cos(tangentAngle) * gravitationalForce * 0.0002 * dt;
            node.y += Math.sin(tangentAngle) * gravitationalForce * 0.0002 * dt;
          }

          const influence = calculateMouseInfluence(
            node.x,
            node.y,
            mousePosition.x,
            mousePosition.y,
            mouseInfluenceConfig.current
          );

          node.mouseInfluenceX += (influence.fx - node.mouseInfluenceX) * 0.15 * dt;
          node.mouseInfluenceY += (influence.fy - node.mouseInfluenceY) * 0.15 * dt;

          node.x += node.mouseInfluenceX * dt;
          node.y += node.mouseInfluenceY * dt;
        }
      });
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      const currentTime = performance.now();
      const deltaTime = Math.min((currentTime - lastFrameTimeRef.current) / 16.67, 2);
      lastFrameTimeRef.current = currentTime;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (!prefersReducedMotion) {
        updateNodes(deltaTime);
      }

      nodesRef.current.forEach((node, i) => {
        drawNode(node, time);

        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dist = distance(node.x, node.y, otherNode.x, otherNode.y);
          if (dist < connectionRadius) {
            drawConnection(node, otherNode, dist);
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initNodes();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initNodes();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodeCount, connectionRadius, mouseInfluenceRadius, mouseInfluenceStrength, mouseInfluenceFalloff, mousePosition, prefersReducedMotion, blackHoleGravity, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
};
