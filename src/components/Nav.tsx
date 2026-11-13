import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavProps {
  home?: boolean;
  children?: ReactNode;
}

/** 오른쪽 위 메뉴. 홈에서는 Gacha 링크 대신 Collection 버튼(children)이 들어가요.
 *  화면이 좁아지면 햄버거 버튼 → 오른쪽 사이드바로 바뀌어요. */
export default function Nav({ home = false, children }: NavProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'on' : undefined);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="topbar">
      <button
        type="button"
        className="burger"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
        aria-controls="side-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <nav id="side-menu" className={`nav ${open ? 'open' : ''}`} aria-label="주요 메뉴" onClick={(e) => {
          if (e.target instanceof Element && e.target.closest('a,button')) setOpen(false);
        }}>
        {children}
        {!home && (
          <NavLink to="/" end className={cls}>
            Gacha
          </NavLink>
        )}
        <NavLink to="/about" className={cls}>
          About
        </NavLink>
        <a href="https://github.com/BBungya" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}
