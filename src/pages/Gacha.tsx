import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useCollection } from '../App';
import { CAPSULES, getCapsule } from '../data/capsules';
import Nav from '../components/Nav';
import Capsule from '../components/Capsule';
import RevealNote from '../components/RevealNote';
import CollectionSheet from '../components/CollectionSheet';
import { addBody, createWorld, impulseAround, removeBody, step } from '../lib/physics';
import type { World } from '../lib/physics';
import type { CapsuleId } from '../types';
import '../styles/gacha.css';

/* 기계 치수(px) — gacha.css의 값과 맞춰야 집게가 캡슐을 정확히 잡아요. */
const GLASS = 480; // 유리창 높이
const BALL = 88; // 캡슐 지름
const HEAD = 60; // 집게 머리 높이
const OVER = 20; // 집게가 캡슐 위를 덮는 깊이
const CARRIAGE = 4 + 16; // 레일 여백 + 집게 캐리지
const REST = 24; // 대기 중 케이블 길이
const CHUTE = 12; // 출구 x 위치(%)
const GLASS_W = 556; // 유리창 폭 (기계 600 - 좌우 여백 22×2)
const CHUTE_EDGE = 122; // 출구 칸 오른쪽 벽 (캡슐이 넘어가지 않는 선)

/** 유리창을 투명하게(true) 또는 뿌옇게(false) */
const CLEAR_GLASS = true;

/** 배경 후보: 'grain' | 'grid' | 'studio' | 'type' | 'pills' | 'orbs'(이전)
 *  주소 뒤에 ?bg=grid 처럼 붙이면 바로 바꿔볼 수 있어요. */
const BG_KEYS = ['grain', 'grid', 'studio', 'type', 'pills', 'orbs'] as const;
type Background = (typeof BG_KEYS)[number];
const BACKGROUND: Background = 'grid';
const pickBg = (): Background => {
  try {
    const q = new URLSearchParams(window.location.search).get('bg');
    return BG_KEYS.find((k) => k === q) ?? BACKGROUND;
  } catch {
    return BACKGROUND;
  }
};

type Phase = 'idle' | 'busy';
type Timer = ReturnType<typeof setTimeout>;

const ALL_IDS: CapsuleId[] = CAPSULES.map((c) => c.id);
const cableFor = (y: number) => y - BALL / 2 - CARRIAGE - HEAD + OVER; // y: 캡슐 중심
const clamp = (v: number) => Math.max(8, Math.min(92, v));

interface Orb {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  size: number;
  color: string;
  delay: number;
}

const ORBS: Orb[] = [
  { left: '6%', top: '12%', size: 260, color: '#8FE0C2', delay: 0 },
  { left: '18%', bottom: '8%', size: 200, color: '#FFB27A', delay: -3 },
  { right: '8%', top: '8%', size: 220, color: '#C3AEFF', delay: -5 },
  { right: '16%', bottom: '14%', size: 280, color: '#FF9EC4', delay: -2 },
  { left: '40%', top: '4%', size: 160, color: '#FFDF6E', delay: -6 },
  { left: '52%', bottom: '2%', size: 200, color: '#9DBBFF', delay: -4 },
];

