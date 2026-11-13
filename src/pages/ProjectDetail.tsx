import { Link, Navigate, useParams } from 'react-router-dom';
import { PROJECTS, byId, capsuleFill } from '../data/capsules';
import Nav from '../components/Nav';
import { ArchDiagram, DecisionCases, DefectTable, Flow, PivotBlock, StatRow } from '../components/ProjectFigures';
import PhoneFlow from '../components/PhoneFlow';
import { FLOWS } from '../data/flows';
import '../styles/project.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const p = byId(id);
  if (!p || p.type !== 'project') return <Navigate to="/" replace />;

  const i = PROJECTS.findIndex((x) => x.id === p.id);
  const prev = PROJECTS[(i + PROJECTS.length - 1) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const no = String(i + 1).padStart(2, '0');
  const proto = FLOWS[p.id];

  return (
    <div className="page project-page">
      <Nav />
      <div className="container project-bar">
        <Link to="/" className="back">
          ← Gacha
        </Link>
        <div className="pager">
          <span className="muted small">
            {no} / {String(PROJECTS.length).padStart(2, '0')}
          </span>
          <Link to={`/projects/${prev.id}`} className="circle" aria-label="이전 프로젝트">
            ←
          </Link>
          <Link to={`/projects/${next.id}`} className="circle" aria-label="다음 프로젝트">
            →
          </Link>
        </div>
      </div>

      <main className="container project-main" key={p.id}>
        <section className="p-hero">
          <div className="p-hero-text">
            <p className="muted small">
              {p.tag}, Project {no}
            </p>
            <h1 className="p-title">{p.name}</h1>
            <p className="p-summary">{p.summary}</p>
          </div>
          <div className="p-orb" aria-hidden="true">
            <span className="p-glow" style={{ background: p.colors[1] }} />
            <span className="p-ball" style={{ background: capsuleFill(p) }}>
              <img src={p.icon} alt="" width="120" height="120" />
            </span>
          </div>
        </section>

        <dl className="p-meta">
          <div>
            <dt>역할</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>활동</dt>
            <dd>{p.from}</dd>
          </div>
          <div>
            <dt>기술 스택</dt>
            <dd>{p.stack}</dd>
          </div>
          <div>
            <dt>기간</dt>
            <dd>{p.period}</dd>
          </div>
        </dl>

        <section className="p-story" aria-label="프로젝트 이야기">
          {p.story.map(([title, body], k) => (
            <div key={title} className="p-story-row">
              <p className="p-num">{String(k + 1).padStart(2, '0')}</p>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </section>

        {proto && <PhoneFlow key={p.id} flow={proto} color={p.colors[1]} />}

        {p.stats && <StatRow stats={p.stats} color={p.colors[2]} />}
        {p.pivot && <PivotBlock pivot={p.pivot} color={p.colors[2]} />}
        {p.arch && <ArchDiagram arch={p.arch} color={p.colors[1]} img={p.archImg} name={p.name} />}
        {p.cases && <DecisionCases cases={p.cases} color={p.colors[2]} />}
        {p.flows && p.flows.map((f, k) => <Flow key={f.title} flow={f} index={k} color={p.colors[2]} />)}
        {p.defects && <DefectTable defects={p.defects} color={p.colors[2]} />}

        {/* 스크린샷: src/assets/shots/ 에 이미지를 넣고 아래 칸을 <img>로 바꿔주세요 */}
        {!proto && (
        <section className="p-shots" aria-label="스크린샷">
          {p.shots
            ? p.shots.map(([src, alt]) => (
                <figure key={src} className={`p-shot has-img ${p.shotFrame ? 'framed' : ''}`} style={{ background: p.tint }}>
                  <img src={src} alt={alt} loading="lazy" />
                </figure>
              ))
            : [1, 2, 3].map((n) => (
                <div key={n} className="p-shot" style={{ background: p.tint }}>
                  <p>[스크린샷 {n}]</p>
                </div>
              ))}
        </section>
        )}


        <div className="p-links">
          {p.links.repo && (
            <a className="pill fill" href={p.links.repo} target="_blank" rel="noreferrer">
              GitHub 저장소
            </a>
          )}
          {p.links.demo && (
            <a className={`pill ${p.links.repo ? '' : 'fill'}`} href={p.links.demo} target="_blank" rel="noreferrer">
              {p.links.demoLabel || '데모 보기'}
            </a>
          )}
        </div>

        <Link to={`/projects/${next.id}`} className="p-next">
          <span>
            <span className="muted small">다음 캡슐</span>
            <span className="p-next-name">{next.name}</span>
          </span>
          <span className="p-next-ball" aria-hidden="true" style={{ background: capsuleFill(next) }} />
        </Link>
      </main>
    </div>
  );
}
