import { useEffect, useRef, useState } from 'react';
import type { PrototypeFlow, StyleWithVars } from '../types';

interface PhoneFlowProps {
  flow: PrototypeFlow;
  color: string;
}

/**
 * 직접 눌러보는 미니 프로토타입.
 * - 화면에 보이면 움짤처럼 자동으로 넘어가고, 사용자가 누르면 자동 재생을 멈추고 직접 조작 모드로 바뀌어요.
 * - 깜빡이는 원이 '다음에 누를 곳'. 화면 아무 데나 눌러도 다음으로 넘어가요.
 */
const AUTO_MS = 2600;

export default function PhoneFlow({ flow, color }: PhoneFlowProps) {
  const { screens, landscape, title } = flow;
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tapFx, setTapFx] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const last = screens.length - 1;

  // 화면에 보일 때만 자동 재생
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!auto || !visible || reduce) return undefined;
    const t = setTimeout(() => {
      setTapFx((n) => n + 1);
      setI((x) => (x >= last ? 0 : x + 1));
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, visible, i, last]);

  // 이미지 미리 불러오기
  useEffect(() => {
    screens.forEach((s) => {
      const im = new Image();
      im.src = s.src;
    });
  }, [screens]);

  const go = (n: number) => {
    setAuto(false);
    setI(n);
  };
  const next = () => {
    setTapFx((n) => n + 1);
    go(i >= last ? 0 : i + 1);
  };

  const s = screens[i];
  const accentStyle: StyleWithVars = { '--accent': color };

  return (
    <section ref={ref} className={`pf ${landscape ? 'land' : ''}`} style={accentStyle} aria-label={`${title} 프로토타입`}>
      <div className="pf-device">
        <div className="pf-screen">
          <img key={s.src} src={s.src} alt={`${s.label} 화면`} className="pf-img" draggable={false} />
          {s.hot && (
            <span
              key={`hot-${i}-${tapFx}`}
              aria-hidden="true"
              className="pf-hot"
              style={{ left: `${s.hot[0] * 100}%`, top: `${s.hot[1] * 100}%` }}
            />
          )}
          <button type="button" className="pf-hit" onClick={next} aria-label={i >= last ? '처음으로' : `다음 화면: ${screens[i + 1].label}`} />
        </div>
      </div>

      <div className="pf-side">
        <p className="f-kicker">Prototype</p>
        <h2 className="f-title">{title}</h2>
        <p className="muted small pf-hint">{auto ? '자동 재생 중 · 화면을 누르면 직접 넘겨볼 수 있어요' : '깜빡이는 곳을 눌러 다음 화면으로'}</p>
        <ol className="pf-steps">
          {screens.map((st, k) => (
            <li key={st.src}>
              <button type="button" className={k === i ? 'on' : undefined} onClick={() => go(k)} aria-current={k === i ? 'step' : undefined}>
                <span className="pf-no">{String(k + 1).padStart(2, '0')}</span>
                <span>{st.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="pf-controls">
          <div className="pf-bar" aria-hidden="true">
            <span style={{ width: `${((i + 1) / screens.length) * 100}%` }} />
          </div>
          <button type="button" className="pill" onClick={() => setAuto((a) => !a)}>
            {auto ? '일시정지' : '자동 재생'}
          </button>
        </div>
      </div>
    </section>
  );
}
