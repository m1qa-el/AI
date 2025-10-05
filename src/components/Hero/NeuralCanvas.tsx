import { useEffect, useRef } from 'react';
import { distance } from '../../utils/math';

interface Node {
  x: number;
  y: number;
  radius: number;
  brightness: number;
}

interface NeuralCanvasProps {
  nodeCount?: number;
  connectionRadius?: number;
}

export const NeuralCanvas = ({
  nodeCount = 100,
  connectionRadius = 150,
}: NeuralCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();

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
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.5 + 0.5,
          brightness: Math.random() * 0.4 + 0.6,
        };
      });
    };

    const drawNode = (node: Node) => {
      if (!ctx) return;

      const alpha = 0.5 * node.brightness;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      const glowRadius = node.radius * 2.5;
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        node.radius * 0.5,
        node.x,
        node.y,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawConnection = (node1: Node, node2: Node, dist: number) => {
      if (!ctx) return;

      const opacity = (1 - dist / connectionRadius) * 0.15;
      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      ctx.lineTo(node2.x, node2.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 0.3;
      ctx.stroke();
    };


    const render = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      nodesRef.current.forEach((node, i) => {
        drawNode(node);

        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dist = distance(node.x, node.y, otherNode.x, otherNode.y);
          if (dist < connectionRadius) {
            drawConnection(node, otherNode, dist);
          }
        });
      });
    };

    const handleResize = () => {
      resizeCanvas();
      initNodes();
      render();
    };

    resizeCanvas();
    initNodes();
    render();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [nodeCount, connectionRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
};
