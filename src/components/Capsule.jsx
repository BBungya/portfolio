import { capsuleFill } from '../data/capsules.js';

/**
 * 광택 있는 캡슐 구슬.
 * soft=true면 흐릿하게(기계 안 대기 상태), false면 선명하게.
 */
export default function Capsule({ capsule, size, iconSize, soft = false, className = '', style, withIcon = true }) {
  return (
    <span
      className={`cap ${soft ? 'soft' : 'sharp'} ${className}`}
      style={{ width: size, height: size, background: capsuleFill(capsule), ...style }}
    >
      {withIcon && (
        <span className="ic">
          <img src={capsule.icon} alt="" width={iconSize} height={iconSize} draggable="false" />
        </span>
      )}
    </span>
  );
}
