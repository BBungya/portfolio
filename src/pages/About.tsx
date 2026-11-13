import type { ReactNode } from 'react';
import Nav from '../components/Nav';
import '../styles/about.css';

const SKILLS: [area: string, list: string][] = [
  ['Backend', 'Java, Spring Boot, Spring Security, JWT, JPA, PostgreSQL, MySQL, SQL'],
  ['Infra', 'AWS (EC2, RDS, S3), CI/CD, Vercel'],
  ['Mobile / Front', 'Kotlin, Android, React, HTML, CSS'],
  ['Language', 'C, Python'],
  ['Tools', 'Git / GitHub, Android Studio, IntelliJ, DataGrip, Figma, Unity'],
  ['Collaboration', 'Notion, Discord, Slack, Gather Town'],
];

const UMC: [role: string, desc: string][] = [
  ['9기 · 회장', '운영진 8명에게 직책별 업무와 기한을 나누고 Notion으로 진행 상황을 공유했어요. 운영 문서는 다음 기수에 인계했어요.'],
  ['7 · 8기 · Android 파트장', '신입 6명을 위해 API 연동·Git 워크북 부록을 만들고, 브랜치 생성부터 병합까지 실습을 진행했어요.'],
  ['기술지원 TF', '2개 팀의 코드 리뷰와 API 연결을 지원해, 두 팀 모두 데모데이까지 프로젝트를 완성했어요.'],
];

const AWARDS: [name: string, date: string][] = [
  ['데이터아키텍처 준전문가 (DAsP)', '2026.10'],
  ['TOEIC 800', '2026.08'],
  ['SQL 개발자 (SQLD)', '2025.04'],
  ['벤처 아카데미 아이디어톤 장려상 · AI 패션 추천 플랫폼 기획', '2024.11'],
];

const COURSES = ['데이터베이스개론', '자료구조', '알고리즘', '운영체제', '시스템프로그래밍', '네트워크', '웹프로그래밍', '웹/코드보안', '소프트웨어공학'];

interface BlockProps {
  label: string;
  children: ReactNode;
  /** 마지막 블록이면 아래 구분선을 없애요. */
  last?: boolean;
}

function Block({ label, children, last = false }: BlockProps) {
  return (
    <section className={`a-block ${last ? 'last' : ''}`}>
      <h2 className="a-label">{label}</h2>
      <div className="a-body">{children}</div>
    </section>
  );
}

function Line({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  return (
    <div className="a-line">
      <p className="a-big">{title}</p>
      <p className="muted small">{meta}</p>
    </div>
  );
}

export default function About() {
  return (
    <div className="page about-page">
      <span aria-hidden="true" className="a-orb one" />
      <span aria-hidden="true" className="a-orb two" />
      <Nav />

      <main className="container about-main">
        <section className="a-hero">
          <p className="muted small">백엔드 · 안드로이드 개발자</p>
          <h1 className="a-name">이소연</h1>
          <p className="a-intro">
            서비스 기획 의도를 이해하고, 그것을 데이터 구조와 API로 옮기는 일을 잘해요. 기능만 만드는 데서 멈추지 않고
            사용자의 문제와 서비스 흐름까지 생각하며 구조를 설계해요.
          </p>
          <div className="a-links">
            <a className="pill fill" href="mailto:leesoyeon.dev@gmail.com">
              leesoyeon.dev@gmail.com
            </a>
            <a className="pill" href="https://github.com/BBungya" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="pill" href="https://sylee111.tistory.com" target="_blank" rel="noreferrer">
              Blog
            </a>
          </div>
        </section>

        <div className="a-blocks">
          <Block label="Education">
            <Line title="동덕여자대학교 컴퓨터학과" meta="2022.03 – 2027.02 (예정) · 학점 3.48 / 4.5" />
            <Line title="와부고등학교" meta="2019.03 – 2022.01" />
          </Block>

          <Block label="Skills">
            <dl className="a-skills">
              {SKILLS.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block label="Activities">
            <Line title="IT 연합 동아리 UMC" meta="2024.09 – 2026.02" />
            <div className="a-cards">
              {UMC.map(([k, v]) => (
                <div key={k} className="a-card">
                  <p className="muted small">{k}</p>
                  <p>{v}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block label="Awards · Certificates">
            <ul className="a-list">
              {AWARDS.map(([k, v]) => (
                <li key={k}>
                  <span className="a-mid">{k}</span>
                  <span className="muted small">{v}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block label="Training">
            <Line title="청년 금융인재 양성 프로젝트 · 소프트웨어 집중교육 160시간" meta="2026.05 – 2026.07" />
            <p className="a-desc">금융 데이터 분석과 머신러닝, 생성형 AI 활용을 배우고 금융 서비스에 AI를 적용할 영역을 팀으로 분석했어요.</p>
          </Block>

          <Block label="Coursework" last>
            <p className="a-courses">{COURSES.join(' · ')}</p>
          </Block>
        </div>
      </main>
    </div>
  );
}
