import { useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { distance } from '../../utils/math';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface NeuralCanvasProps {
  nodeCount?: number;
  connectionRadius?: number;
  mouseInfluence?: number;
}

export const NeuralCanvas = ({
  nodeCount = 75,
  connectionRadius = 150,
  mouseInfluence = 0.3,
}: NeuralCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();
  const mousePosition = useMousePosition();
  const prefersReducedMotion = useReducedMotion();

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
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
      }));
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

    const updateNodes = () => {
      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
        if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

        if (!prefersReducedMotion && mouseInfluence > 0) {
          const dx = mousePosition.x - node.x;
          const dy = mousePosition.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const force = (1 - dist / 200) * mouseInfluence;
            node.x += dx * force * 0.01;
            node.y += dy * force * 0.01;
          }
        }
      });
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (!prefersReducedMotion) {
        updateNodes();
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
  }, [nodeCount, connectionRadius, mouseInfluence, mousePosition, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
