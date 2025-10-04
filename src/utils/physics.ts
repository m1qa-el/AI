export interface Spring {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export const createSpring = (x: number, y: number): Spring => {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    targetX: x,
    targetY: y,
  };
};

export const updateSpring = (
  spring: Spring,
  config: SpringConfig = {},
  deltaTime: number = 1
): void => {
  const { stiffness = 0.015, damping = 0.85, mass = 1 } = config;

  const dx = spring.targetX - spring.x;
  const dy = spring.targetY - spring.y;

  const ax = (dx * stiffness) / mass;
  const ay = (dy * stiffness) / mass;

  spring.vx = (spring.vx + ax * deltaTime) * damping;
  spring.vy = (spring.vy + ay * deltaTime) * damping;

  spring.x += spring.vx * deltaTime;
  spring.y += spring.vy * deltaTime;
};

export const setSpringTarget = (spring: Spring, x: number, y: number): void => {
  spring.targetX = x;
  spring.targetY = y;
};

export interface MouseInfluenceConfig {
  radius: number;
  strength: number;
  falloff: 'linear' | 'quadratic' | 'smooth';
}

export const calculateMouseInfluence = (
  nodeX: number,
  nodeY: number,
  mouseX: number,
  mouseY: number,
  config: MouseInfluenceConfig
): { fx: number; fy: number; strength: number } => {
  const dx = mouseX - nodeX;
  const dy = mouseY - nodeY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist >= config.radius || dist === 0) {
    return { fx: 0, fy: 0, strength: 0 };
  }

  let influence = 1 - dist / config.radius;

  switch (config.falloff) {
    case 'quadratic':
      influence = influence * influence;
      break;
    case 'smooth':
      influence = influence * influence * (3 - 2 * influence);
      break;
  }

  const strength = influence * config.strength;
  const fx = (dx / dist) * strength;
  const fy = (dy / dist) * strength;

  return { fx, fy, strength: influence };
};
