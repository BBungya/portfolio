import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { CapsuleId, Collected } from './types';
import Gacha from './pages/Gacha';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';

/** 열어본 캡슐 목록 — 페이지를 오가도 유지되고, 새로고침해도 기억해요. */
interface CollectionValue {
  got: Collected;
  collect: (id: CapsuleId) => void;
}

const CollectionContext = createContext<CollectionValue | null>(null);
const STORAGE_KEY = 'gacha:collected';

function readStored(): Collected {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Collected) : {};
  } catch {
    return {};
  }
}

export function useCollection(): CollectionValue {
  const value = useContext(CollectionContext);
  if (!value) throw new Error('useCollection은 <App> 안에서만 쓸 수 있어요.');
  return value;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [got, setGot] = useState<Collected>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(got));
    } catch {
      /* 저장소를 못 쓰는 환경이면 이번 방문 동안만 기억 */
    }
  }, [got]);

  const collect = useCallback((id: CapsuleId) => setGot((prev) => (prev[id] ? prev : { ...prev, [id]: true })), []);

  return (
    <CollectionContext.Provider value={{ got, collect }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Gacha />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CollectionContext.Provider>
  );
}
