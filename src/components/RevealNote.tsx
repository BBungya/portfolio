import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { capsuleTopFill } from '../data/capsules';
import type { Capsule } from '../types';

interface RevealNoteProps {
  capsule: Capsule;
  onClose: () => void;
}

/** 캡슐이 열리면서 쪽지가 펴지는 전체 화면 연출. */
export default function RevealNote({ capsule, onClose }: RevealNoteProps) {
  const navigate = useNavigate();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);


  return (
    <div className="reveal" role="dialog" aria-modal="true" aria-label={capsule.name}>
      <span aria-hidden="true" className="glow" style={{ background: capsule.colors[1] }} />
      <div className="stage">
        <span aria-hidden="true" className="half top" style={{ background: capsuleTopFill(capsule) }} />
        <span aria-hidden="true" className="half bot" />
        <div className="note">
          <span aria-hidden="true" className="crease" style={{ top: '33%' }} />
          <span aria-hidden="true" className="crease" style={{ top: '66%' }} />
          <div className="inner">
            <div className="note-head">
              <p className="muted small">{capsule.tag}</p>
              <img src={capsule.icon} alt="" width="64" height="64" />
            </div>
            <h2 className="note-title">{capsule.name}</h2>
            <p className="note-text">{capsule.summary}</p>
            {capsule.type === 'project' && (
              <dl className="meta-list">
                <dt>역할</dt>
                <dd>{capsule.role}</dd>
                <dt>활동</dt>
                <dd>
                  {capsule.from}, {capsule.period}
                </dd>
                <dt>스택</dt>
                <dd>{capsule.stackShort}</dd>
              </dl>
            )}
            <div className="note-actions">
              <button ref={closeRef} type="button" className="pill" onClick={onClose}>
                닫기
              </button>
              {capsule.type === 'project' ? (
                <button type="button" className="pill fill" onClick={() => navigate(`/projects/${capsule.id}`)}>
                  자세히 보기
                </button>
              ) : (
                <Link className="pill fill" to="/about">
                  About
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