export default function Gacha() {
  const { got, collect } = useCollection();
  const [bg] = useState(pickBg);

  const [clawX, setClawX] = useState(50);
  const [moveMs, setMoveMs] = useState(140);
  const [cable, setCable] = useState(REST);
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [pile, setPile] = useState<CapsuleId[]>(ALL_IDS);
  const [held, setHeld] = useState<CapsuleId | null>(null);
  const [falling, setFalling] = useState<CapsuleId | null>(null);
  const [fallTop, setFallTop] = useState(0);
  const [tray, setTray] = useState<CapsuleId[]>([]);
  const [opened, setOpened] = useState<CapsuleId | null>(null);
  const [showCol, setShowCol] = useState(false);

  /* 좁은 화면에선 기계를 통째로 축소 (캡슐 배치가 px 기준이라 비율을 유지하려고) */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerWidth - 24) / 600));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  /* ───── 물리: 캡슐마다 위치·속도를 가지고, 화면엔 transform으로만 반영 ───── */
  const world = useRef<World | null>(null);
  const els = useRef<Record<string, HTMLSpanElement | null>>({});
  const raf = useRef(0);
  const calm = useRef(0);

  const paint = useCallback(() => {
    world.current?.bodies.forEach((b, id) => {
      const el = els.current[id];
      if (el) el.style.transform = `translate(${b.x - BALL / 2}px, ${b.y - BALL / 2}px) rotate(${b.a}deg)`;
    });
  }, []);

  const wake = useCallback(() => {
    calm.current = 0;
    if (raf.current) return;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const w = world.current;
      if (!w) {
        raf.current = 0;
        return;
      }
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      let speed = 0;
      while (acc >= 1 / 120) {
        speed = Math.max(speed, step(w, 1 / 120));
        acc -= 1 / 120;
      }
      paint();
      calm.current = speed < 8 ? calm.current + 1 : 0;
      if (calm.current > 45) {
        raf.current = 0;
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [paint]);

  const dropIn = useCallback(
    (ids: CapsuleId[], settled = false) => {
      const w = world.current;
      if (!w) return;
      ids.forEach((id, k) => {
        const c = getCapsule(id);
        const x = (c.pos[0] / 100) * GLASS_W + (Math.random() * 16 - 8);
        const y = settled ? GLASS - c.pos[1] - BALL / 2 : -BALL - k * 70 - Math.random() * 30;
        addBody(w, id, x, y, (Math.random() - 0.5) * 60, 0);
      });
      wake();
    },
    [wake],
  );

  useEffect(() => {
    world.current = createWorld({ width: GLASS_W, height: GLASS, radius: BALL / 2, left: CHUTE_EDGE, right: GLASS_W });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    dropIn(ALL_IDS, reduce);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0; // 개발 모드(StrictMode)에서 두 번 실행돼도 다시 시작되게
    };
  }, [dropIn]);

  const timers = useRef<Timer[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const idle = phase === 'idle';
  const empty = pile.length === 0;

  /** 집게: 가장 가까운 캡슐로 이동 → 내려가 잡기 → 올라와 출구로 → 떨어뜨리기. 실패 없음. */
  const grab = () => {
    const w = world.current;
    if (!idle || empty || !w) return;
    const xOf = (id: CapsuleId) => ((w.bodies.get(id)?.x ?? 0) / GLASS_W) * 100;
    const target = [...pile].sort((a, b) => Math.abs(xOf(a) - clawX) - Math.abs(xOf(b) - clawX))[0];
    const tb = target && w.bodies.get(target);
    if (!target || !tb) return;
    tb.pinned = true;
    tb.vx = 0;
    tb.vy = 0;

    setPhase('busy');
    setOpen(true);
    setMoveMs(380);
    setClawX(xOf(target));
    later(420, () => setCable(cableFor(tb.y)));
    later(1180, () => {
      setOpen(false);
      impulseAround(w, tb.x, tb.y, 150, 320); // 집게가 닿으면 주변 캡슐이 들썩
      wake();
    });
    later(1460, () => {
      setHeld(target);
      removeBody(w, target); // 빠진 자리로 위 캡슐들이 떨어져요
      wake();
      setPile((p) => p.filter((k) => k !== target));
    });
    later(1600, () => setCable(REST));
    later(2380, () => {
      setMoveMs(900);
      setClawX(CHUTE);
    });
    later(3340, () => {
      setOpen(true);
      setHeld(null);
      setFallTop(CARRIAGE + REST + HEAD - OVER);
      setFalling(target);
    });
    later(3380, () => setFallTop(GLASS + 40));
    later(3960, () => {
      setFalling(null);
      setTray((t) => [...t, target]);
      setMoveMs(140);
      setPhase('idle');
    });
  };

  const refill = () => {
    const ids = ALL_IDS.filter((k) => !tray.includes(k));
    setPile(ids);
    dropIn(ids);
    setMoveMs(300);
    setClawX(50);
  };

  const track = (e: MouseEvent<HTMLButtonElement>) => {
    if (!idle) return;
    const r = e.currentTarget.getBoundingClientRect();
    setMoveMs(140);
    setClawX(clamp(((e.clientX - r.left) / r.width) * 100));
  };

  const nudge = (d: number) => {
    if (!idle) return;
    setMoveMs(200);
    setClawX((x) => clamp(x + d));
  };

  const openCapsule = useCallback(
    (id: CapsuleId) => {
      setTray((t) => t.filter((k) => k !== id));
      collect(id);
      setOpened(id);
    },
    [collect],
  );

  const closeNote = useCallback(() => setOpened(null), []);
  const closeCol = useCallback(() => setShowCol(false), []);

  const gotCount = ALL_IDS.filter((k) => got[k]).length;
  const heldCap = held ? getCapsule(held) : null;
  const fallCap = falling ? getCapsule(falling) : null;

  return (
    <div className="page gacha-page">
      <Nav home>
        <button type="button" className="colbtn" onClick={() => setShowCol(true)}>
          Collection <span className="cnt">{String(gotCount).padStart(2, '0')}</span>
        </button>
      </Nav>

      <section className={`stage-wrap bg-${bg}`} aria-label="프로젝트 뽑기 기계">
        {bg === 'grain' && <span aria-hidden="true" className="bg-layer grain" />}
        {bg === 'grid' && <span aria-hidden="true" className="bg-layer grid" />}
        {bg === 'studio' && (
          <>
            <span aria-hidden="true" className="bg-layer studio-light" />
            <span aria-hidden="true" className="bg-layer studio-floor" />
          </>
        )}
        {bg === 'pills' && <span aria-hidden="true" className="bg-layer pills" />}
        {bg === 'type' && (
          <div aria-hidden="true" className="bg-layer marquee">
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <div key={r} className={`mq-row ${r % 2 ? 'rev' : ''}`}>
                <span>PICK ONE · 뽑기 · PROJECT GACHA · PICK ONE · 뽑기 · PROJECT GACHA · </span>
                <span>PICK ONE · 뽑기 · PROJECT GACHA · PICK ONE · 뽑기 · PROJECT GACHA · </span>
              </div>
            ))}
          </div>
        )}
        {bg === 'orbs' && ORBS.map((o, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="orb"
            style={{
              left: o.left,
              right: o.right,
              top: o.top,
              bottom: o.bottom,
              width: o.size,
              height: o.size,
              background: o.color,
              animationDelay: `${o.delay}s`,
            }}
          />
        ))}

        <div className={`machine ${CLEAR_GLASS ? 'clear' : ''}`} style={{ zoom: scale }}>
          <button
            type="button"
            className={`glass ${CLEAR_GLASS ? 'clearg' : ''} ${idle ? '' : 'busy'}`}
            onMouseMove={track}
            onClick={grab}
            aria-label="뽑기 — 클릭하면 집게가 내려가요"
          >
            <span aria-hidden="true" className="rail" />
            <span aria-hidden="true" className="chute" />

            {pile.map((id) => (
              <span
                key={id}
                className="phys"
                ref={(el) => {
                  els.current[id] = el;
                  if (el) paint();
                }}
              >
                <Capsule capsule={getCapsule(id)} size={BALL} iconSize={34} soft={!CLEAR_GLASS} style={{ left: 0, top: 0 }} />
              </span>
            ))}

            {fallCap && (
              <Capsule
                capsule={fallCap}
                size={BALL}
                iconSize={34}
                style={{
                  left: `${CHUTE}%`,
                  top: fallTop,
                  marginLeft: -BALL / 2,
                  transition: 'top 520ms cubic-bezier(.55,0,1,.45)',
                }}
              />
            )}

            <span
              aria-hidden="true"
              className="claw"
              style={{ left: `${clawX}%`, transition: `left ${moveMs}ms cubic-bezier(.45,0,.3,1)` }}
            >
              <span className="carriage" />
              <span className="cable" style={{ height: cable }} />
              <span className="head">
                <span className={`prong l ${open ? 'open' : 'shut'}`} />
                <span className={`prong r ${open ? 'open' : 'shut'}`} />
                <span className="hub" />
              </span>
              {heldCap && (
                <Capsule capsule={heldCap} size={BALL} iconSize={34} className="held" />
              )}
            </span>

            <span className="shine" />
          </button>

          <div className="controls">
            <div className="tray" aria-label="나온 캡슐">
              {tray.map((id) => {
                const c = getCapsule(id);
                return (
                  <button key={id} type="button" className="trayball" onClick={() => openCapsule(id)} aria-label={`${c.tag} 열기`}>
                    <Capsule capsule={c} size={66} iconSize={26} />
                  </button>
                );
              })}
            </div>
            <div className="buttons">
              <button type="button" className="ctl" onClick={() => nudge(-8)} aria-label="집게 왼쪽으로">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 6l-6 6 6 6" /></svg>
              </button>
              <button
                type="button"
                className="big"
                onClick={empty ? refill : grab}
                disabled={!idle}
                aria-label={empty ? '다시 채우기' : '뽑기'}
              >
                {empty && (
                  <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true" fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
                    <path d="M20 4v5h-5" />
                  </svg>
                )}
              </button>
              <button type="button" className="ctl" onClick={() => nudge(8)} aria-label="집게 오른쪽으로">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {showCol && <CollectionSheet got={got} onOpen={openCapsule} onClose={closeCol} />}
      {opened && <RevealNote capsule={getCapsule(opened)} onClose={closeNote} />}
    </div>
  );
}
