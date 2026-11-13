/* 자세히 보기 페이지의 시각 자료: 수치, 아키텍처, 흐름도, 결함 탐지표.
   데이터는 src/data/capsules.ts 의 stats / arch / flows / defects 에서 와요. */
import type { Arch, Defects, FlowDiagram, Stat, StyleWithVars } from '../types';

/** --accent CSS 변수로 프로젝트 색을 넘겨요. */
const accent = (color: string, extra: Record<`--${string}`, string | number> = {}): StyleWithVars => ({ '--accent': color, ...extra });

export function StatRow({ stats, color }: { stats: Stat[]; color: string }) {
  return (
    <section className="f-stats" aria-label="주요 수치">
      {stats.map(([n, label, sub]) => (
        <div key={label} className="f-stat">
          <p className="f-stat-n" style={accent(color)}>
            {n}
          </p>
          <p className="f-stat-label">{label}</p>
          <p className="muted small">{sub}</p>
        </div>
      ))}
    </section>
  );
}

interface ArchDiagramProps {
  arch: Arch;
  color: string;
  /** 있으면 그림으로, 없으면 HTML 도식으로 보여줘요. */
  img?: string;
  name: string;
}

export function ArchDiagram({ arch, color, img, name }: ArchDiagramProps) {
  if (img) {
    return (
      <section className="f-block" aria-label="서비스 아키텍처">
        <p className="f-kicker">Architecture</p>
        <div className="arch-figure">
          <img src={img} alt={`${name} 서비스 아키텍처: GitHub Actions로 빌드해 EC2에 배포하고, Spring Boot 서버가 데이터베이스·S3·외부 서비스와 연동하는 구조`} />
        </div>
      </section>
    );
  }
  return (
    <section className="f-block" aria-label="서비스 아키텍처">
      <p className="f-kicker">Architecture</p>
      <div className="arch" style={accent(color)}>
        <div className="arch-left">
          <div className="arch-ci">
            {arch.ci.map((n, i) => (
              <div key={n} className="arch-ci-step">
                <span className="node">{n}</span>
                {i < arch.ci.length - 1 && (
                  <span className="arrow down" aria-hidden="true">
                    ↓
                  </span>
                )}
              </div>
            ))}
            <span className="edge-label">JAR →</span>
          </div>
          <div className="arch-client">
            <span className="node">Client</span>
            <span className="edge-label">HTTP / JSON ⟷</span>
          </div>
        </div>

        <div className="arch-server">
          <p className="arch-server-title">{arch.server.title}</p>
          <div className="arch-chips">
            {arch.server.items.map((n) => (
              <span key={n} className="chip">
                {n}
              </span>
            ))}
          </div>
          <p className="muted small">{arch.server.foot}</p>
        </div>

        <ul className="arch-deps">
          {arch.deps.map(([label, name]) => (
            <li key={name}>
              <span className="edge-label">⟷ {label}</span>
              <span className="node">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Flow({ flow, color, index }: { flow: FlowDiagram; color: string; index: number }) {
  return (
    <section className="f-block" aria-label={flow.title}>
      <p className="f-kicker">Flow {String(index + 1).padStart(2, '0')}</p>
      <h2 className="f-title">{flow.title}</h2>
      <ol className="flow" style={accent(color, { '--n': flow.steps.length })}>
        {flow.steps.map(([name, desc], i) => (
          <li key={name}>
            <span className="flow-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="flow-name">{name}</span>
            <span className="flow-desc">{desc}</span>
          </li>
        ))}
      </ol>
      {flow.loop && (
        <p className="flow-loop" style={accent(color)}>
          ↺ {flow.loop}
        </p>
      )}
      {flow.checks && (
        <dl className="f-checks">
          {flow.checks.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export function DefectTable({ defects, color }: { defects: Defects; color: string }) {
  const total = defects.rows.length;
  return (
    <section className="f-block defects" aria-label={defects.title}>
      <div className="defects-left">
        <p className="f-kicker">Failure analysis</p>
        <p className="defects-big" style={accent(color)}>
          {total}
          <span>/</span>
          {total}
        </p>
        <h2 className="f-title">{defects.title}</h2>
        <p className="muted small defects-note">{defects.note}</p>
      </div>
      <table className="defects-table">
        <thead>
          <tr>
            <th scope="col">주입한 결함</th>
            <th scope="col">실패한 테스트</th>
          </tr>
        </thead>
        <tbody>
          {defects.rows.map(([name, n]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
