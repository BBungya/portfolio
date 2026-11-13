import { useEffect } from 'react';
import { CAPSULES } from '../data/capsules.js';
import Capsule from './Capsule.jsx';

/** Collection 버튼으로 여는 목록. 열어본 캡슐만 선명하고, 나머지는 흐릿하게 가려져요. */
export default function CollectionSheet({ got, onOpen, onClose }) {
  const count = CAPSULES.filter((c) => got[c.id]).length;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Collection">
      <div className="container sheet-inner">
        <div className="sheet-top">
          <button type="button" className="pill" onClick={onClose}>
            닫기
          </button>
        </div>
        <p className="giant-count">
          {String(count).padStart(2, '0')}
          <span>/{String(CAPSULES.length).padStart(2, '0')}</span>
        </p>
        <div className="rows">
          {CAPSULES.map((c) =>
            got[c.id] ? (
              <button key={c.id} type="button" className="row" onClick={() => onOpen(c.id)} aria-label={`${c.name} 다시 보기`}>
                <span className="dot">
                  <Capsule capsule={c} size={40} withIcon={false} />
                </span>
                <span className="t">{c.name}</span>
                <span className="d">{c.summary}</span>
                <span className="r">{c.role}</span>
              </button>
            ) : (
              <div key={c.id} className="row hidden" aria-label="아직 열지 않은 캡슐">
                <span className="dot">
                  <Capsule capsule={c} size={40} withIcon={false} soft />
                </span>
                <span className="t" aria-hidden="true">
                  {c.name}
                </span>
                <span className="d" aria-hidden="true">
                  {c.summary}
                </span>
                <span className="r">?</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
