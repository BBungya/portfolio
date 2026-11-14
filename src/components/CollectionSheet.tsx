import { useEffect } from 'react';
import { CAPSULES } from '../data/capsules';
import Capsule from './Capsule';
import type { CapsuleId, Collected } from '../types';

interface CollectionSheetProps {
  got: Collected;
  onOpen: (id: CapsuleId) => void;
  onClose: () => void;
}

/** Collection 버튼으로 여는 목록. 열어본 캡슐은 선명한 캡슐 점, 아직 안 연 캡슐은 흐린 점으로만 구분하고 모두 바로 열 수 있어요. */
export default function CollectionSheet({ got, onOpen, onClose }: CollectionSheetProps) {
  const count = CAPSULES.filter((c) => got[c.id]).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
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
          {CAPSULES.map((c) => {
            const seen = Boolean(got[c.id]);
            return (
              <button
                key={c.id}
                type="button"
                className={`row ${seen ? '' : 'unseen'}`}
                onClick={() => onOpen(c.id)}
                aria-label={seen ? `${c.name} 다시 보기` : `${c.name} 바로 보기 (아직 뽑지 않은 캡슐)`}
              >
                <span className="dot">
                  {seen ? (
                    <Capsule capsule={c} size={40} iconSize={24} />
                  ) : (
                    <Capsule capsule={c} size={40} withIcon={false} soft />
                  )}
                </span>
                <span className="t">{c.name}</span>
                <span className="d">{c.summary}</span>
                <span className="r">
                  <span className="r-role">{c.role}</span>
                  {!seen && (
                    <span className="r-open" aria-hidden="true">
                      바로 열기 →
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
