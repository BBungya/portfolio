import type { CSSProperties } from 'react';

/* ───────── 캡슐 ───────── */

export type ProjectId = 'chick' | 'sign' | 'cat' | 'card' | 'cocktail';
export type CapsuleId = ProjectId | 'about';

/** [하이라이트, 메인, 그림자] — 캡슐 그라데이션과 배경 빛 번짐에 사용 */
export type CapsuleColors = [highlight: string, main: string, shadow: string];

/** [x(%), bottom(px), 회전(deg)] — 유리창 안 처음 위치 */
export type CapsulePos = [xPercent: number, bottom: number, rotate: number];

/** [숫자, 설명, 보조 설명] */
export type Stat = [value: string, label: string, sub: string];

/** [제목, 본문] */
export type StoryRow = [title: string, body: string];

/** [이미지 주소, 대체 텍스트] */
export type Shot = [src: string, alt: string];

export interface Arch {
  ci: string[];
  server: { title: string; items: string[]; foot: string };
  /** [연결 방식, 대상] */
  deps: [label: string, name: string][];
}

export interface FlowDiagram {
  title: string;
  /** [단계 이름, 설명] */
  steps: [name: string, desc: string][];
  loop?: string;
  /** [항목, 내용] */
  checks?: [key: string, value: string][];
}

export interface Defects {
  title: string;
  /** [주입한 결함, 실패한 테스트 수] */
  rows: [name: string, failed: number][];
  note: string;
}

/** 기획이 바뀐 지점: 무엇에서 무엇으로, 왜, 개발에선 어떻게 반영했는지 */
export interface Pivot {
  title: string;
  /** [대상, 방향] */
  before: [target: string, direction: string];
  after: [target: string, direction: string];
  reason: string;
  applied: string;
}

/** 구현하면서 내린 판단 하나 */
export interface DecisionCase {
  title: string;
  problem: string;
  choice: string;
  steps: string[];
  /** 구현한 범위의 한계 (과장하지 않도록) */
  scope?: string;
  /** 근거 커밋 등 */
  evidence?: string;
}

export interface ProjectLinks {
  /** GitHub 저장소가 없으면 null (데모 버튼만 보여요) */
  repo: string | null;
  demo: string | null;
  demoLabel?: string;
}

interface CapsuleBase {
  icon: string;
  colors: CapsuleColors;
  pos: CapsulePos;
  tag: string;
  name: string;
  summary: string;
  role: string;
}

export interface ProjectCapsule extends CapsuleBase {
  id: ProjectId;
  type: 'project';
  tint: string;
  from: string;
  period: string;
  stackShort: string;
  stack: string;
  story: StoryRow[];
  links: ProjectLinks;
  stats?: Stat[];
  arch?: Arch;
  archImg?: string;
  flows?: FlowDiagram[];
  defects?: Defects;
  pivot?: Pivot;
  cases?: DecisionCase[];
  shots?: Shot[];
  shotFrame?: boolean;
}

export interface AboutCapsule extends CapsuleBase {
  id: 'about';
  type: 'about';
}

/** type 값으로 프로젝트/About을 구분해요. type === 'project'를 확인하면 프로젝트 필드를 쓸 수 있어요. */
export type Capsule = ProjectCapsule | AboutCapsule;

/* ───────── 프로토타입 ───────── */

export interface FlowScreen {
  src: string;
  label: string;
  /** 다음 화면으로 넘어가는 탭 위치 [x, y] (0~1). 마지막 화면은 null */
  hot: [x: number, y: number] | null;
}

export interface PrototypeFlow {
  title: string;
  landscape: boolean;
  screens: FlowScreen[];
}

/* ───────── 기타 ───────── */

/** 열어본 캡슐 기록 */
export type Collected = Partial<Record<CapsuleId, true>>;

/** style에 CSS 변수(--accent 등)를 함께 넘길 때 */
export type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;
