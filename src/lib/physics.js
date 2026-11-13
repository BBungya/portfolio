/**
 * 아주 작은 2D 원형 물리 엔진 (캡슐 전용).
 * 중력 · 원끼리 충돌 · 벽/바닥 반사 · 굴러가는 회전만 다뤄요.
 */
export function createWorld({ width, height, radius, left = 0, right = width }) {
  return { W: width, H: height, r: radius, left, right, bodies: new Map() };
}

export function addBody(world, id, x, y, vx = 0, vy = 0) {
  world.bodies.set(id, { x, y, vx, vy, a: Math.random() * 40 - 20, pinned: false });
}

export function removeBody(world, id) {
  world.bodies.delete(id);
}

export function impulseAround(world, x, y, radius, strength) {
  world.bodies.forEach((b) => {
    if (b.pinned) return;
    const dx = b.x - x;
    const dy = b.y - y;
    const d = Math.hypot(dx, dy);
    if (d < radius && d > 0.01) {
      const k = (1 - d / radius) * strength;
      b.vx += (dx / d) * k;
      b.vy -= k * 0.9;
    }
  });
}

const G = 2200; // 중력 (px/s²)
const BOUNCE_WALL = 0.32;
const BOUNCE_BALL = 0.18;
const FLOOR_FRICTION = 0.9;

/** dt초만큼 진행하고, 가장 빠른 속도를 돌려줘요 (잠들기 판단용). */
export function step(world, dt) {
  const { r, H, left, right } = world;
  const list = [...world.bodies.values()];
  let maxSpeed = 0;

  for (const b of list) {
    if (b.pinned) continue;
    b.vy += G * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.a += ((b.vx * dt) / r) * (180 / Math.PI); // 굴러간 거리만큼 회전
  }

  // 충돌은 여러 번 풀어야 쌓였을 때 안정적이에요
  for (let it = 0; it < 6; it++) {
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        const overlap = r * 2 - d;
        if (overlap <= 0) continue;
        const nx = dx / d;
        const ny = dy / d;
        const wa = a.pinned ? 0 : b.pinned ? 1 : 0.5;
        const wb = b.pinned ? 0 : a.pinned ? 1 : 0.5;
        a.x -= nx * overlap * wa;
        a.y -= ny * overlap * wa;
        b.x += nx * overlap * wb;
        b.y += ny * overlap * wb;
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rv < 0) {
          const jImp = -(1 + BOUNCE_BALL) * rv;
          a.vx -= jImp * nx * wa;
          a.vy -= jImp * ny * wa;
          b.vx += jImp * nx * wb;
          b.vy += jImp * ny * wb;
        }
      }
    }
    for (const b of list) {
      if (b.pinned) continue;
      if (b.y > H - r) {
        b.y = H - r;
        if (b.vy > 0) b.vy = -b.vy * BOUNCE_WALL;
        if (Math.abs(b.vy) < 40) b.vy = 0;
        b.vx *= FLOOR_FRICTION;
      }
      if (b.x < left + r) {
        b.x = left + r;
        if (b.vx < 0) b.vx = -b.vx * BOUNCE_WALL;
      }
      if (b.x > right - r) {
        b.x = right - r;
        if (b.vx > 0) b.vx = -b.vx * BOUNCE_WALL;
      }
    }
  }

  for (const b of list) {
    b.vx *= 0.995;
    if (Math.abs(b.vx) < 2) b.vx = 0;
    maxSpeed = Math.max(maxSpeed, Math.hypot(b.vx, b.vy));
  }
  return maxSpeed;
}
