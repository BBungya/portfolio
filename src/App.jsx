import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Gacha from './pages/Gacha.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import About from './pages/About.jsx';

/** 열어본 캡슐 목록 — 페이지를 오가도 유지되고, 새로고침해도 기억해요. */
const CollectionContext = createContext(null);
const STORAGE_KEY = 'gacha:collected';

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useCollection() {
  return useContext(CollectionContext);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [got, setGot] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(got));
    } catch {
      /* 저장소를 못 쓰는 환경이면 이번 방문 동안만 기억 */
    }
  }, [got]);

  const collect = useCallback((id) => setGot((prev) => (prev[id] ? prev : { ...prev, [id]: true })), []);

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
